# Plan implementacji widoku zestawu fiszek

## 1. Przegląd

Widok zestawu fiszek umożliwia użytkownikowi przeglądanie, edytowanie oraz zarządzanie fiszkami w ramach wybranego zestawu. Użytkownik może dodawać nowe fiszki, edytować istniejące, usuwać je oraz przeglądać metadane zestawu. Widok wspiera paginację, walidację inline oraz potwierdzenia akcji.

## 2. Routing widoku

- Ścieżka: `/sets/[id]`
- Dostępny wyłącznie dla zalogowanych użytkowników

## 3. Struktura komponentów

- `FlashcardSetView` (główny widok)
  - `FlashcardCounter` (licznik fiszek)
  - `AddFlashcardButton` (dodawanie nowej fiszki)
  - `FlashcardList` (lista fiszek z paginacją)
    - `FlashcardCard` (pojedyncza fiszka)
      - `FlashcardTypeBadge` (wskaźnik typu fiszki)
      - `EditFlashcardModal` (modal edycji)
      - `ConfirmationDialog` (potwierdzenie usunięcia)

## 4. Szczegóły komponentów

### FlashcardSetView

- Opis: Główny kontener widoku zestawu, pobiera dane zestawu i listę fiszek, zarządza stanem paginacji, filtrów i modali.
- Główne elementy: nagłówek z nazwą i opisem zestawu, licznik fiszek, przycisk dodawania, lista fiszek.
- Obsługiwane interakcje: zmiana strony, dodanie fiszki, filtrowanie po typie.
- Walidacja: limit 30 fiszek, dostępność zestawu.
- Typy: FlashcardSetResponse, FlashcardListResponse.
- Propsy: brak (pobiera dane na podstawie parametru z routingu).

### FlashcardList

- Opis: Wyświetla listę fiszek z paginacją i filtrowaniem.
- Główne elementy: lista `FlashcardCard`, kontrolki paginacji.
- Interakcje: zmiana strony, filtrowanie.
- Walidacja: liczba fiszek na stronę (max 30).
- Typy: FlashcardListResponse.
- Propsy: items, page, limit, total, onPageChange, onEdit, onDelete.

### FlashcardCard

- Opis: Pojedyncza fiszka z akcjami (edycja, usunięcie, akceptacja AI).
- Główne elementy: pytanie, odpowiedź, typ fiszki, przyciski akcji.
- Interakcje: kliknięcie edycji, kliknięcie usunięcia, akceptacja wersji AI.
- Walidacja: długość pól, typ fiszki.
- Typy: FlashcardResponse.
- Propsy: flashcard, onEdit, onDelete, onAccept.

### EditFlashcardModal

- Opis: Modal do edycji fiszki z walidacją inline.
- Główne elementy: pola edycji, komunikaty walidacji, przycisk zapisu.
- Interakcje: edycja pól, zapis, anulowanie.
- Walidacja: question ≤ 200, answer ≤ 500.
- Typy: EditFlashcardDTO.
- Propsy: flashcard, open, onSave, onClose.

### AddFlashcardButton

- Opis: Przycisk otwierający modal dodawania nowej fiszki.
- Główne elementy: ikona, tekst.
- Interakcje: kliknięcie otwiera modal.
- Walidacja: blokada przy przekroczonym limicie.
- Typy: AddFlashcardDTO.
- Propsy: disabled, onClick.

### ConfirmationDialog

- Opis: Modal potwierdzający usunięcie fiszki.
- Główne elementy: tekst potwierdzenia, przyciski akcji.
- Interakcje: potwierdzenie, anulowanie.
- Walidacja: brak.
- Typy: brak.
- Propsy: open, onConfirm, onCancel.

### FlashcardTypeBadge

- Opis: Wskaźnik typu fiszki (AI/manual).
- Główne elementy: ikona, tekst.
- Interakcje: brak.
- Walidacja: typ fiszki.
- Typy: FlashcardCreationType.
- Propsy: creationType.

### FlashcardCounter

- Opis: Licznik fiszek w zestawie (max 30).
- Główne elementy: liczba, wskaźnik limitu.
- Interakcje: brak.
- Walidacja: blokada dodawania przy limicie.
- Typy: liczba.
- Propsy: count, max.

## 5. Typy

- `FlashcardSetResponse`: metadane zestawu (id, name, description, ...)
- `FlashcardListResponse`: paginowana lista fiszek (items, total, page, limit)
- `FlashcardResponse`: pojedyncza fiszka (id, set_id, question, answer, creation_type, created_at)
- `EditFlashcardDTO`: { question?: string, answer?: string, is_deleted?: boolean }
- `AddFlashcardDTO`: { question: string, answer: string, creation_type: FlashcardCreationType }
- `FlashcardCreationType`: "ai_generated" | "ai_edited" | "manual"

## 6. Zarządzanie stanem

- Stan zestawu: useFlashcardSet (dane zestawu, licznik fiszek)
- Stan listy fiszek: useFlashcards (items, paginacja, filtrowanie, loading, error)
- Stan modali: useModal (edycja, dodawanie), useConfirmation (usuwanie)
- Stan walidacji: lokalny w modalu edycji/dodawania

## 7. Integracja API

- Pobieranie metadanych zestawu: GET `/api/flashcard-sets/{set_id}` → FlashcardSetResponse
- Pobieranie listy fiszek: GET `/api/flashcard-sets/{set_id}/flashcards?page&limit&creation_type` → FlashcardListResponse
- Dodawanie fiszki: POST `/api/flashcard-sets/{set_id}/flashcards` → FlashcardResponse
- Edycja/usuwanie fiszki: PATCH `/api/flashcard-sets/{set_id}/flashcards/{id}` → FlashcardResponse

## 8. Interakcje użytkownika

- Przeglądanie listy fiszek z paginacją
- Filtrowanie po typie fiszki
- Dodawanie nowej fiszki (modal, walidacja)
- Edycja fiszki inline (modal, walidacja)
- Usuwanie fiszki (potwierdzenie)
- Akceptacja wersji AI (przycisk)

## 9. Warunki i walidacja

- Długość pytania ≤ 200 znaków
- Długość odpowiedzi ≤ 500 znaków
- Limit fiszek w zestawie: max 30
- Walidacja typów fiszek
- Walidacja dostępności zestawu/fiszki

## 10. Obsługa błędów

- 401: przekierowanie do logowania
- 404: komunikat o braku zestawu/fiszki
- 409: komunikat o przekroczonym limicie fiszek
- 400: komunikaty walidacji inline
- Błędy sieci: komunikaty toast/alert

## 11. Kroki implementacji

1. Utwórz routing `/sets/[id]` i główny komponent `FlashcardSetView`
2. Zaimplementuj pobieranie metadanych zestawu i listy fiszek (useEffect/useFlashcardSet/useFlashcards)
3. Zbuduj komponenty: licznik, lista, karta fiszki, modal edycji, modal dodawania, potwierdzenie usunięcia
4. Dodaj obsługę paginacji i filtrowania
5. Zaimplementuj walidację inline w modalach
6. Dodaj obsługę akcji: dodawanie, edycja, usuwanie, akceptacja AI
7. Obsłuż komunikaty błędów i edge-case'y
8. Przetestuj widok pod kątem UX, dostępności i walidacji
9. Dodaj testy jednostkowe i e2e dla kluczowych interakcji
10. Przeprowadź code review i wdrożenie
