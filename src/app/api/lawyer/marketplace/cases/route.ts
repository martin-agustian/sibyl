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

		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
		const title = searchParams.get("title") || "";
		const category = searchParams.get("category") || "";
		const createdSince = searchParams.get("createdSince");

		const where: any = { status: "OPEN" };
		if (title) where.title = { contains: title, mode: "insensitive" };
		if (category) where.category = category;
		if (createdSince) where.createdAt = { gte: new Date(createdSince) };

		const [cases, total] = await Promise.all([
			prisma.case.findMany({
				where,
				include: {
					_count: { select: { quotes: true } }, // biar lawyer tahu sudah berapa quote
				},
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.case.count({ where }),
		]);

		return NextResponse.json({
			cases,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		});
	} catch (error) {
		console.error("Marketplace cases error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
