import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  FlashcardResponse,
  FlashcardListResponse,
  CreateFlashcardCommand,
  UpdateFlashcardCommand,
  ListFlashcardsParams,
} from "../../types.js";

/**
 * Service for managing flashcards within flashcard sets
 */
export class FlashcardService {
  /**
   * Usuwa (dezaktywuje) fiszkę w zestawie (ustawia is_deleted: true)
   * @param userId - ID użytkownika
   * @param setId - ID zestawu
   * @param flashcardId - ID fiszki
   */
  async delete(userId: string, setId: string, flashcardId: string): Promise<void> {
    // Sprawdź własność zestawu
    await this.verifySetOwnership(userId, setId);

    // Ustaw is_deleted: true dla fiszki
    const { error } = await this.supabase
      .from("flashcards")
      .update({ is_deleted: true })
      .eq("id", flashcardId)
      .eq("set_id", setId);

    if (error) {
      throw new Error(`Failed to delete flashcard: ${error.message}`);
    }
  }
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Creates a new flashcard in the specified set
   * @param userId - ID of the user creating the flashcard
   * @param setId - ID of the flashcard set
   * @param command - Flashcard creation data
   * @returns Promise resolving to the created flashcard
   * @throws Error if set doesn't exist, user doesn't own the set, or limit exceeded
   */
  async create(userId: string, setId: string, command: CreateFlashcardCommand): Promise<FlashcardResponse> {
    // First verify the set exists and user owns it
    await this.verifySetOwnership(userId, setId);

    // Check flashcard limit (handled by database trigger, but we can check beforehand)
    const currentCount = await this.getFlashcardCount(setId);
    if (currentCount >= 30) {
      throw new Error("Flashcard limit exceeded (30 per set)");
    }

    const { data, error } = await this.supabase
      .from("flashcards")
      .insert({
        set_id: setId,
        question: command.question,
        answer: command.answer,
        creation_type: command.creation_type,
      })
      .select()
      .single();

    if (error) {
      // Handle specific database errors
      if (error.message.includes("flashcard_limit")) {
        throw new Error("Flashcard limit exceeded (30 per set)");
      }
      throw new Error(`Failed to create flashcard: ${error.message}`);
    }

    return this.mapToResponse(data);
  }

  /**
   * Lists flashcards in a set with pagination and filtering
   * @param userId - ID of the user requesting the flashcards
   * @param setId - ID of the flashcard set
   * @param params - Query parameters for pagination and filtering
   * @returns Promise resolving to paginated flashcard list
   */
  async list(userId: string, setId: string, params: ListFlashcardsParams): Promise<FlashcardListResponse> {
    // Verify set ownership
    await this.verifySetOwnership(userId, setId);

    const { page = 1, limit = 30, creation_type, sortBy = "created_at", sortOrder = "desc" } = params;
    const offset = (page - 1) * limit;

    let query = this.supabase
      .from("flashcards")
      .select("*", { count: "exact" })
      .eq("set_id", setId)
      .eq("is_deleted", false);

    // Apply creation type filter if provided
    if (creation_type) {
      query = query.eq("creation_type", creation_type);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to list flashcards: ${error.message}`);
    }

    return {
      items: (data || []).map(this.mapToResponse),
      total: count || 0,
      page,
      limit,
    };
  }

  /**
   * Updates an existing flashcard
   * @param userId - ID of the user updating the flashcard
   * @param setId - ID of the flashcard set
   * @param flashcardId - ID of the flashcard to update
   * @param command - Update data
   * @returns Promise resolving to the updated flashcard
   */
  async update(
    userId: string,
    setId: string,
    flashcardId: string,
    command: UpdateFlashcardCommand
  ): Promise<FlashcardResponse> {
    // Verify set ownership
    await this.verifySetOwnership(userId, setId);

    // Verify flashcard exists and belongs to the set
    await this.verifyFlashcardInSet(setId, flashcardId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    // LOG: wejściowe dane do aktualizacji
    // eslint-disable-next-line no-console
    console.log("[FlashcardService.update] payload:", command);

    if (command.question !== undefined) {
      updateData.question = command.question;
    }
    if (command.answer !== undefined) {
      updateData.answer = command.answer;
    }
    if (command.is_deleted !== undefined) {
      updateData.is_deleted = command.is_deleted;
    }
    if (command.creation_type !== undefined) {
      updateData.creation_type = command.creation_type;
    }

    // LOG: dane do update
    // eslint-disable-next-line no-console
    console.log("[FlashcardService.update] updateData:", updateData);

    const { data, error } = await this.supabase
      .from("flashcards")
      .update(updateData)
      .eq("id", flashcardId)
      .eq("set_id", setId)
      .select()
      .single();

    // LOG: wynik update
    // eslint-disable-next-line no-console
    console.log("[FlashcardService.update] result:", { data, error });

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Flashcard not found");
      }
      throw new Error(`Failed to update flashcard: ${error.message}`);
    }

    return this.mapToResponse(data);
  }

  /**
   * Verifies that a user owns the specified flashcard set
   * @private
   */
  private async verifySetOwnership(userId: string, setId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from("flashcard_sets")
      .select("id")
      .eq("id", setId)
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .single();

    if (error || !data) {
      throw new Error("Flashcard set not found or access denied");
    }
  }

  /**
   * Verifies that a flashcard belongs to the specified set
   * @private
   */
  private async verifyFlashcardInSet(setId: string, flashcardId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from("flashcards")
      .select("id")
      .eq("id", flashcardId)
      .eq("set_id", setId)
      .eq("is_deleted", false)
      .single();

    if (error || !data) {
      throw new Error("Flashcard not found in this set");
    }
  }

  /**
   * Gets the current count of flashcards in a set
   * @private
   */
  private async getFlashcardCount(setId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("set_id", setId)
      .eq("is_deleted", false);

    if (error) {
      throw new Error(`Failed to count flashcards: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Maps database row to response DTO
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToResponse(data: any): FlashcardResponse {
    return {
      id: data.id,
      set_id: data.set_id,
      question: data.question,
      answer: data.answer,
      creation_type: data.creation_type,
      created_at: data.created_at,
    };
  }
}
