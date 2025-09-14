import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/auth";
import { CaseStatusEnum, PaymentStatusEnum, QuoteStatusEnum, UserRoleEnum } from "@/commons/enum";

export async function GET(req: Request, { params }: { params: Promise<{ caseId: string }> }) {
	try {
		const { caseId } = await params;

		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const role = session.user.role;

		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			include: {
				files: {
					select: {
						id: true,
						originalName: true,
						mimeType: true,
						size: true,
						createdAt: true,
					},
				},
				_count: {
					select: { quotes: true },
				},
			},
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found" }, { status: 404 });
		}

		// Access Control
		if (role === UserRoleEnum.CLIENT || role === UserRoleEnum.ADMIN) {
			if (role === UserRoleEnum.CLIENT && caseData.clientId !== userId) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
			return NextResponse.json(caseData);
		}

		if (role === UserRoleEnum.LAWYER) {
			const myQuoteData = await prisma.quote.findFirst({
				where: {
					caseId: caseData.id,
					lawyerId: userId,
				},
			});

			if (myQuoteData?.status === QuoteStatusEnum.ACCEPTED && caseData.status === CaseStatusEnum.ENGAGED) {
				// Check Payment Status must "paid"
				const payment = await prisma.payment.findFirst({
					where: {
						caseId: caseData.id,
						lawyerId: userId,
						status: PaymentStatusEnum.SUCCEEDED,
					},
				});

				if (payment) {
					// lawyer accepted + payment success → full detail
					return NextResponse.json(caseData);
				} else {
					// accepted but payment not completed → hide files
					const { files, ...safeCase } = caseData as any;
					return NextResponse.json(safeCase);
				}
			} else {
				// anothers lawyer → case detail without files
				const { files, ...safeCase } = caseData;
				return NextResponse.json(safeCase);
			}
		}

		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	} catch (error) {
		console.error("Case detail error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PATCH(req: Request, { params }: { params: Promise<{ caseId: string }> }) {
	try {
		const { caseId } = await params;

		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const role = session.user.role;

		const formData = await req.formData();
		const title = formData.get("title") as string | null;
		const category = formData.get("category") as string | null;
		const description = formData.get("description") as string | null;
		const files = formData.getAll("files") as File[];

		const caseData = await prisma.case.findUnique({
			where: { id: caseId },
			include: { quotes: true, files: true },
		});

		if (!caseData) {
			return NextResponse.json({ error: "Case not found" }, { status: 404 });
		}

		// Only for data owner
		if (role !== "CLIENT" || caseData.clientId !== userId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		if (caseData.status !== "OPEN") {
			return NextResponse.json({ error: "Only open cases can be updated" }, { status: 400 });
		}

		if (caseData.quotes.length > 0) {
			return NextResponse.json({ error: "Cannot update case after quotes have been submitted" }, { status: 400 });
		}

		// Check files limit
		if (caseData.files.length + files.length > 10) {
			return NextResponse.json({ error: "File limit exceeded (max 10 files per case)" }, { status: 400 });
		}

		// Upload files ke Cloudinary
		const uploadedFiles: any[] = [];
		for (const file of files) {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const uploadRes = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
				cloudinary.v2.uploader
					.upload_stream({ folder: "cases", type: "authenticated", resource_type: "auto" }, (error, result) => {
						if (error || !result) return reject(error);
						resolve(result);
					})
					.end(buffer);
			});

			uploadedFiles.push({
				storagePath: uploadRes.public_id,
				originalName: file.name,
				mimeType: file.type,
				size: file.size,
			});
		}

		// update case data
		const updatedCase = await prisma.case.update({
			where: { id: caseId },
			data: {
				title: title ?? caseData.title,
				category: category ?? caseData.category,
				description: description ?? caseData.description,
				files: { create: uploadedFiles },
			},
			include: { files: true },
		});

		return NextResponse.json(updatedCase);
	} catch (err) {
		console.error("Update case error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
