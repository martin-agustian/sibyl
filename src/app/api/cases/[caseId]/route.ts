import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CaseStatusEnum, PaymentStatusEnum, QuoteStatusEnum, UserRoleEnum } from "@/commons/enum";

export async function GET(req: Request, { params }: { params: { caseId: string } }) {
	try {
		const { caseId } = await params;

		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		
		const userId = session.user.id;
		const role = session.user.role;

		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			include: {
				files: {
					select: {
						id: true,
						originalName: true,
						mimeType: true,
						size: true,
						createdAt: true,
					},
				},
			},
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found" }, { status: 404 });
		}

		// Access Control
		if (role === UserRoleEnum.CLIENT) {
			if (caseData.clientId !== userId) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
			return NextResponse.json(caseData);
		}

		if (role === UserRoleEnum.LAWYER) {
			const myQuoteData = await prisma.quote.findFirst({
				where: { 
					caseId: caseData.id,
					lawyerId: userId, 
				}
			});

			if (myQuoteData?.status === QuoteStatusEnum.ACCEPTED && caseData.status === CaseStatusEnum.ENGAGED) {
				// ✅ Check Payment Status must "paid"
				const payment = await prisma.payment.findFirst({
					where: {
						caseId: caseData.id,
						lawyerId: userId,
						status: PaymentStatusEnum.SUCCEEDED,
					},
				});

				if (payment) {
					// lawyer accepted + payment success → full detail
					return NextResponse.json(caseData);
				} else {
					// accepted but payment not completed → hide files
					const { files, ...safeCase } = caseData as any;
					return NextResponse.json(safeCase);
				}
			} else {
				// anothers lawyer → case detail without files
				const { files, ...safeCase } = caseData;
				return NextResponse.json(safeCase);
			}
		}

		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	} catch (error) {
		console.error("Case detail error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
