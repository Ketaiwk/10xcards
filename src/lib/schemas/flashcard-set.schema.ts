import { z } from "zod";

export const createFlashcardSetSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  source_text: z.string().min(1000).max(10000).optional(),
  generate_ai_cards: z.boolean().default(false),
});

export const updateFlashcardSetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  is_deleted: z.boolean().optional(),
});

export const listFlashcardSetsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
  sort_by: z.enum(["created_at", "updated_at", "name"]).optional().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateFlashcardSetInput = z.infer<typeof createFlashcardSetSchema>;
export type UpdateFlashcardSetInput = z.infer<typeof updateFlashcardSetSchema>;
export type ListFlashcardSetsInput = z.infer<typeof listFlashcardSetsSchema>;
