import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
  name: z.string().min(2, "Imię musi mieć minimum 2 znaki"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Walidacja danych wejściowych
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane rejestracji",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password, name } = result.data;

    // Inicjalizacja klienta Supabase
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Próba rejestracji
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return new Response(
        JSON.stringify({
          error: "Błąd rejestracji",
          message:
            authError.message === "User already registered"
              ? "Użytkownik o podanym adresie email już istnieje"
              : "Wystąpił błąd podczas rejestracji",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Dodanie użytkownika do tabeli users
    if (!authData.user?.id || !authData.user?.email) {
      console.error("Brak user.id lub user.email po rejestracji:", authData);
    } else {
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: authData.user.email,
      });
      if (dbError) {
        console.error("Błąd dodawania użytkownika do tabeli users:", dbError);
        return new Response(
          JSON.stringify({
            error: "Błąd dodawania użytkownika do bazy danych",
            details: dbError.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        console.log("Użytkownik dodany do tabeli users:", authData.user.id);
      }
    }

    // Pomyślna rejestracja
    return new Response(
      JSON.stringify({
        message: "Rejestracja zakończona pomyślnie. Sprawdź swoją skrzynkę email, aby potwierdzić konto.",
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Błąd podczas rejestracji:", error);

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
