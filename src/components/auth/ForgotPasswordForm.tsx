import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormSection, FormGroup, FormLabel, FormDescription, FormActions } from "@/components/ui/form";
import { IconWrapper } from "@/components/common/IconWrapper";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error("Error response:", error);
        throw new Error(error.message || "Wystąpił nieoczekiwany błąd");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Error during password reset:", err);
      setError(err.message || "Wystąpił błąd podczas wysyłania linku resetującego. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">Link resetujący został wysłany!</p>
          <p className="text-sm mt-2">Sprawdź swoją skrzynkę email i kliknij w link, aby zresetować hasło.</p>
        </div>
        <div className="pt-4">
          <a href="/auth/login" className="text-primary hover:underline text-sm">
            Wróć do strony logowania
          </a>
        </div>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection className="space-y-4">
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

        <FormGroup>
          <FormLabel required htmlFor="email">
            Email
          </FormLabel>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="twoj@email.com"
              className="pl-10"
              aria-describedby="email-description"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <IconWrapper icon={Mail} className="w-4 h-4" />
            </div>
          </div>
          <FormDescription id="email-description">Wyślemy Ci link do zresetowania hasła</FormDescription>
        </FormGroup>

        <div className="text-sm text-center">
          <a href="/auth/login" className="text-primary hover:underline" aria-label="Wróć do strony logowania">
            Wróć do logowania
          </a>
        </div>
      </FormSection>

      <FormActions className="mt-6">
        <Button type="submit" className="w-full" disabled={isLoading} aria-disabled={isLoading}>
          {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
        </Button>
      </FormActions>
    </Form>
  );
}
