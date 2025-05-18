# API Endpoint Implementation Plan: Create Flashcard Set

## 1. Przegląd punktu końcowego

Endpoint służy do tworzenia nowych zestawów fiszek z opcjonalnym generowaniem fiszek przy użyciu AI. Jest to kluczowy endpoint w systemie, który:

- Tworzy nowy zestaw fiszek w bazie danych
- Opcjonalnie generuje fiszki AI na podstawie dostarczonego tekstu źródłowego
- Aktualizuje liczniki statystyk
- Zapewnia spójność danych poprzez transakcje bazodanowe

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Struktura URL: `/api/flashcard-sets`
- Request Body:
  ```typescript
  {
    name: string;           // wymagane, max 255 znaków
    description?: string;   // opcjonalne
    sourceText?: string;    // opcjonalne, min 1000, max 10000 znaków
    generateAiCards: boolean; // opcjonalne, domyślnie false
  }
  ```
- Nagłówki:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (Supabase JWT)

## 3. Wykorzystywane typy

```typescript
// Command dla utworzenia zestawu
interface CreateFlashcardSetCommand {
  name: string;
  description?: string;
  source_text?: string;
  generateAiCards?: boolean;
}

// Odpowiedź z utworzonym zestawem
type FlashcardSetResponse = {
  id: string;
  name: string;
  description?: string;
  source_text?: string;
  created_at: string;
  updated_at: string;
  ai_generated_count: number;
  ai_accepted_count: number;
  ai_edited_count: number;
  manual_count: number;
  generation_duration: number;
};

// Schema walidacji Zod
const createFlashcardSetSchema = z.object({
  name: z.string().max(255),
  description: z.string().optional(),
  sourceText: z.string().min(1000).max(10000).optional(),
  generateAiCards: z.boolean().default(false),
});
```

## 4. Przepływ danych

1. Żądanie przychodzi do endpointu `/api/flashcard-sets`
2. Middleware sprawdza JWT i dodaje klienta Supabase do `context.locals`
3. Walidacja danych wejściowych przez schemat Zod
4. Servisy:
   - `FlashcardSetService.create()` - tworzy zestaw w bazie
   - `AiGenerationService.generate()` - generuje fiszki (jeśli generateAiCards=true)
5. Transakcja bazodanowa zapewnia spójność przy generowaniu AI
6. Aktualizacja liczników przez triggery bazodanowe
7. Zwrot utworzonego zestawu

## 5. Względy bezpieczeństwa

1. Uwierzytelnianie:

   - JWT token z Supabase Auth
   - Walidacja w middleware

2. Autoryzacja:

   - RLS policies w Supabase
   - Sprawdzenie user_id przy zapisie

3. Walidacja danych:

   - Schemat Zod dla danych wejściowych
   - Sanityzacja tekstu źródłowego
   - Walidacja limitów długości

4. Rate limiting:
   - Dla całego endpointu
   - Dodatkowy limit dla generowania AI

## 6. Obsługa błędów

Kody odpowiedzi:

- 201: Pomyślne utworzenie
- 400: Błędy walidacji
  - Nieprawidłowa długość name
  - Nieprawidłowa długość sourceText
  - Nieprawidłowy format danych
- 401: Problemy z autoryzacją
  - Brak tokenu JWT
  - Nieważny token
- 429: Rate limiting
  - Zbyt wiele żądań
  - Limit generowania AI
- 500: Błędy serwera
  - Błąd bazy danych
  - Błąd generowania AI

Format błędów:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  }
}
```

## 7. Rozważania dotyczące wydajności

1. Optymalizacje bazy danych:

   - Indeks na user_id i created_at
   - Transakcje dla spójności danych
   - Triggery dla liczników

2. Generowanie AI:

   - Asynchroniczne przetwarzanie
   - Monitorowanie czasu generowania
   - Cache dla podobnych tekstów

3. Rate limiting:
   - Globalne limity endpointu
   - Osobne limity dla AI
   - Przechowywanie limitów w Redis

## 8. Etapy wdrożenia

1. Przygotowanie struktury:

   ```
   src/
     pages/
       api/
         flashcard-sets/
           index.ts       # POST handler
     lib/
       services/
         flashcard-set.service.ts
         ai-generation.service.ts
       schemas/
         flashcard-set.schema.ts
   ```

2. Implementacja schema walidacji:

   - Utworzenie `flashcard-set.schema.ts`
   - Definicja schematu Zod
   - Testy jednostkowe walidacji

3. Implementacja serwisów:

   - FlashcardSetService z metodą create
   - AiGenerationService z metodą generate
   - Testy jednostkowe serwisów

4. Implementacja handlera:

   - Walidacja żądania
   - Wywołanie serwisów
   - Obsługa błędów
   - Zwrot odpowiedzi

5. Konfiguracja bezpieczeństwa:

   - Rate limiting
   - Middleware autoryzacji
   - RLS policies

6. Testy:

   - Testy jednostkowe
   - Testy integracyjne
   - Testy wydajnościowe
   - Testy bezpieczeństwa

7. Dokumentacja:

   - Dokumentacja API
   - Przykłady użycia
   - Opis obsługi błędów

8. Wdrożenie:
   - Code review
   - Deployment na staging
   - Testy na staging
   - Deployment na produkcję
