import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // if success
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await prisma.payment.findFirst({
        where: { stripeSessionId: session.id },
        include: {
          client: true,
          lawyer: true,
          case: true,
        },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCEEDED" },
        });

        await sendMail(
          payment.client.email,
          "Payment Success",
          `<p>Hi ${payment.client.name ?? "User"},</p>
          <p>Your payment for case <b>${payment.case.title}</b> has been confirmed.</p>`
        );

        await sendMail(
          payment.lawyer.email,
          "Your Quote Has Been Accepted 🎉",
          `<p>Hi ${payment.lawyer.name},</p>
          <p>Your quote for case <b>${payment.case.title}</b> has been accepted by the client. Please wait for payment confirmation.</p>`
        )

        await prisma.notification.createMany({
          data: [
            {
              userId: payment.clientId,
              type: "PAYMENT",
              message: `Your payment for case "${payment.case.title}" was successful.`,
            },
            {
              userId: payment.lawyerId,
              type: "CASE",
              message: `You have been engaged for case "${payment.case.title}".`,
            },
          ],
        });
        
      }
    }

    // if failed
    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const payment = await prisma.payment.findFirst({
        where: { stripeSessionId: session.id },
        include: {
          client: true,
          lawyer: true,
          case: true,
        },
      });

      if (payment) {
        // rollback: case -> OPEN, accepted quote -> PROPOSED
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          }),
          prisma.case.update({
            where: { id: payment.caseId },
            data: { status: "OPEN", lawyerId: null },
          }),
          prisma.quote.update({
            where: { id: payment.quoteId },
            data: { status: "PROPOSED" },
          }),
        ]);

        await sendMail(
          payment.client.email,
          "Payment Failed ❌",
          `<p>Hi ${payment.client.name},</p>
          <p>Your payment for case <b>${payment.case.title}</b> has failed. Please try again.</p>`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
