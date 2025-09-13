import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";

export async function PATCH(req: Request, { params }: { params: { caseId: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const role = session.user.role;
		const { caseId } = params;

		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			include: { lawyer: true, client: true },
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found" }, { status: 404 });
		}

		// Only client owner able to closed
		if (role !== "CLIENT" || caseData.clientId !== userId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Only case ENGAGED can be closed
		if (caseData.status !== "ENGAGED") {
			return NextResponse.json({ error: "Case cannot be closed in current status" }, { status: 400 });
		}

		const closedCase = await prisma.case.update({
			where: { id: caseId },
			data: { status: "CLOSED" },
		});

		// Notify to client
		await prisma.notification.create({
			data: {
				userId: caseData.clientId,
				type: "CASE",
				message: `You closed case "${caseData.title}".`,
			},
		});

		// Notify to lawyer
		if (caseData.lawyerId) {
			await prisma.notification.create({
				data: {
					userId: caseData.lawyerId,
					type: "CASE",
					message: `Case "${caseData.title}" has been closed by the client.`,
				},
			});
		}
		
		if (caseData.client) {
			await sendMail(
				caseData.client.email,
				"Case Has Been Close",
				`<p>Hi ${caseData.client.name ?? "User"},</p>
				<p>Your for case <b>${caseData.title}</b> has been closed.</p>`
			);
		}
		if (caseData.lawyer) {
			await sendMail(
				caseData.lawyer.email,
				"Case Has Been Close",
				`<p>Hi ${caseData.lawyer.name},</p>
				<p>Case <b>${caseData.title}</b> has been mark as close by the client</p>`
			);
		}

		return NextResponse.json(closedCase);
	} catch (err) {
		console.error("Close case error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
