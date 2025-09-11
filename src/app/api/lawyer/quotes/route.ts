import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== "LAWYER") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const lawyerId = session.user.id;
		const { searchParams } = new URL(req.url);

		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
		const status = searchParams.get("status") || "";

		const where: any = { lawyerId };
		if (status) where.status = status;

		const [quotes, total] = await Promise.all([
			prisma.quote.findMany({
				where,
				include: {
					case: {
						select: {
							id: true,
							title: true,
							category: true,
							status: true,
							createdAt: true,
						},
					},
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
		console.error("List my quotes error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
