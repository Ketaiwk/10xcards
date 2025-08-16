import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Walidacja danych wejściowych
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane logowania",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password } = result.data;

    // Inicjalizacja klienta Supabase
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Próba logowania
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return new Response(
        JSON.stringify({
          error: "Błąd logowania",
          message:
            authError.message === "Invalid login credentials"
              ? "Nieprawidłowy email lub hasło"
              : "Wystąpił błąd podczas logowania",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Jeśli nie ma sesji lub użytkownika, zgłaszamy błąd
    if (!authData?.session || !authData?.user) {
      return new Response(
        JSON.stringify({
          error: "Brak danych sesji",
          message: "Wystąpił nieoczekiwany błąd podczas logowania",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Pobieramy ciasteczka z Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return new Response(
        JSON.stringify({
          error: "Brak sesji",
          message: "Wystąpił błąd podczas tworzenia sesji",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ustawiamy sesję po stronie serwera
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });

    if (setSessionError) {
      return new Response(
        JSON.stringify({
          error: "Błąd sesji",
          message: "Nie udało się ustawić sesji",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Pobieramy ciasteczka sesji z Supabase
    const {
      data: { session: newSession },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      return new Response(
        JSON.stringify({
          error: "Błąd sesji",
          message: "Nie udało się utworzyć sesji",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ustawiamy ciasteczka sesji
    const sessionCookie = newSession?.access_token;
    if (sessionCookie) {
      cookies.set("sb-access-token", sessionCookie, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 dni
      });
    }

    // Zwracamy pomyślną odpowiedź
    return new Response(
      JSON.stringify({
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Błąd podczas logowania:", error);

    return new Response(
      JSON.stringify({
        error: "Wystąpił nieoczekiwany błąd",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
