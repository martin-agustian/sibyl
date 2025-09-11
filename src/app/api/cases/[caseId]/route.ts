import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
		if (role === "CLIENT") {
			if (caseData.clientId !== userId) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
			return NextResponse.json(caseData);
		}

		if (role === "LAWYER") {
			const myQuoteData = await prisma.quote.findFirst({
				where: { 
					caseId: caseData.id,
					lawyerId: userId, 
				}
			});

			if (myQuoteData?.status === "ACCEPTED" && caseData.status === "ENGAGED") {
				// ✅ cek payment status harus "paid"
				const payment = await prisma.payment.findFirst({
					where: {
						caseId: caseData.id,
						lawyerId: userId,
						status: "SUCCEEDED",
					},
				});

				if (payment) {
					// lawyer accepted + payment sukses → bisa lihat detail lengkap
					return NextResponse.json(caseData);
				} else {
					// accepted tapi payment belum beres → hide files
					const { files, ...safeCase } = caseData as any;
					return NextResponse.json(safeCase);
				}
			} else {
				// lawyer lain → case detail tanpa file
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
