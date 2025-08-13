import { useState, useEffect } from "react";
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
import { Lock } from "lucide-react";
import { useNavigate } from "@/components/hooks/useNavigate";
import { useNotifications } from "@/components/hooks/useNotifications";
import { supabase } from "@/lib/supabase/client";

interface ResetPasswordFormProps {}

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    async function checkSession() {
      try {
        // Sprawdź czy strona została załadowana po weryfikacji
        const isVerified = new URLSearchParams(window.location.search).get("verified") === "true";
        if (!isVerified) {
          throw new Error("Nieprawidłowy dostęp do strony resetowania hasła");
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (!session) {
          throw new Error("Brak aktywnej sesji resetowania hasła");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Wystąpił błąd podczas weryfikacji sesji";
        showError(message);
        navigate("/auth/login");
      }
    }

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Hasła nie są identyczne");
      return;
    }

    setError(null);
    setPasswordError(null);
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        throw new Error("Sesja wygasła. Spróbuj zresetować hasło ponownie.");
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Wyloguj użytkownika po zmianie hasła
      await supabase.auth.signOut();

      showSuccess("Hasło zostało pomyślnie zmienione. Możesz się teraz zalogować.");
      navigate("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił błąd podczas resetowania hasła";
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
          <FormLabel required htmlFor="password">
            Nowe hasło
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
            Potwierdź nowe hasło
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
      </FormSection>

      <FormActions className="mt-6">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || Boolean(passwordError)}
          aria-disabled={isLoading || Boolean(passwordError)}
        >
          {isLoading ? "Resetowanie..." : "Zresetuj hasło"}
        </Button>
      </FormActions>
    </Form>
  );
}
