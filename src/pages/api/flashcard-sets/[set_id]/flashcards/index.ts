import type { APIRoute } from "astro";
import { FlashcardService } from "../../../../../lib/services/flashcard.service.js";
import {
  createFlashcardSchema,
  listFlashcardsParamsSchema,
  setIdParamSchema,
} from "../../../../../lib/schemas/flashcard.schema.js";

export const prerender = false;

/**
 * POST /api/flashcard-sets/{set_id}/flashcards
 * Creates a new flashcard in the specified set
 */
export const POST: APIRoute = async ({ params, request, locals }) => {
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
    const paramValidation = setIdParamSchema.safeParse(params);
    if (!paramValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid set ID",
          details: paramValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { set_id } = paramValidation.data;

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

    const bodyValidation = createFlashcardSchema.safeParse(requestBody);
    if (!bodyValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input data",
          details: bodyValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create flashcard using service
    const flashcardService = new FlashcardService(locals.supabase);
    const flashcard = await flashcardService.create(user.id, set_id, bodyValidation.data);

    return new Response(JSON.stringify(flashcard), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating flashcard:", error);

    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message.includes("not found") || error.message.includes("access denied")) {
        return new Response(JSON.stringify({ error: "Flashcard set not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("limit exceeded")) {
        return new Response(JSON.stringify({ error: "Flashcard limit exceeded (30 per set)" }), {
          status: 409,
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

/**
 * GET /api/flashcard-sets/{set_id}/flashcards
 * Lists flashcards in the specified set with pagination and filtering
 */
export const GET: APIRoute = async ({ params, url, locals }) => {
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
    const paramValidation = setIdParamSchema.safeParse(params);
    if (!paramValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid set ID",
          details: paramValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { set_id } = paramValidation.data;

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(url.searchParams);
    const queryValidation = listFlashcardsParamsSchema.safeParse(queryParams);

    if (!queryValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: queryValidation.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // List flashcards using service
    const flashcardService = new FlashcardService(locals.supabase);
    const flashcards = await flashcardService.list(user.id, set_id, queryValidation.data);

    return new Response(JSON.stringify(flashcards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error listing flashcards:", error);

    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message.includes("not found") || error.message.includes("access denied")) {
        return new Response(JSON.stringify({ error: "Flashcard set not found" }), {
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
