import { z } from "zod";
import type { APIRoute } from "astro";
import { getSupabase } from "@/lib/supabase/server";

const forgotPasswordSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const json = await request.json();
    const result = forgotPasswordSchema.safeParse(json);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.error.issues[0].message,
        }),
        {
          status: 400,
        }
      );
    }

    const { email } = result.data;
    const supabase = getSupabase();

    console.log("Attempting to reset password for:", email);
    console.log("Redirect URL:", `${new URL(request.url).origin}/auth/reset-password`);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/auth/reset-password`,
    });

    console.log("Reset password response:", error ? "Error occurred" : "Success");

    if (error) {
      console.error("Error resetting password:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: error.status || 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Link do resetowania hasła został wysłany na podany adres email.",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
      }),
      {
        status: 500,
      }
    );
  }
};
