import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CaseStatusEnum, PaymentStatusEnum, QuoteStatusEnum, UserRoleEnum } from "@/commons/enum";

export async function GET(req: Request, { params }: { params: Promise<{ caseId: string; fileId: string }> }) {
	try {
		const { caseId, fileId } = await params;

		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const role = session.user.role;

		const file = await prisma.file.findUnique({
			where: { id: fileId },
			include: { case: { include: { quotes: true } } },
		});

		if (!file || file.caseId !== caseId) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		const caseData = file.case;

		// Access Control
		if (role === UserRoleEnum.CLIENT) {
			if (caseData.clientId !== userId) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
		} else if (role === UserRoleEnum.LAWYER) {
			const myQuote = caseData.quotes.find((q) => q.lawyerId === userId);
			if (!(myQuote?.status === QuoteStatusEnum.ACCEPTED && caseData.status === CaseStatusEnum.ENGAGED)) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}

			// Check Payment must paid
			const payment = await prisma.payment.findFirst({
				where: {
					caseId: caseData.id,
					lawyerId: userId,
					status: PaymentStatusEnum.SUCCEEDED,
				},
			});

			if (!payment) {
				return NextResponse.json({ error: "Payment not completed" }, { status: 403 });
			}
		} else {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Generate signed URL (short-lived)
		const signedUrl = cloudinary.v2.utils.private_download_url(
			file.storagePath, // public_id (not secure_url)
			file.mimeType.includes("pdf") ? "pdf" : "jpg", // resource type
			{
				type: "authenticated",
				expires_at: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes
			}
		);

		const cloudinaryRes = await fetch(signedUrl);
		if (cloudinaryRes.ok) {
			// Stream file to client with download headers
			const readable = cloudinaryRes.body;

			return new NextResponse(readable, {
				status: 200,
				headers: {
					"Content-Type": file.mimeType,
					"Content-Disposition": `attachment; filename="${file.originalName}"`,
					"Cache-Control": "no-cache",
				},
			});
		} else {
			return NextResponse.json({ error: "Failed to fetch file from Cloudinary" }, { status: 500 });
		}
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: { params: { caseId: string; fileId: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const role = session.user.role;
		const { caseId, fileId } = params;

		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			include: { quotes: true, client: true, files: true },
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found" }, { status: 404 });
		}

		if (role !== "CLIENT" || caseData.clientId !== userId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		if (caseData.status !== "OPEN") {
			return NextResponse.json({ error: "Cannot delete file unless case is OPEN" }, { status: 400 });
		}

		if (caseData.quotes.length > 0) {
			return NextResponse.json({ error: "Cannot delete file after quotes have been submitted" }, { status: 400 });
		}

		// search file
		const file = caseData.files.find((f) => f.id === fileId);
		if (!file) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		// delete file in cloudinary
		try {
			await cloudinary.v2.uploader.destroy(file.id);
		} catch (err) {
			console.error("Cloudinary delete failed:", err);
		}

		// delete file in db
		await prisma.file.delete({ where: { id: fileId } });

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("Delete file error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
