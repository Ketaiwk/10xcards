import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '@/db/supabase.client';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers
    });

    const { error } = await supabase.auth.signOut();

    if (error) {
      return new Response(
        JSON.stringify({
          error: 'Wystąpił błąd podczas wylogowywania',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error);
    
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
