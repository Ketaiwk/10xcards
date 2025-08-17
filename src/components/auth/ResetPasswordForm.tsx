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
import { Lock } from "lucide-react";

interface ResetPasswordFormProps {
  onSubmit?: (password: string) => Promise<void>;
}

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
      await onSubmit?.(password);
    } catch (err) {
      setError("Wystąpił błąd podczas resetowania hasła: " + (err instanceof Error ? err.message : "Nieznany błąd"));
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
