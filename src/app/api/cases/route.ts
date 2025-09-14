import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/auth";
import { UserRoleEnum } from "@/commons/enum";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== UserRoleEnum.CLIENT) {
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
					.upload_stream({ folder: "cases", type: "authenticated", resource_type: "auto" }, (error, result) => {
						if (error || !result) return reject(error);
						resolve(result);
					})
					.end(buffer);
			});

			await prisma.file.create({
				data: {
					caseId: newCase.id,
					storagePath: uploadRes.public_id,
					originalName: file.name,
					mimeType: file.type,
					size: file.size,
				},
			});
		}

		return NextResponse.json({ success: true, case: newCase });
	} catch (error) {
		console.error("Case creation error:", error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || (session.user.role !== UserRoleEnum.CLIENT && session.user.role !== UserRoleEnum.ADMIN)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
		const title = searchParams.get("title") || "";
		const category = searchParams.get("category") || "";
		const status = searchParams.getAll("status")
				.flatMap((v) => v.split(','))
				.filter(Boolean) || [];
		const sortBy = searchParams.get("sort") || "";

		const where: any = {};
		if (session.user.role == UserRoleEnum.CLIENT) where.clientId = session.user.id;
		if (title) where.title = { contains: title, mode: "insensitive" };
		if (status.length > 0) where.status = { in: status };
		if (category) where.category = category;

		let orderBy: any = { createdAt: "desc" };
		if (sortBy === "oldest") orderBy = { createdAt: "asc" };

		const [cases, total] = await Promise.all([
			prisma.case.findMany({
				where,
				include: { _count: { select: { quotes: true } } },
				orderBy,
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
		console.error("Case creation error:", error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
