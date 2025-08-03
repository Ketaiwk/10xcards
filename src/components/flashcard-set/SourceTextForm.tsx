import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SourceTextFormProps {
  onGenerate: (text: string) => Promise<void>;
  isGenerating: boolean;
  value?: string;
  onChange?: (text: string) => void;
}

export function SourceTextForm({ onGenerate, isGenerating, value, onChange }: SourceTextFormProps) {
  const [sourceText, setSourceText] = useState(value || "");
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const validateSourceText = (text: string) => {
    if (text.length < 1000) {
      return "Tekst źródłowy musi zawierać co najmniej 1000 znaków";
    }
    if (text.length > 10000) {
      return "Tekst źródłowy nie może przekraczać 10000 znaków";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateSourceText(sourceText);
    if (validationError) {
      setError(validationError);
      // Fokus na polu tekstowym i ogłoszenie błędu dla czytników ekranu
      const textarea = document.getElementById("sourceText");
      textarea?.focus();
      return;
    }
    setError(null);
    // Informuj użytkowników o rozpoczęciu procesu
    const statusElement = document.createElement("div");
    statusElement.setAttribute("role", "status");
    statusElement.setAttribute("aria-live", "polite");
    statusElement.textContent = "Rozpoczynam generowanie fiszek. Proszę czekać...";
    document.body.appendChild(statusElement);

    await onGenerate(sourceText);

    // Usuń element statusu po zakończeniu
    statusElement.remove();
  };

  // Obsługa skrótu klawiszowego Ctrl+Enter do generowania
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="sourceText"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tekst źródłowy
          </label>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-muted-foreground hover:text-primary"
            aria-label={showHint ? "Ukryj wskazówki" : "Pokaż wskazówki"}
          >
            {showHint ? "Ukryj wskazówki" : "Pokaż wskazówki"}
          </button>
        </div>
        {showHint && (
          <div
            className="p-4 bg-muted/50 rounded-md space-y-2"
            role="complementary"
            aria-label="Wskazówki dotyczące tekstu źródłowego"
          >
            <h3 className="text-sm font-medium">Jak przygotować dobry tekst źródłowy?</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>Wklej tekst zawierający kluczowe pojęcia i definicje</li>
              <li>Upewnij się, że tekst jest spójny i zrozumiały</li>
              <li>Usuń niepotrzebne formatowanie</li>
              <li>Tekst powinien mieć minimum 1000 znaków</li>
            </ul>
          </div>
        )}{" "}
        <Textarea
          id="sourceText"
          value={value !== undefined ? value : sourceText}
          onChange={(e) => {
            setSourceText(e.target.value);
            onChange?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Wprowadź tekst źródłowy do wygenerowania fiszek..."
          className="h-[200px] resize-none"
          disabled={isGenerating}
          aria-describedby={`sourceText-description${error ? " sourceText-error" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-required="true"
          required
          minLength={1000}
          maxLength={10000}
          onPaste={(e) => {
            // Informuj o udanym wklejeniu tekstu
            setTimeout(() => {
              const length = e.currentTarget.value.length;
              const statusElement = document.createElement("div");
              statusElement.setAttribute("role", "status");
              statusElement.setAttribute("aria-live", "polite");
              statusElement.textContent = `Wklejono tekst o długości ${length} znaków.`;
              document.body.appendChild(statusElement);
              setTimeout(() => statusElement.remove(), 2000);
            }, 100);
          }}
        />
        {error && (
          <p id="sourceText-error" className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <div id="sourceText-description" className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Liczba znaków: {sourceText.length}/10000 (minimum 1000)</p>
          <p
            className={`text-sm ${sourceText.length >= 1000 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
            aria-live="polite"
          >
            {sourceText.length >= 1000
              ? "✓ Wystarczająca długość tekstu"
              : `Potrzebne jeszcze ${1000 - sourceText.length} znaków`}
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={isGenerating || !sourceText.trim()} aria-busy={isGenerating} className="w-full">
          {isGenerating ? (
            <span className="inline-flex items-center">
              <span className="animate-spin mr-2">⏳</span>
              Generowanie fiszek...
            </span>
          ) : (
            "Generuj fiszki"
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Wskazówka: użyj Ctrl+Enter aby szybko wygenerować fiszki
        </p>
        {isGenerating && (
          <p className="text-sm text-muted-foreground text-center" role="status" aria-live="polite">
            Trwa generowanie fiszek... To może potrwać kilka minut.
          </p>
        )}
      </div>
    </form>
  );
}
