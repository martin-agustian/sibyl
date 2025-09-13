import Stripe from "stripe";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CaseStatusEnum, UserRoleEnum } from "@/commons/enum";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request, { params }: { params: Promise<{ caseId: string; quoteId: string }> }) {
	try {
		const { caseId, quoteId } = await params;

		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== UserRoleEnum.CLIENT) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const clientId = session.user.id;

		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			include: { quotes: true },
		});

		if (!caseData || caseData.clientId !== clientId) {
			return NextResponse.json({ error: "Case not found or not owned by you" }, { status: 403 });
		}

		if (caseData.status !== CaseStatusEnum.OPEN) {
			return NextResponse.json({ error: "Case is not open" }, { status: 400 });
		}

		const quote = caseData.quotes.find((q) => q.id === quoteId);
		if (!quote) {
			return NextResponse.json({ error: "Quote not found" }, { status: 404 });
		}

		// Stripe Checkout Session
		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "usd",
						unit_amount: Math.round(Number(quote.amount) * 100), // cents
						product_data: {
							name: `Case: ${caseData.title}`,
							description: `Quote by lawyer`,
						},
					},
					quantity: 1,
				},
			],
			success_url: `${process.env.APP_URL}/client/cases/${caseId}?payment-status=success`,
			cancel_url: `${process.env.APP_URL}/client/cases/${caseId}?payment-status=failed`,
		});

		// Save Payment record
		await prisma.payment.create({
			data: {
				caseId,
				quoteId,
				clientId,
				lawyerId: quote.lawyerId,
				amount: quote.amount,
				currency: "usd",
				status: "PENDING",
				stripeSessionId: checkoutSession.id,
			},
		});

		return NextResponse.json({
			success: true,
			checkoutUrl: checkoutSession.url,
		});
	} catch (error) {
		console.error("Accept quote error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
