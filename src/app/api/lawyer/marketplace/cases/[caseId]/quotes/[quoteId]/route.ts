import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CaseStatusEnum, QuoteStatusEnum, UserRoleEnum } from "@/commons/enum";

export async function PATCH(req: Request, { params }: { params: Promise<{ caseId: string; quoteId: string }> }) {
	try {
		const { caseId, quoteId } = await params;

		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== UserRoleEnum.LAWYER) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const lawyerId = session.user.id;

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