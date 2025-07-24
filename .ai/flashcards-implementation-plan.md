# API Endpoint Implementation Plan: Flashcards API

## 1. Przegląd punktu końcowego

Implementacja kompletnego zestawu endpointów REST API do zarządzania fiszkami w ramach zestawów z następującą funkcjonalnością:
- Tworzenie nowych fiszek w zestawie z kontrolą limitu (max 30 fiszek)
- Listowanie fiszek z paginacją i filtrowaniem
- Aktualizacja zawartości fiszek
- Obsługa soft delete

Wszystkie endpointy wymagają autoryzacji użytkownika i weryfikacji własności zestawu.

## 2. Szczegóły żądania

### 2.1. Create Flashcard (POST)

- Metoda: POST
- Ścieżka: `/api/flashcard-sets/{set_id}/flashcards`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body:
  ```typescript
  {
    question: string; // wymagane, max 200 znaków
    answer: string; // wymagane, max 500 znaków
    creation_type: "ai_generated" | "ai_edited" | "manual"; // wymagane
  }
  ```

### 2.2. List Flashcards (GET)

- Metoda: GET
- Ścieżka: `/api/flashcard-sets/{set_id}/flashcards`
- Query Parameters:
  - page (default: 1)
  - limit (default: 30, max: 100)
  - creation_type (ai_generated | ai_edited | manual)
- Headers:
  - `Authorization: Bearer <token>`

### 2.3. Update Flashcard (PATCH)

- Metoda: PATCH
- Ścieżka: `/api/flashcard-sets/{set_id}/flashcards/{id}`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body:
  ```typescript
  {
    question?: string;         // opcjonalne, max 200 znaków
    answer?: string;           // opcjonalne, max 500 znaków
    is_deleted?: boolean;      // opcjonalne
  }
  ```

## 3. Wykorzystywane typy

### 3.1. Command Models:

```typescript
import { CreateFlashcardCommand, UpdateFlashcardCommand } from "@/types";
```

### 3.2. Response Models:

```typescript
import { FlashcardResponse, FlashcardListResponse, ListFlashcardsParams } from "@/types";
```

### 3.3. Walidacja (Zod Schemas):

```typescript
import { z } from "zod";

const createFlashcardSchema = z.object({
  question: z.string().max(200),
  answer: z.string().max(500),
  creation_type: z.enum(["ai_generated", "ai_edited", "manual"]),
});

const updateFlashcardSchema = z.object({
  question: z.string().max(200).optional(),
  answer: z.string().max(500).optional(),
  is_deleted: z.boolean().optional(),
});
```

## 4. Szczegóły odpowiedzi

### 4.1. POST - 201 Created

```json
{
  "id": "uuid",
  "set_id": "uuid",
  "question": "string",
  "answer": "string",
  "creation_type": "string",
  "created_at": "timestamp"
}
```

### 4.2. GET - 200 OK

```json
{
  "items": [
    {
      "id": "uuid",
      "set_id": "uuid",
      "question": "string",
      "answer": "string",
      "creation_type": "string",
      "created_at": "timestamp"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### 4.3. PATCH - 200 OK

```json
{
  "id": "uuid",
  "set_id": "uuid",
  "question": "string",
  "answer": "string",
  "creation_type": "string",
  "created_at": "timestamp"
}
```

## 5. Przepływ danych

### 5.1. Create Flashcard:

1. Walidacja danych wejściowych (Zod)
2. Weryfikacja tokenu użytkownika
3. Weryfikacja istnienia i własności zestawu
4. Sprawdzenie limitu fiszek (30 per set) - trigger DB
5. Utworzenie fiszki w bazie
6. Zwrócenie odpowiedzi

### 5.2. List Flashcards:

1. Walidacja parametrów query
2. Weryfikacja tokenu użytkownika
3. Weryfikacja istnienia i własności zestawu
4. Pobranie fiszek z paginacją i filtrowaniem
5. Mapping do ResponseDTO
6. Zwrócenie odpowiedzi

### 5.3. Update Flashcard:

1. Walidacja danych wejściowych
2. Weryfikacja tokenu użytkownika
3. Weryfikacja istnienia zestawu i fiszki
4. Weryfikacja własności zasobów
5. Aktualizacja fiszki
6. Zwrócenie odpowiedzi

## 6. Względy bezpieczeństwa

### 6.1. Uwierzytelnianie:

- Wykorzystanie Supabase Auth
- Weryfikacja JWT w każdym żądaniu
- Automatyczne odświeżanie tokenów

### 6.2. Autoryzacja:

- Row Level Security (RLS) w Supabase
- Weryfikacja właściciela zasobu
- Izolacja danych między użytkownikami

### 6.3. Walidacja danych:

- Sanityzacja wszystkich danych wejściowych
- Walidacja typów i ograniczeń
- Obsługa XSS i SQL Injection (przez Supabase)

### 6.4. Rate Limiting:

- Ograniczenie liczby żądań per user
- Monitoring nietypowych wzorców użycia

## 7. Obsługa błędów

### 7.1. Walidacja (400):

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

### 7.2. Autoryzacja (401/403):

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

### 7.3. Not Found (404):

```typescript
if (!flashcard) {
  return new Response(
    JSON.stringify({
      error: "Flashcard not found",
    }),
    { status: 404 }
  );
}
```

### 7.4. Conflict (409):

```typescript
if (isFlashcardLimitExceeded) {
  return new Response(
    JSON.stringify({
      error: "Flashcard limit exceeded (30 per set)",
    }),
    { status: 409 }
  );
}
```

## 8. Rozważania dotyczące wydajności

### 8.1. Baza danych:

- Wykorzystanie indeksów
- Limit rozmiaru zapytań
- Optymalizacja paginacji

### 8.2. API:

- Kompresja odpowiedzi
- Efektywna paginacja
- Monitorowanie czasów odpowiedzi

### 8.3. Optymalizacje:

- Używanie prepared statements przez Supabase
- Limit query results na poziomie bazy (max 100 per page)

## 9. Kroki implementacji

1. Przygotowanie struktury plików:

```
src/
  └── pages/
      └── api/
          └── flashcard-sets/
              └── [set_id]/
                  └── flashcards/
                      ├── index.ts        # POST, GET
                      └── [id]/
                          └── index.ts    # PATCH
```

2. Implementacja walidacji:

   - Utworzenie schematów Zod
   - Dodanie middleware walidacji
   - Testy jednostkowe dla walidacji

3. Implementacja serwisu:

   - Metody CRUD
   - Walidacja własności zasobów
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
