# Plan implementacji usługi OpenRouter

## 1. Opis usługi

OpenRouterService to usługa TypeScript zapewniająca interfejs do komunikacji z API OpenRouter w aplikacji 10xCards. Służy do generowania i zarządzania fiszkami edukacyjnymi z wykorzystaniem modeli językowych dostępnych przez OpenRouter.

### Kluczowe funkcjonalności

- Komunikacja z API OpenRouter
- Generowanie fiszek w określonym formacie JSON
- Obsługa błędów i retry logic
- Walidacja danych wejściowych i wyjściowych

## 2. Opis konstruktora

```typescript
class OpenRouterService {
  constructor(config: OpenRouterConfig) {
    this.validateConfig(config);
    this.config = config;
    this.initializeClient();
  }
}
```

### Parametry konfiguracji

```typescript
interface OpenRouterConfig {
  apiKey: string;
  defaultModel: string;
  maxRetries: number;
  timeout: number;
  baseURL: string;
}
```

## 3. Publiczne metody i pola

### generateFlashcard

```typescript
async generateFlashcard(
  prompt: string,
  options?: GenerateOptions
): Promise<FlashcardResponse> {
  // Implementacja generowania fiszki
}
```

### updateModel

```typescript
setModel(modelName: string): void {
  // Zmiana aktualnego modelu
}
```

### getAvailableModels

```typescript
async getAvailableModels(): Promise<ModelInfo[]> {
  // Pobieranie listy dostępnych modeli
}
```

## 4. Prywatne metody i pola

### validateConfig

```typescript
private validateConfig(config: OpenRouterConfig): void {
  // Walidacja konfiguracji
}
```

### formatResponse

```typescript
private formatResponse(
  rawResponse: any
): FlashcardResponse {
  // Formatowanie odpowiedzi
}
```

### buildPrompt

```typescript
private buildPrompt(
  userPrompt: string
): PromptConfig {
  // Budowanie pełnego promptu
}
```

## 5. Obsługa błędów

### Typy błędów

```typescript
enum OpenRouterErrorType {
  AUTH_ERROR = "auth_error",
  RATE_LIMIT = "rate_limit",
  VALIDATION_ERROR = "validation_error",
  NETWORK_ERROR = "network_error",
  MODEL_ERROR = "model_error",
}
```

### Strategia obsługi błędów

1. Automatyczne ponowne próby dla błędów sieciowych
2. Exponential backoff dla rate limitów
3. Graceful degradation dla niedostępnych modeli
4. Szczegółowe komunikaty błędów dla developerów

## 6. Kwestie bezpieczeństwa

1. Bezpieczne przechowywanie klucza API

   ```typescript
   // Używaj zmiennych środowiskowych
   const apiKey = import.meta.env.OPENROUTER_API_KEY;
   ```

2. Walidacja danych wejściowych

   ```typescript
   // Używaj Zod do walidacji
   const promptSchema = z.object({
     content: z.string().min(1).max(4000),
   });
   ```

3. Sanityzacja odpowiedzi
4. Rate limiting po stronie klienta
5. Timeout dla długich żądań

## 7. Plan wdrożenia krok po kroku

### 1. Konfiguracja środowiska

```bash
# Dodaj zmienne środowiskowe
echo "OPENROUTER_API_KEY=your_key_here" >> .env
```

### 2. Instalacja zależności

```bash
pnpm add zod axios
```

### 3. Struktura plików

```
src/
  lib/
    services/
      openrouter/
        openrouter.service.ts
        openrouter.types.ts
        openrouter.schema.ts
        openrouter.config.ts
```

### 4. Implementacja podstawowych komponentów

1. Zdefiniuj typy i schematy
2. Zaimplementuj klasę konfiguracji
3. Zaimplementuj główną klasę usługi
4. Dodaj obsługę błędów

### 5. Integracja z istniejącą aplikacją

1. Dodaj serwis do kontenera DI
2. Zaimplementuj endpoint API
3. Zaktualizuj komponenty frontendowe

### 6. Przykład użycia

```typescript
// Inicjalizacja serwisu
const openRouter = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  defaultModel: "openai/gpt-4o-mini",
  maxRetries: 3,
  timeout: 30000,
  baseURL: "https://openrouter.ai/api/v1",
});

// Generowanie fiszki
const flashcard = await openRouter.generateFlashcard("Wyjaśnij proces fotosyntezy", {
  model: "openai/gpt-4o-mini",
  temperature: 0.7,
  responseFormat: {
    type: "json_schema",
    json_schema: {
      name: "flashcard",
      strict: true,
      schema: {
        type: "object",
        properties: {
          front: { type: "string" },
          back: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
        },
        required: ["front", "back"],
      },
    },
  },
});
```

### 7. Monitoring i utrzymanie

1. Dodaj metryki wydajności
2. Skonfiguruj logowanie błędów
3. Ustaw alerty dla krytycznych błędów
4. Zaplanuj regularne aktualizacje
