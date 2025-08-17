import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormSection, FormGroup, FormLabel, FormDescription, FormActions } from "@/components/ui/form";
import { IconWrapper } from "@/components/common/IconWrapper";
import { Mail, Lock } from "lucide-react";
import { useNotifications } from "@/components/hooks/useNotifications";
import { useNavigate } from "@/components/hooks/useNavigate";

interface LoginResponse {
  error?: {
    message: string;
    details?: { message: string }[];
  };
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
        throw new Error(data.error?.message || "Wystąpił błąd podczas logowania");
      }

      showSuccess("Zalogowano pomyślnie!");

      // Przekierowanie na stronę główną lub returnUrl jeśli istnieje
      const returnUrl = new URLSearchParams(window.location.search).get("returnUrl");
      navigate(returnUrl || "/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

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
        <Button type="submit" className="w-full" disabled={isLoading} aria-disabled={isLoading}>
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </FormActions>
    </Form>
  );
}
