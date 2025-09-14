import { z } from "zod";

export const forgotVerifySchema = z.object({
  code: z.string().length(6, "OTP is 6 length character"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ForgotVerifySchema = z.infer<typeof forgotVerifySchema>;
export type ForgotVerifySchemaErrors = Partial<Record<keyof ForgotVerifySchema, string[]>>;