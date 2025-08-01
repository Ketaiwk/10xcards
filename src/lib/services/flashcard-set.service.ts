import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  FlashcardSetResponse,
  FlashcardSetListResponse,
  CreateFlashcardSetCommand,
  UpdateFlashcardSetCommand,
  PaginationParams,
} from "@/types";

export class FlashcardSetService {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(userId: string, command: CreateFlashcardSetCommand): Promise<FlashcardSetResponse> {
    const { data: setData, error: setError } = await this.supabase
      .from("flashcard_sets")
      .insert({
        user_id: userId,
        name: command.name,
        description: command.description,
        source_text: command.source_text,
      })
      .select()
      .single();

    if (setError) {
      throw new Error(`Failed to create flashcard set: ${setError.message}`);
    }

    // Dodaj przykładowe fiszki
    const mockFlashcards = [
      {
        set_id: setData.id,
        question: "Co to jest spaced repetition?",
        answer: "Technika nauki polegająca na powtarzaniu materiału w optymalnych odstępach czasu, aby zwiększyć efektywność zapamiętywania.",
        creation_type: "ai_generated" as const,
      },
      {
        set_id: setData.id,
        question: "Jakie są zalety korzystania z fiszek?",
        answer: "1. Aktywne uczenie się\n2. Łatwe powtarzanie materiału\n3. Możliwość nauki w dowolnym miejscu\n4. Szybka weryfikacja wiedzy",
        creation_type: "ai_generated" as const,
      },
      {
        set_id: setData.id,
        question: "Jak efektywnie tworzyć fiszki?",
        answer: "1. Używaj prostego języka\n2. Jedna informacja na fiszkę\n3. Dodawaj przykłady\n4. Regularnie je przeglądaj",
        creation_type: "ai_generated" as const,
      },
    ];

    const { error: flashcardsError } = await this.supabase
      .from("flashcards")
      .insert(mockFlashcards);

    if (flashcardsError) {
      console.error("Failed to create sample flashcards:", flashcardsError);
      // Nie przerywamy wykonania, bo zestaw został już utworzony
    }

    return this.mapToResponse(setData);
  }

  async list(userId: string, params: PaginationParams): Promise<FlashcardSetListResponse> {
    const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc" } = params;
    const offset = (page - 1) * limit;

    let query = this.supabase
      .from("flashcard_sets")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .eq("is_deleted", false);

    // Apply sorting
    if (sortBy && sortOrder) {
      query = query.order(sortBy, { ascending: sortOrder === "asc" });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to list flashcard sets: ${error.message}`);
    }

    return {
      items: data.map(this.mapToResponse),
      total: count || 0,
      page,
      limit,
    };
  }

  async getById(userId: string, setId: string): Promise<FlashcardSetResponse> {
    const { data, error } = await this.supabase
      .from("flashcard_sets")
      .select()
      .eq("user_id", userId)
      .eq("id", setId)
      .eq("is_deleted", false)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Flashcard set not found");
      }
      throw new Error(`Failed to get flashcard set: ${error.message}`);
    }

    return this.mapToResponse(data);
  }

  async update(userId: string, setId: string, command: UpdateFlashcardSetCommand): Promise<FlashcardSetResponse> {
    const { data, error } = await this.supabase
      .from("flashcard_sets")
      .update({
        name: command.name,
        description: command.description,
        is_deleted: command.is_deleted,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("id", setId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Flashcard set not found");
      }
      throw new Error(`Failed to update flashcard set: ${error.message}`);
    }

    return this.mapToResponse(data);
  }

  private mapToResponse(data: any): FlashcardSetResponse {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      source_text: data.source_text,
      created_at: data.created_at,
      updated_at: data.updated_at,
      ai_generated_count: data.ai_generated_count,
      ai_accepted_count: data.ai_accepted_count,
      ai_edited_count: data.ai_edited_count,
      manual_count: data.manual_count,
      generation_duration: data.generation_duration,
    };
  }
}
