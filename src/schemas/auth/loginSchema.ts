import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Email not valid" }),
  password: z.string().min(6, { message: "Password min. 6 characters" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginSchemaErrors = Partial<Record<keyof LoginSchema, string[]>>;
