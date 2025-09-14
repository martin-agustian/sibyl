import { z } from "zod";

export const forgotVerifySchema = z.object({
  email: z.email({ error: "Email is not valid" }),
  code: z.string().length(6, { error: "OTP is 6 length character" }),
});

export type ForgotVerifySchema = z.infer<typeof forgotVerifySchema>;
export type ForgotVerifySchemaErrors = Partial<Record<keyof ForgotVerifySchema, string[]>>;