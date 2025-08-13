import { z } from 'zod';
import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '@/db/supabase.client';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Nieprawidłowe dane',
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { password } = result.data;
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error('Error updating password:', error);
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: error.status || 500
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Hasło zostało pomyślnie zmienione.'
      }),
      {
        status: 200
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.'
      }),
      {
        status: 500
      }
    );
  }
}
