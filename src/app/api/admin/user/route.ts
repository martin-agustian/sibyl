import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRoleEnum } from "@/commons/enum";

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== UserRoleEnum.ADMIN) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);

		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

		const where: any = {};

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					emailVerif: true,
					accountVerif: true,
					createdAt: true,
				},
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.user.count({ where }),
		]);

		return NextResponse.json({
			users,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		});
	} catch (err) {
		console.error("User list error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
