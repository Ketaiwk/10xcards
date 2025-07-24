# API Endpoint Implementation Plan: Flashcard Sets API

## 1. Przegląd punktu końcowego

Implementacja kompletnego zestawu endpointów REST API do zarządzania zestawami fiszek (Flashcard Sets) z następującą funkcjonalnością:

- Tworzenie nowych zestawów z opcjonalnym generowaniem fiszek przez AI
- Listowanie zestawów z paginacją i sortowaniem
- Pobieranie szczegółów pojedynczego zestawu
- Aktualizacja metadanych zestawu
- Obsługa soft delete

## 2. Szczegóły żądania

### 2.1. Create Flashcard Set (POST)

- Metoda: POST
- Ścieżka: `/api/flashcard-sets`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body:
  ```typescript
  {
    name: string;          // wymagane, max 255 znaków
    description?: string;  // opcjonalne
    source_text?: string;  // opcjonalne, 1000-10000 znaków
    generate_ai_cards?: boolean; // opcjonalne, domyślnie false
  }
  ```

### 2.2. List Flashcard Sets (GET)

- Metoda: GET
- Ścieżka: `/api/flashcard-sets`
- Query Parameters:
  - page (default: 1)
  - limit (default: 10, max: 50)
  - sort_by (created_at | updated_at | name)
  - sort_order (asc | desc)
- Headers:
  - `Authorization: Bearer <token>`

### 2.3. Get Flashcard Set (GET)

- Metoda: GET
- Ścieżka: `/api/flashcard-sets/{set_id}`
- Headers:
  - `Authorization: Bearer <token>`

### 2.4. Update Flashcard Set (PATCH)

- Metoda: PATCH
- Ścieżka: `/api/flashcard-sets/{set_id}`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body:
  ```typescript
  {
    name?: string;
    description?: string;
    is_deleted?: boolean;
  }
  ```

## 3. Wykorzystywane typy

### 3.1. Command Models:

```typescript
import { CreateFlashcardSetCommand, UpdateFlashcardSetCommand } from "@/types";
```

### 3.2. Response Models:

```typescript
import { FlashcardSetResponse, FlashcardSetListResponse, FlashcardSetListItemResponse } from "@/types";
```

### 3.3. Walidacja (Zod Schemas):

```typescript
import { z } from "zod";

const createFlashcardSetSchema = z.object({
  name: z.string().max(255),
  description: z.string().optional(),
  source_text: z.string().min(1000).max(10000).optional(),
  generate_ai_cards: z.boolean().optional().default(false),
});
```

## 4. Przepływ danych

### 4.1. Create Flashcard Set:

1. Walidacja danych wejściowych (Zod)
2. Weryfikacja tokenu użytkownika
3. Utworzenie zestawu w bazie
4. Jeśli generate_ai_cards=true:
   - Walidacja source_text
   - Generowanie fiszek przez AI
   - Zapis fiszek do bazy
5. Zwrócenie odpowiedzi

### 4.2. List Flashcard Sets:

1. Walidacja parametrów query
2. Weryfikacja tokenu użytkownika
3. Pobranie zestawów z paginacją
4. Mapping do ResponseDTO
5. Zwrócenie odpowiedzi

### 4.3. Get Flashcard Set:

1. Walidacja set_id
2. Weryfikacja tokenu użytkownika
3. Pobranie zestawu
4. Mapping do ResponseDTO
5. Zwrócenie odpowiedzi

### 4.4. Update Flashcard Set:

1. Walidacja danych wejściowych
2. Weryfikacja tokenu użytkownika
3. Aktualizacja zestawu
4. Zwrócenie odpowiedzi

## 5. Względy bezpieczeństwa

### 5.1. Uwierzytelnianie:

- Wykorzystanie Supabase Auth
- Weryfikacja JWT w każdym żądaniu
- Automatyczne odświeżanie tokenów

### 5.2. Autoryzacja:

- Row Level Security (RLS) w Supabase
- Weryfikacja właściciela zasobu
- Izolacja danych między użytkownikami

### 5.3. Walidacja danych:

- Sanityzacja wszystkich danych wejściowych
- Walidacja typów i ograniczeń
- Obsługa XSS i SQL Injection (przez Supabase)

### 5.4. Rate Limiting:

- Ograniczenie liczby żądań AI
- Monitoring nietypowych wzorców użycia

## 6. Obsługa błędów

### 6.1. Walidacja (400):

```typescript
if (!isValid) {
  return new Response(
    JSON.stringify({
      error: "Invalid input data",
      details: validationErrors,
    }),
    { status: 400 }
  );
}
```

### 6.2. Autoryzacja (401/403):

```typescript
if (!user) {
  return new Response(
    JSON.stringify({
      error: "Unauthorized",
    }),
    { status: 401 }
  );
}
```

### 6.3. Not Found (404):

```typescript
if (!flashcardSet) {
  return new Response(
    JSON.stringify({
      error: "Flashcard set not found",
    }),
    { status: 404 }
  );
}
```

### 6.4. Rate Limiting (429):

```typescript
if (isRateLimited) {
  return new Response(
    JSON.stringify({
      error: "Too many AI generation requests",
    }),
    { status: 429 }
  );
}
```

## 7. Rozważania dotyczące wydajności

### 7.1. Baza danych:

- Wykorzystanie indeksów
- Limit rozmiaru zapytań
- Optymalizacja paginacji

### 7.2. Generowanie AI:

- Asynchroniczne przetwarzanie
- Cache'owanie wyników
- Optymalizacja długości kontekstu

### 7.3. API:

- Kompresja odpowiedzi
- Efektywna paginacja
- Monitorowanie czasów odpowiedzi

## 8. Kroki implementacji

1. Przygotowanie struktury plików:

```
src/
  └── pages/
      └── api/
          └── flashcard-sets/
              ├── index.ts        // POST, GET (list)
              └── [set_id]/
                  └── index.ts    // GET, PATCH
```

2. Implementacja walidacji:

   - Utworzenie schematów Zod
   - Dodanie middleware walidacji
   - Testy jednostkowe dla walidacji

3. Implementacja serwisu:

   - Metody CRUD
   - Integracja z AI
   - Obsługa błędów
   - Testy jednostkowe

4. Implementacja endpointów:

   - Obsługa żądań HTTP
   - Mapowanie DTO
   - Integracja z serwisem
   - Testy integracyjne

5. Implementacja bezpieczeństwa:

   - Konfiguracja RLS
   - Rate limiting
   - Testy bezpieczeństwa

6. Dokumentacja:

   - Komentarze JSDoc
   - Przykłady użycia
   - Dokumentacja OpenAPI

7. Weryfikacja:
   - Code review
   - Testy wydajnościowe
   - Audyt bezpieczeństwa
