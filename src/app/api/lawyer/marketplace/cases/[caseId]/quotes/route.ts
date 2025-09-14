import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { CaseStatusEnum, QuoteStatusEnum, UserRoleEnum } from "@/commons/enum";

export async function POST(req: Request, { params }: { params: Promise<{ caseId: string }> }) {
	try {
		const { caseId } = await params;

		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== UserRoleEnum.LAWYER) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const lawyerId = session.user.id;
		
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
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
