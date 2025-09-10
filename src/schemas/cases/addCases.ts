import { z } from "zod";

import { LAW_CATEGORIES } from "@/commons/constant";

const categories = LAW_CATEGORIES.map((category) => category.value);

export const addCasesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // description: z.string().min(1, "Description is required"),
  category: z.enum(categories, "Category is required"),
  // files: z
  //   .array(z.instanceof(File).refine((file) => {
  //     return file.type === "application/pdf" || 
  //       file.type === "image/png" ||
  //       file.type === "image/jpeg" ||
  //       file.type === "image/jpg"
  //   }, "Only PDF or PNG files are allowed")) // only pdf, png, jpeg, jpg
  //   .max(10, "You can upload up to 10 files only") // max 10 files
  //   .optional(), // allow empty file uploads
});

export type AddCasesSchema = z.infer<typeof addCasesSchema>;
export type AddCasesSchemaErrors = Partial<Record<keyof AddCasesSchema, string[]>>;