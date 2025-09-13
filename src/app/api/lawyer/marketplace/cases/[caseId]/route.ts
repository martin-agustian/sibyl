import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CaseStatusEnum, UserRoleEnum } from "@/commons/enum";

export async function GET(req: Request, { params }: { params: Promise<{ caseId: string }> }) {
	try {
		const { caseId } = await params;

		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== UserRoleEnum.LAWYER) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const caseData = await prisma.case.findUnique({
			where: { id: caseId, status: CaseStatusEnum.OPEN },
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found or not open" }, { status: 404 });
		}

		// Remove files
		const { files, ...safeCase } = caseData as any;

		return NextResponse.json(safeCase);
	} catch (error) {
		console.error("Marketplace case detail error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
