import { z } from "zod";
import { UserRoleEnum } from "@/commons/enum";

export const registerSchema = z.object({
  role: z.enum([UserRoleEnum.CLIENT, UserRoleEnum.LAWYER]),
  email: z.email("Email not valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name cannot be empty").optional(),
  jurisdiction: z.string().optional(),
  barNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === UserRoleEnum.LAWYER) {
    if (!data.jurisdiction || data.jurisdiction.trim() === "") {
      ctx.addIssue({
        path: ["jurisdiction"],
        code: "custom",
        message: "Jurisdiction is required for lawyers.",
      });
    }

    if (!data.barNumber || data.barNumber.trim() === "") {
      ctx.addIssue({
        path: ["barNumber"],
        code: "custom",
        message: "Bar number is required for lawyers.",
      });
    }
  }
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type RegisterSchemaErrors = Partial<Record<keyof RegisterSchema, string[]>>;
