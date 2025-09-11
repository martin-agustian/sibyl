import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== "LAWYER") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const caseId = params.id;

		const caseData = await prisma.case.findUnique({
			where: { id: caseId, status: "OPEN" }, // cuma OPEN cases
			// include: {
			// 	quotes: {
			// 		include: {
			// 			lawyer: { select: { id: true, name: true } },
			// 		},
			// 	},
			// },
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found or not open" }, { status: 404 });
		}

		// 🚫 Jangan kasih files
		const { files, ...safeCase } = caseData as any;

		return NextResponse.json(safeCase);
	} catch (error) {
		console.error("Marketplace case detail error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
