import { z } from "zod";

export const upsertQuoteSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  expectedDays: z.number().min(1, "Expected Days must be at least 1"),
  note: z.string().min(1, "Note is required"),
});

// expectedDays: z.number().int("Expected days can't be decimal").min(1, "Expected Days must be at least 1"),

export type UpsertQuoteSchema = z.infer<typeof upsertQuoteSchema>;
export type UpsertQuoteSchemaErrors = Partial<Record<keyof UpsertQuoteSchema, string[]>>;