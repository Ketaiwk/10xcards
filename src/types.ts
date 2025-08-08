import type { Database } from "./db/database.types";

// Base types from database
type FlashcardSetRow = Database["public"]["Tables"]["flashcard_sets"]["Row"];
type FlashcardRow = Database["public"]["Tables"]["flashcards"]["Row"];

/**
 * Common types for API responses and requests
 */
/** Parameters for paginated endpoints */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Generic paginated response structure */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// FlashcardSet types
/** Command for creating a new flashcard set */
export interface CreateFlashcardSetCommand {
  name: string;
  description?: string;
  source_text?: string;
  generate_ai_cards?: boolean;
}

/** Response type for a single flashcard set */
export type FlashcardSetResponse = Pick<
  FlashcardSetRow,
  | "id"
  | "name"
  | "description"
  | "source_text"
  | "created_at"
  | "updated_at"
  | "ai_generated_count"
  | "ai_accepted_count"
  | "ai_edited_count"
  | "manual_count"
  | "generation_duration"
>;

// Typy dla autoryzacji
export interface LocalUser {
  id: string;
  email: string | null;
}

// Rozszerzenie Astro.locals
declare module 'astro' {
  interface Locals {
    user: import('@supabase/supabase-js').User | null;
    supabase: import('@supabase/supabase-js').SupabaseClient<Database>;
  }
}
export type UpdateFlashcardSetCommand = Partial<Pick<FlashcardSetRow, "name" | "description" | "is_deleted">>;

/** Response type for flashcard set list item */
export type FlashcardSetListItemResponse = Omit<FlashcardSetResponse, "source_text">;
export type FlashcardSetListResponse = PaginatedResponse<FlashcardSetListItemResponse>;

// Flashcard types
export type FlashcardCreationType = Database["public"]["Enums"]["flashcard_creation_type"];

/** Command for creating a new flashcard */
export interface CreateFlashcardCommand {
  question: string;
  answer: string;
  creation_type: FlashcardCreationType;
}

/** Response type for a single flashcard */
export type FlashcardResponse = Pick<
  FlashcardRow,
  "id" | "set_id" | "question" | "answer" | "creation_type" | "created_at"
>;

export type UpdateFlashcardCommand = Partial<Pick<FlashcardRow, "question" | "answer" | "is_deleted" | "creation_type">>;

export type FlashcardListResponse = PaginatedResponse<FlashcardResponse>;

// Query parameters
export type ListFlashcardSetsParams = PaginationParams;

/** Parameters for listing flashcards */
export interface ListFlashcardsParams extends PaginationParams {
  creation_type?: FlashcardCreationType;
}
