import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const caseId = params.id;
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
				quotes: {
					include: {
						lawyer: { select: { id: true, name: true, email: true } },
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
			const myQuote = caseData.quotes.find((q) => q.lawyerId === userId);

			if (myQuote?.status === "ACCEPTED" && caseData.status === "ENGAGED") {
				// accepted lawyer → bisa lihat case detail + file metadata
				return NextResponse.json(caseData);
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
