import cloudinary from "cloudinary";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// config Cloudinary
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "CLIENT") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await req.formData();
		const title = formData.get("title") as string;
		const category = formData.get("category") as string;
		const description = formData.get("description") as string;
		const files = formData.getAll("files") as File[];

		if (!title || !category || !description) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		const clientId = session.user.id;

		// 1. Save case
		const newCase = await prisma.case.create({
			data: {
				title,
				category,
				description,
				clientId,
			},
		});

		// 2. Upload file to Cloudinary + save metadata
		for (const file of files) {
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			const uploadRes = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
				cloudinary.v2.uploader
					.upload_stream({ folder: "cases" }, (error, result) => {
						if (error || !result) return reject(error);
						resolve(result);
					})
					.end(buffer);
			});

			await prisma.file.create({
				data: {
					caseId: newCase.id,
					storagePath: uploadRes.secure_url,
					originalName: file.name,
					mimeType: file.type,
					size: file.size,
				},
			});
		}

		return NextResponse.json({ success: true, case: newCase });
	} catch (error) {
		console.error("Case creation error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
