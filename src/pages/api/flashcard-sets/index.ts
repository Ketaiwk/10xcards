import type { APIRoute } from "astro";
import { FlashcardSetService } from "@/lib/services/flashcard-set.service";
import { createFlashcardSetSchema, listFlashcardSetsSchema } from "@/lib/schemas/flashcard-set.schema";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const json = await request.json();
    const validatedData = createFlashcardSetSchema.parse(json);

    if (!locals.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const service = new FlashcardSetService(locals.supabase);
    const result = await service.create(locals.user.id, validatedData);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Type guard for ZodError
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return new Response(
        JSON.stringify({
          error: "Validation error",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // eslint-disable-next-line no-console
    console.error("Error creating flashcard set:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const validatedParams = listFlashcardSetsSchema.parse(params);

    if (!locals.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const service = new FlashcardSetService(locals.supabase);
    const result = await service.list(locals.user.id, validatedParams);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error && typeof error === "object" && "name" in error && (error as { name?: string }).name === "ZodError") {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          details: error instanceof ZodError ? error.errors : [],
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // eslint-disable-next-line no-console
    console.error("Error listing flashcard sets:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
