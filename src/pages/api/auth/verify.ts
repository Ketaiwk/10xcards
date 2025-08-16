import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const type = url.searchParams.get("type");

    if (!token || type !== "recovery") {
      throw new Error("Nieprawidłowy token lub typ weryfikacji");
    }

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    });

    if (error) {
      console.error("Error verifying token:", error);
      throw error;
    }

    // Przekieruj do strony resetowania hasła z tokenem dostępu
    return redirect(
      `/auth/reset-password#access_token=${data.session?.access_token}&refresh_token=${data.session?.refresh_token}&type=recovery`
    );
  } catch (error) {
    console.error("Verification error:", error);
    return redirect("/auth/login?error=invalid_recovery_token");
  }
};
