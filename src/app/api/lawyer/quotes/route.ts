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

		const title = searchParams.get("title") || "";
		const category = searchParams.get("category") || "";
		const status = searchParams.getAll("status")
			.flatMap((v) => v.split(','))
			.filter(Boolean) || [];
		const sortBy = searchParams.get("sort") || "";

		const where: any = { 
			lawyerId,
			...(status.length > 0 && { status: { in: status } }),

			...(title || category ? {
				case: {
					...(title && {
						title: {
							contains: title,
							mode: "insensitive",
						},
					}),
					...(category && {
						category: category,
					}),
				},
			} : {}),
		};

		let orderBy: any = { createdAt: "desc" };
		if (sortBy === "oldest") orderBy = { createdAt: "asc" };

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
				orderBy,
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
