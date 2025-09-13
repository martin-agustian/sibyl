import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRoleEnum } from "@/commons/enum";

export async function GET(req: Request, { params }: { params: Promise<{ caseId: string }> }) {
	try {
    const { caseId } = await params;
		const { searchParams } = new URL(req.url);

		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const role = session.user.role;

		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
		const status = searchParams.get("status") || "";

		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			select: { clientId: true, status: true },
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found" }, { status: 404 });
		}

		// Access control
		if (role === UserRoleEnum.CLIENT) {
			if (caseData.clientId !== userId) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
		}

		// Build filter
		const where: any = { caseId };
		if (status) where.status = status;

    if (role === UserRoleEnum.LAWYER) {
      where.lawyerId = userId;
    }

		const [quotes, total] = await Promise.all([
			prisma.quote.findMany({
				where,
				include: {
					lawyer: { select: { id: true } },
				},
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.quote.count({ where }),
		]);

		return NextResponse.json({
			quotes,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
