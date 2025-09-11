import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
	const sig = req.headers.get("stripe-signature")!;
	const rawBody = await req.text();

	try {
		const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);

		if (event.type === "checkout.session.completed") {
			const session = event.data.object as Stripe.Checkout.Session;
			const payment = await prisma.payment.findFirst({
				where: { stripeSessionId: session.id },
			});

			if (payment) {
				await prisma.payment.update({
					where: { id: payment.id },
					data: { status: "SUCCEEDED" },
				});
			}
		}

		if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
			const session = event.data.object as Stripe.Checkout.Session;
			const payment = await prisma.payment.findFirst({
				where: { stripeSessionId: session.id },
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
			}
		}

		return NextResponse.json({ received: true });
	} catch (err) {
		console.error("Stripe webhook error:", err);
		return NextResponse.json({ error: "Webhook error" }, { status: 400 });
	}
}
