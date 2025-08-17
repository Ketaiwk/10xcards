# Plan implementacji widoku Dashboard

## 1. Przegląd

Widok dashboardu prezentuje listę zestawów fiszek użytkownika wraz z podstawowymi statystykami każdego zestawu. Umożliwia szybki przegląd, sortowanie, paginację oraz tworzenie nowych zestawów. Widok dostępny jest wyłącznie dla zalogowanych użytkowników.

## 2. Routing widoku

- Ścieżka: `/`
- Widok dostępny po zalogowaniu (middleware autoryzacji)

## 3. Struktura komponentów

- `DashboardPage` (kontener widoku)
  - `SortControl` (sortowanie listy zestawów)
  - `CreateSetButton` (przycisk tworzenia nowego zestawu)
  - `FlashcardSetList` (lista zestawów)
    - `FlashcardSetCard` (pojedyncza karta zestawu)
  - `Pagination` (kontrola paginacji)
  - `EmptyState` (widok pusty dla nowych użytkowników)

## 4. Szczegóły komponentów

### DashboardPage

- Opis: Główny kontener widoku, zarządza stanem, pobiera dane z API, renderuje podkomponenty.
- Główne elementy: wrapper, nagłówek, sekcja listy, sekcja paginacji, obsługa loading/error.
- Obsługiwane interakcje: zmiana strony, sortowanie, tworzenie zestawu.
- Walidacja: sprawdzenie autoryzacji, obsługa błędów API.
- Typy: DashboardViewModel, FlashcardSetListResponse.
- Propsy: brak (główny widok).

### SortControl

- Opis: Komponent do wyboru sortowania zestawów (np. po dacie utworzenia, nazwie).
- Główne elementy: select/dropdown, label.
- Obsługiwane interakcje: zmiana sortowania, keyboard navigation.
- Walidacja: walidacja dostępnych opcji sortowania.
- Typy: sortBy, sortOrder.
- Propsy: sortBy, sortOrder, onChange.

### CreateSetButton

- Opis: Przycisk do tworzenia nowego zestawu fiszek.
- Główne elementy: button, ikona.
- Obsługiwane interakcje: kliknięcie → modal/strona tworzenia zestawu.
- Walidacja: dostępność tylko dla zalogowanych.
- Typy: brak.
- Propsy: onClick.

### FlashcardSetList

- Opis: Lista zestawów fiszek użytkownika.
- Główne elementy: lista, mapowanie na `FlashcardSetCard`.
- Obsługiwane interakcje: kliknięcie karty, keyboard navigation.
- Walidacja: walidacja typów zestawów.
- Typy: FlashcardSetListItemResponse[]
- Propsy: sets, onSelect.

### FlashcardSetCard

- Opis: Pojedyncza karta zestawu z metadanymi/statystykami.
- Główne elementy: nazwa, opis, statystyki (liczby fiszek, AI, edytowanych, ręcznych), daty.
- Obsługiwane interakcje: kliknięcie, focus.
- Walidacja: walidacja typów pól.
- Typy: FlashcardSetListItemResponse
- Propsy: set, onClick.

### Pagination

- Opis: Kontrola paginacji listy zestawów.
- Główne elementy: przyciski/nawigacja, wskaźnik strony.
- Obsługiwane interakcje: zmiana strony, keyboard navigation.
- Walidacja: zakres stron, dostępność przycisków.
- Typy: page, limit, total, onPageChange.
- Propsy: page, limit, total, onPageChange.

### EmptyState

- Opis: Widok pusty dla nowych użytkowników bez zestawów.
- Główne elementy: komunikat, CTA do utworzenia zestawu.
- Obsługiwane interakcje: kliknięcie CTA.
- Walidacja: renderowany gdy sets.length === 0.
- Typy: brak.
- Propsy: onCreateSet.

## 5. Typy

- `FlashcardSetListResponse`: { items: FlashcardSetListItemResponse[], total: number, page: number, limit: number }
- `FlashcardSetListItemResponse`: { id: string, name: string, description?: string, created_at: string, updated_at: string, ai_generated_count: number, ai_accepted_count: number, ai_edited_count: number, manual_count: number }
- `DashboardViewModel`: { sets: FlashcardSetListItemResponse[], page: number, limit: number, total: number, sortBy: string, sortOrder: "asc"|"desc", loading: boolean, error: string|null, isEmpty: boolean }

## 6. Zarządzanie stanem

- Custom hook `useDashboardSets` do pobierania zestawów, zarządzania loading, error, paginacją, sortowaniem.
- Stan lokalny: page, limit, sortBy, sortOrder, sets, loading, error.
- Synchronizacja stanu z URL (query params).
- Obsługa retry w przypadku błędów.

## 7. Integracja API

- Endpoint: `GET /api/flashcard-sets?page=&limit=&sortBy=&sortOrder=`
- Typy żądania: PaginationParams, sortBy, sortOrder.
- Typy odpowiedzi: FlashcardSetListResponse.
- Obsługa błędów: status 401, 400, 500.
- Pobieranie danych przy zmianie paginacji/sortowania.

## 8. Interakcje użytkownika

- Kliknięcie "Utwórz zestaw" → modal/strona tworzenia zestawu.
- Kliknięcie karty zestawu → szczegóły/edytuj zestaw.
- Zmiana strony paginacji → pobranie nowych danych.
- Zmiana sortowania → pobranie nowych danych.
- Keyboard navigation: paginacja, sortowanie, focus na kartach.

## 9. Warunki i walidacja

- Widok dostępny tylko po zalogowaniu.
- Walidacja parametrów paginacji/sortowania.
- Walidacja typów odpowiedzi z API.
- Empty state gdy brak zestawów.
- Walidacja dostępności przycisków paginacji.

## 10. Obsługa błędów

- Brak połączenia z API: komunikat o błędzie, opcja retry.
- Błędne parametry: komunikat o błędzie.
- Brak zestawów: empty state.
- Brak autoryzacji: przekierowanie do logowania.

## 11. Kroki implementacji

1. Utwórz routing widoku `/` i middleware autoryzacji.
2. Zdefiniuj typy DTO/ViewModel w `src/types.ts`.
3. Stwórz custom hook `useDashboardSets` do pobierania danych.
4. Zaimplementuj komponent `DashboardPage` jako kontener widoku.
5. Dodaj komponenty: `SortControl`, `CreateSetButton`, `FlashcardSetList`, `FlashcardSetCard`, `Pagination`, `EmptyState`.
6. Zaimplementuj integrację z API, obsługę loading/error.
7. Dodaj keyboard navigation i dostępność (ARIA, focus management).
8. Przetestuj widok (unit + e2e).
9. Zaimplementuj obsługę błędów i empty state.
10. Przeprowadź code review i testy dostępności.
