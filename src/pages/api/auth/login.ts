import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '@/db/supabase.client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy format adresu email'),
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
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
          error: 'Nieprawidłowe dane logowania',
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
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
          error: 'Błąd logowania',
          message: authError.message === 'Invalid login credentials'
            ? 'Nieprawidłowy email lub hasło'
            : 'Wystąpił błąd podczas logowania',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Pomyślne logowanie
    return new Response(
      JSON.stringify({
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Wystąpił nieoczekiwany błąd',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
