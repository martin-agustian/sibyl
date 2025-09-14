import { z } from "zod";

export const forgotSchema = z.object({
  email: z.email("Email is not valid"),
});

export type ForgotSchema = z.infer<typeof forgotSchema>;
export type ForgotSchemaErrors = Partial<Record<keyof ForgotSchema, string[]>>;