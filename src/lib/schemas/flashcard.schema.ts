import { z } from "zod";

/**
 * Schema for generating flashcards from text
 */
export const FlashcardGenerationSchema = z.object({
  sourceText: z.string().min(1, "Source text is required").max(5000, "Source text must be at most 5000 characters"),
});

/**
 * Schema for creating a new flashcard
 */
export const createFlashcardSchema = z.object({
  question: z.string().min(1, "Question is required").max(200, "Question must be at most 200 characters"),
  answer: z.string().min(1, "Answer is required").max(500, "Answer must be at most 500 characters"),
  creation_type: z.enum(["ai_generated", "ai_edited", "manual"], {
    required_error: "Creation type is required",
    invalid_type_error: "Creation type must be ai_generated, ai_edited, or manual",
  }),
});

/**
 * Schema for updating an existing flashcard
 */
export const updateFlashcardSchema = z
  .object({
    question: z.string().max(200, "Question must be at most 200 characters").optional(),
    answer: z.string().max(500, "Answer must be at most 500 characters").optional(),
    is_deleted: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided for update");

/**
 * Schema for flashcard list query parameters
 */
export const listFlashcardsParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(30),
  creation_type: z.enum(["ai_generated", "ai_edited", "manual"]).optional(),
  sortBy: z.string().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Schema for validating set_id parameter
 */
export const setIdParamSchema = z.object({
  set_id: z.string().uuid("Invalid set ID format"),
});

/**
 * Schema for validating flashcard id parameter
 */
export const flashcardIdParamSchema = z.object({
  id: z.string().uuid("Invalid flashcard ID format"),
});
