import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, request, redirect }) => {
  const token = url.searchParams.get("token");
  const type = url.searchParams.get("type");

  if (!token || type !== "recovery") {
    return redirect("/auth/login?error=invalid_token");
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  try {
    // Jeśli URL pochodzi z Supabase Auth (zawiera /auth/v1/verify)
    if (request.url.includes("/auth/v1/verify")) {
      return redirect(`/auth/verify?${url.searchParams.toString()}`);
    }

    // Weryfikuj token OTP
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return redirect("/auth/login?error=verification_failed");
    }

    if (!data.session) {
      console.error("No session after verification");
      return redirect("/auth/login?error=no_session");
    }

    // Ustaw ciasteczka sesji
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.setSession(data.session);

    if (sessionError || !session) {
      console.error("Error setting session:", sessionError);
      return redirect("/auth/login?error=session_error");
    }

    // Przekieruj do formularza resetowania hasła z potwierdzeniem
    return redirect("/auth/reset-password?verified=true");
  } catch (error) {
    console.error("Unexpected error during verification:", error);
    return redirect("/auth/login?error=unexpected_error");
  }
};
