import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormSection,
  FormGroup,
  FormLabel,
  FormDescription,
  FormMessage,
  FormActions,
} from "@/components/ui/form";
import { IconWrapper } from "@/components/common/IconWrapper";
import { Mail, Lock } from "lucide-react";
import { useNotifications } from "@/components/hooks/useNotifications";
import { useNavigate } from "@/components/hooks/useNavigate";

interface LoginResponse {
  error?: {
    message: string;
    details?: Array<{ message: string }>;
  };
  message?: string;
  user?: {
    id: string;
    email: string;
  };
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        // Używamy message z odpowiedzi serwera
        throw new Error(data.error?.message || data.message || "Nieprawidłowy email lub hasło");
      }

      // Sprawdzamy czy mamy dane użytkownika
      if (!data.user) {
        throw new Error("Brak danych użytkownika w odpowiedzi");
      }

      showSuccess("Zalogowano pomyślnie!");

      // Przekierowanie na stronę główną lub returnUrl jeśli istnieje
      const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/";
      window.location.href = returnUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-form-container" data-test-id="login-form-container">
      <Form onSubmit={handleSubmit} data-test-id="login-form" id="login-form">
        <FormSection className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md" data-test-id="login-error">
              {error}
            </div>
          )}

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
                data-test-id="login-email-input"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <IconWrapper icon={Mail} className="w-4 h-4" />
              </div>
            </div>
            <FormDescription id="email-description">Wprowadź adres email użyty podczas rejestracji</FormDescription>
          </FormGroup>

          <FormGroup>
            <FormLabel required htmlFor="password">
              Hasło
            </FormLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="pl-10"
                minLength={8}
                data-test-id="login-password-input"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <IconWrapper icon={Lock} className="w-4 h-4" />
              </div>
            </div>
          </FormGroup>

          <div className="flex items-center justify-between text-sm">
            <a
              href="/auth/forgot-password"
              className="text-primary hover:underline"
              aria-label="Nie pamiętasz hasła? Kliknij, aby je zresetować"
            >
              Nie pamiętasz hasła?
            </a>
            <a
              href="/auth/register"
              className="text-primary hover:underline"
              aria-label="Nie masz jeszcze konta? Zarejestruj się"
            >
              Załóż konto
            </a>
          </div>
        </FormSection>

        <FormActions className="mt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            aria-disabled={isLoading}
            data-test-id="login-submit-button"
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </FormActions>
      </Form>
    </div>
  );
}
