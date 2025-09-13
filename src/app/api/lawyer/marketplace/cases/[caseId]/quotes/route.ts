import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { CaseStatusEnum, QuoteStatusEnum, UserRoleEnum } from "@/commons/enum";

export async function POST(req: Request, { params }: { params: { caseId: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== UserRoleEnum.LAWYER) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const lawyerId = session.user.id;
		const caseId = params.caseId;
		
		const body = await req.json();
		const { amount, expectedDays, note } = body;

		if (!amount || !expectedDays) {
			return NextResponse.json({ error: "Amount and expectedDays are required" }, { status: 400 });
		}

		// Check if still OPEN
		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
      include: { client: true }
		});

		if (!caseData || caseData.status !== CaseStatusEnum.OPEN) {
			return NextResponse.json({ error: "Case not found or not open" }, { status: 400 });
		}

		// Check lawyer already submitted
		const existingQuote = await prisma.quote.findFirst({
			where: { caseId, lawyerId },
		});

		if (existingQuote) {
			return NextResponse.json({ error: "You already submitted a quote for this case" }, { status: 400 });
		}

		// Save new quote
		const newQuote = await prisma.quote.create({
			data: {
				caseId,
				lawyerId,
				amount,
				expectedDays,
				note: note || "",
				status: QuoteStatusEnum.PROPOSED,
			},
		});

    await prisma.notification.create({
      data: {
        userId: caseData.clientId,
        type: "QUOTE",
        message: `Your case "${caseData.title}" received a new quote.`,
      },
    });

    await sendMail(
      caseData.client.email,
      "New Quote Received",
      `<p>Hi ${caseData.client.name},</p>
      <p>Your case <b>${caseData.title}</b> has received a new quote from a lawyer.</p>`
    );

		return NextResponse.json({ success: true, quote: newQuote });
	} catch (error) {
		console.error("Submit quote error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PATCH(req: Request, { params }: { params: { caseId: string; quoteId: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== UserRoleEnum.LAWYER) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const lawyerId = session.user.id;
		const { caseId, quoteId } = params;

		const body = await req.json();
		const { amount, expectedDays, note } = body;

		// Check if still OPEN
		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			select: { status: true },
		});

		if (!caseData || caseData.status !== CaseStatusEnum.OPEN) {
			return NextResponse.json({ error: "Case not found or not open" }, { status: 400 });
		}

		// Check for quotes submitted by this lawyer
		const quote = await prisma.quote.findUnique({
			where: { id: quoteId },
		});

		if (!quote || quote.lawyerId !== lawyerId) {
			return NextResponse.json({ error: "Quote not found or not owned by you" }, { status: 403 });
		}

		if (quote.status !== QuoteStatusEnum.PROPOSED) {
			return NextResponse.json({ error: "Quote cannot be updated after it is accepted/rejected" }, { status: 400 });
		}

		// Update quote
		const updatedQuote = await prisma.quote.update({
			where: { id: quoteId },
			data: {
				amount: amount ?? quote.amount,
				expectedDays: expectedDays ?? quote.expectedDays,
				note: note ?? quote.note,
			},
		});

		return NextResponse.json({ success: true, quote: updatedQuote });
	} catch (error) {
		console.error("Update quote error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
