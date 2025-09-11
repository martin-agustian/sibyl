import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "cloudinary";

// Config Cloudinary
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request, { params }: { params: { caseId: string; fileId: string } }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { caseId, fileId } = params;
		const userId = session.user.id;
		const role = session.user.role;

		// Ambil case + file
		const file = await prisma.file.findUnique({
			where: { id: fileId },
			include: { case: { include: { quotes: true } } },
		});

		if (!file || file.caseId !== caseId) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		const caseData = file.case;

		// 🔒 Access Control
		if (role === "CLIENT") {
			if (caseData.clientId !== userId) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
		} 
		else if (role === "LAWYER") {
			const myQuote = caseData.quotes.find((q) => q.lawyerId === userId);
			if (!(myQuote?.status === "ACCEPTED" && caseData.status === "ENGAGED")) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}

			// ✅ cek payment harus paid
			const payment = await prisma.payment.findFirst({
				where: {
					caseId: caseData.id,
					lawyerId: userId,
					status: "SUCCEEDED",
				},
			})

			if (!payment) {
				return NextResponse.json(
					{ error: "Payment not completed" },
					{ status: 403 }
				)
			}
		} 
		else {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// ✅ Generate signed URL (short-lived)
		const signedUrl = cloudinary.v2.utils.private_download_url(
			file.storagePath, // public_id (bukan secure_url)
			file.mimeType.includes("pdf") ? "pdf" : "jpg", // resource type
			{
				type: "authenticated",
				expires_at: Math.floor(Date.now() / 1000) + 60 * 5, // 5 menit
			}
		);

		return NextResponse.json({ url: signedUrl });
	} catch (error) {
		console.error("File download error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
