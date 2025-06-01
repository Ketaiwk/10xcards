import { z } from 'zod';

export const createFlashcardSetSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  source_text: z.string().min(1000).max(10000).optional(),
  generate_ai_cards: z.boolean().default(false),
});

export type CreateFlashcardSetInput = z.infer<typeof createFlashcardSetSchema>;