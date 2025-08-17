import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Mail, Lock, User } from "lucide-react";
import { useNotifications } from "@/components/hooks/useNotifications";
import { useNavigate } from "@/components/hooks/useNavigate";

interface RegisterResponse {
  error?: {
    message: string;
    details?: { message: string }[];
  };
  message?: string;
  user?: {
    id: string;
    email: string;
  };
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { showError, showSuccess } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Hasła nie są identyczne");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    setError(null);
    setPasswordError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Wystąpił błąd podczas rejestracji");
      }

      showSuccess(data.message || "Rejestracja zakończona pomyślnie. Sprawdź swoją skrzynkę email.");

      // Przekierowanie na stronę logowania po pomyślnej rejestracji
      navigate("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePasswords(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    validatePasswords(password, e.target.value);
  };

  const validatePasswords = (pass: string, confirm: string) => {
    if (confirm && pass !== confirm) {
      setPasswordError("Hasła nie są identyczne");
    } else {
      setPasswordError(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection className="space-y-4">
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

        <FormGroup>
          <FormLabel required htmlFor="name">
            Imię
          </FormLabel>
          <div className="relative">
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jan Kowalski"
              className="pl-10"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <IconWrapper icon={User} className="w-4 h-4" />
            </div>
          </div>
        </FormGroup>

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
          <FormDescription id="email-description">Na ten adres wyślemy link aktywacyjny</FormDescription>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="pl-10"
              minLength={8}
              aria-describedby="password-requirements"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <IconWrapper icon={Lock} className="w-4 h-4" />
            </div>
          </div>
          <FormDescription id="password-requirements">Minimum 8 znaków</FormDescription>
        </FormGroup>

        <FormGroup>
          <FormLabel required htmlFor="confirmPassword">
            Potwierdź hasło
          </FormLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="••••••••"
              className="pl-10"
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? "password-error" : undefined}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <IconWrapper icon={Lock} className="w-4 h-4" />
            </div>
          </div>
          {passwordError && <FormMessage id="password-error">{passwordError}</FormMessage>}
        </FormGroup>

        <div className="text-sm text-center">
          <span className="text-muted-foreground">Masz już konto? </span>
          <a href="/auth/login" className="text-primary hover:underline" aria-label="Masz już konto? Zaloguj się">
            Zaloguj się
          </a>
        </div>
      </FormSection>

      <FormActions className="mt-6">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || Boolean(passwordError)}
          aria-disabled={isLoading || Boolean(passwordError)}
        >
          {isLoading ? "Rejestracja..." : "Zarejestruj się"}
        </Button>
      </FormActions>
    </Form>
  );
}
