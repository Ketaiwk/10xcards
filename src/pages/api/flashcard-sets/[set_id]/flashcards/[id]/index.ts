/**
 * DELETE /api/flashcard-sets/{set_id}/flashcards/{id}
 * Usuwa fiszkę z zestawu
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    // Get authenticated user
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate set_id parameter
    const setParamValidation = setIdParamSchema.safeParse({ set_id: params.set_id });
    if (!setParamValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid set ID",
          details: setParamValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate flashcard id parameter
    const flashcardParamValidation = flashcardIdParamSchema.safeParse({ id: params.id });
    if (!flashcardParamValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID",
          details: flashcardParamValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { set_id } = setParamValidation.data;
    const { id: flashcardId } = flashcardParamValidation.data;

    // Usuń fiszkę za pomocą serwisu
    const flashcardService = new FlashcardService(locals.supabase);
    await flashcardService.delete(user.id, set_id, flashcardId);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting flashcard:", error);

    if (error instanceof Error) {
      if (error.message.includes("Flashcard set not found") || error.message.includes("access denied")) {
        return new Response(JSON.stringify({ error: "Flashcard set not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (error.message.includes("Flashcard not found")) {
        return new Response(JSON.stringify({ error: "Flashcard not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
import type { APIRoute } from "astro";
import { FlashcardService } from "../../../../../../lib/services/flashcard.service.js";
import {
  updateFlashcardSchema,
  setIdParamSchema,
  flashcardIdParamSchema,
} from "../../../../../../lib/schemas/flashcard.schema.js";

export const prerender = false;

/**
 * PATCH /api/flashcard-sets/{set_id}/flashcards/{id}
 * Updates an existing flashcard
 */
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  try {
    // Get authenticated user
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate set_id parameter
    const setParamValidation = setIdParamSchema.safeParse({ set_id: params.set_id });
    if (!setParamValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid set ID",
          details: setParamValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate flashcard id parameter
    const flashcardParamValidation = flashcardIdParamSchema.safeParse({ id: params.id });
    if (!flashcardParamValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID",
          details: flashcardParamValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { set_id } = setParamValidation.data;
    const { id: flashcardId } = flashcardParamValidation.data;

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const bodyValidation = updateFlashcardSchema.safeParse(requestBody);
    if (!bodyValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input data",
          details: bodyValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update flashcard using service
    const flashcardService = new FlashcardService(locals.supabase);
    const flashcard = await flashcardService.update(user.id, set_id, flashcardId, bodyValidation.data);

    return new Response(JSON.stringify(flashcard), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating flashcard:", error);

    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message.includes("Flashcard set not found") || error.message.includes("access denied")) {
        return new Response(JSON.stringify({ error: "Flashcard set not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("Flashcard not found")) {
        return new Response(JSON.stringify({ error: "Flashcard not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
