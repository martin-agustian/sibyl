import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ notificationId: string }> }) {
	try {
		const { notificationId } = await params;

		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;

		const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
		if (!notification || notification.userId !== userId) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const updated = await prisma.notification.update({
			where: { id: notificationId },
			data: { read: true },
		});

		return NextResponse.json(updated);
	} catch (err) {
		console.error("Mark notification read error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
