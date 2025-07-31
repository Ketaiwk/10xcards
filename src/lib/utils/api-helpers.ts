import { ZodError } from "zod";

export interface ApiError {
  message: string;
  status: number;
}

export const checkAuthorization = (userId?: string): Response | null => {
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
};

export const checkSetId = (setId?: string): Response | null => {
  if (!setId) {
    return new Response(JSON.stringify({ error: "Set ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
};

export const handleApiError = (error: unknown): Response => {
  if (error instanceof ZodError) {
    return new Response(
      JSON.stringify({
        error: "Validation error",
        details: error.errors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (error instanceof Error) {
    if (error.message === "Flashcard set not found") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.error("Unexpected error:", error);
  return new Response(
    JSON.stringify({
      error: "Internal server error",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
};
