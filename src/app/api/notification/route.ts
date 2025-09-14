import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const { searchParams } = new URL(req.url);

		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
		const readFilter = searchParams.get("read");

		const where: any = { userId };
		if (readFilter === "true") where.read = true;
		if (readFilter === "false") where.read = false;

		const [notifications, total] = await Promise.all([
			prisma.notification.findMany({
				where,
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.notification.count({ where }),
		]);

		return NextResponse.json({
			notifications,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		});
	} catch (err) {
		console.error("Notification list error:", err);
		return NextResponse.json({ error: err }, { status: 500 });
	}
}
