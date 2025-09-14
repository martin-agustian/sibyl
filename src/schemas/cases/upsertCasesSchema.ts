import { z } from "zod";
import { LAW_CATEGORIES } from "@/commons/constant";

const CATEGORIES = LAW_CATEGORIES.map((category) => category.value);

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

export const upsertCasesSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	category: z.enum(CATEGORIES, "Category is required"),
	files: z
		.array(
			z
				.instanceof(File)
				.refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), "Only PDF, PNG, or JPEG files are allowed")
				.refine((file) => file.size <= MAX_FILE_SIZE, "Each file must be less than or equal to 1 MB")
		)
		.max(10, "You can upload up to 10 files only")
		.optional(),
});

export type UpsertCasesSchema = z.infer<typeof upsertCasesSchema>;
export type UpsertCasesSchemaErrors = Partial<Record<keyof UpsertCasesSchema, string[]>>;