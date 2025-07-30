# Plan implementacji widoku tworzenia zestawu fiszek

## 1. Przegląd

Widok tworzenia zestawu fiszek umożliwia użytkownikom tworzenie nowych zestawów fiszek poprzez wprowadzenie tekstu źródłowego i automatyczne generowanie fiszek za pomocą AI lub ręczne dodawanie pojedynczych fiszek. Widok obsługuje edycję inline, walidację w czasie rzeczywistym oraz zarządzanie wygenerowanymi fiszkami.

## 2. Routing widoku

- Ścieżka: `/sets/new`
- Komponent strony: `src/pages/sets/new.astro`

## 3. Struktura komponentów

```
FlashcardSetCreationView (React)
├── SourceTextForm
│   ├── TextField (shadcn/ui)
│   └── Button (shadcn/ui)
├── ProgressIndicator
│   └── Progress (shadcn/ui)
├── FlashcardList
│   ├── FlashcardEditor
│   │   ├── Card (shadcn/ui)
│   │   └── TextField (shadcn/ui)
│   └── Pagination (shadcn/ui)
└── ActionButtons
    └── Button (shadcn/ui)
```

## 4. Szczegóły komponentów

### FlashcardSetCreationView

- Opis: Główny komponent widoku tworzenia zestawu
- Główne elementy: Formularz nazwy i opisu, SourceTextForm, ProgressIndicator, FlashcardList
- Obsługiwane interakcje: Zapisanie zestawu, generowanie fiszek
- Obsługiwana walidacja: Wymagana nazwa zestawu
- Typy: FlashcardSetCreationState
- Propsy: brak (komponent główny)

### SourceTextForm

- Opis: Formularz wprowadzania tekstu źródłowego
- Główne elementy: Pole tekstowe, przycisk generowania
- Obsługiwane interakcje: Wprowadzanie tekstu, rozpoczęcie generowania
- Obsługiwana walidacja: 1000-10000 znaków dla tekstu źródłowego
- Typy: SourceTextFormProps
- Propsy:
  - onGenerate: (text: string) => Promise<void>
  - isGenerating: boolean

### ProgressIndicator

- Opis: Wskaźnik postępu generowania fiszek
- Główne elementy: Pasek postępu, komunikat statusu
- Obsługiwane interakcje: brak
- Typy: ProgressIndicatorProps
- Propsy:
  - progress: number
  - status: string

### FlashcardList

- Opis: Lista wygenerowanych fiszek z możliwością edycji
- Główne elementy: Lista fiszek, paginacja
- Obsługiwane interakcje: Edycja, usuwanie, nawigacja
- Obsługiwana walidacja: Limit 30 fiszek
- Typy: FlashcardListProps, FlashcardViewModel
- Propsy:
  - flashcards: FlashcardViewModel[]
  - onEdit: (id: string, data: UpdateFlashcardCommand) => Promise<void>
  - onDelete: (id: string) => Promise<void>

### FlashcardEditor

- Opis: Komponent edycji pojedynczej fiszki
- Główne elementy: Pola pytania i odpowiedzi
- Obsługiwane interakcje: Edycja tekstu, zapisanie zmian
- Obsługiwana walidacja: max 200 znaków pytanie, max 500 znaków odpowiedź
- Typy: FlashcardEditorProps
- Propsy:
  - flashcard: FlashcardViewModel
  - onSave: (data: UpdateFlashcardCommand) => Promise<void>
  - onCancel: () => void

### ActionButtons

- Opis: Panel akcji dla zestawu fiszek
- Główne elementy: Przyciski akcji (shadcn/ui Button)
- Obsługiwane interakcje:
  - Zapisanie wszystkich fiszek
  - Usunięcie wszystkich fiszek
  - Usunięcie całego zestawu
- Obsługiwana walidacja: Potwierdzenie przed usunięciem
- Typy: ActionButtonsProps
- Propsy:
  - onSave: () => Promise<void>
  - onDeleteAll: () => Promise<void>
  - onDeleteSet: () => Promise<void>
  - isSaving: boolean
  - isDeleting: boolean

## 5. Typy

```typescript
interface FlashcardSetCreationState {
  name: string;
  description?: string;
  sourceText?: string;
  isGenerating: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  flashcards: FlashcardViewModel[];
  generationProgress: number;
  error?: string;
}

interface FlashcardViewModel extends FlashcardResponse {
  isEditing: boolean;
  validationErrors?: {
    question?: string;
    answer?: string;
  };
}

interface SourceTextFormProps {
  onGenerate: (text: string) => Promise<void>;
  isGenerating: boolean;
}

interface ProgressIndicatorProps {
  progress: number;
  status: string;
}

interface FlashcardListProps {
  flashcards: FlashcardViewModel[];
  onEdit: (id: string, data: UpdateFlashcardCommand) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface FlashcardEditorProps {
  flashcard: FlashcardViewModel;
  onSave: (data: UpdateFlashcardCommand) => Promise<void>;
  onCancel: () => void;
}

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  onDeleteAll: () => Promise<void>;
  onDeleteSet: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}
```

## 6. Zarządzanie stanem

Utworzenie custom hooka `useFlashcardSetCreation`:

```typescript
const useFlashcardSetCreation = () => {
  const [state, setState] = useState<FlashcardSetCreationState>({
    name: "",
    isGenerating: false,
    flashcards: [],
    generationProgress: 0,
    isSaving: false,
    isDeleting: false,
  });

  // Metody zarządzania stanem...

  return {
    state,
    generateFlashcards,
    editFlashcard,
    deleteFlashcard,
    saveSet,
    deleteAllFlashcards,
    deleteSet,
  };
};
```

## 7. Integracja API

- Tworzenie zestawu: POST /api/flashcard-sets
- Tworzenie fiszek: POST /api/flashcard-sets/{set_id}/flashcards
- Aktualizacja fiszek: PATCH /api/flashcard-sets/{set_id}/flashcards/{id}
- Listowanie fiszek: GET /api/flashcard-sets/{set_id}/flashcards

## 8. Interakcje użytkownika

1. Wprowadzanie nazwy i opisu zestawu
2. Wprowadzanie tekstu źródłowego
3. Uruchamianie generowania AI
4. Edycja wygenerowanych fiszek
5. Usuwanie niepotrzebnych fiszek
6. Zapisywanie zestawu

## 9. Warunki i walidacja

- Nazwa zestawu: wymagana
- Tekst źródłowy: 1000-10000 znaków
- Pytanie fiszki: max 200 znaków
- Odpowiedź fiszki: max 500 znaków
- Limit fiszek: 30 per zestaw

## 10. Obsługa błędów

1. Błędy walidacji:
   - Wyświetlanie komunikatów pod polami
   - Blokowanie akcji przy nieprawidłowych danych
2. Błędy API:
   - Toast z komunikatem błędu
   - Możliwość ponowienia akcji
3. Błędy generowania AI:
   - Możliwość przerwania
   - Automatyczne wznawianie po błędzie

## 11. Kroki implementacji

1. Utworzenie struktury plików:

   ```
   src/pages/sets/new.astro
   src/components/flashcard-set/
     ├── FlashcardSetCreationView.tsx
     ├── SourceTextForm.tsx
     ├── ProgressIndicator.tsx
     ├── FlashcardList.tsx
     └── FlashcardEditor.tsx
   ```

2. Implementacja komponentów base:

   - Szkielet FlashcardSetCreationView
   - Podstawowe formularze
   - Komponenty UI z shadcn

3. Implementacja hooka useFlashcardSetCreation:

   - Stan formularza
   - Logika walidacji
   - Integracja z API

4. Implementacja generowania AI:

   - SourceTextForm
   - ProgressIndicator
   - Obsługa statusu generowania

5. Implementacja zarządzania fiszkami:

   - FlashcardList
   - FlashcardEditor
   - Logika edycji i usuwania

6. Implementacja walidacji:

   - Walidacja w czasie rzeczywistym
   - Komunikaty błędów
   - Blokowanie akcji

7. Implementacja UI/UX:

   - Animacje przejść
   - Wskaźniki ładowania
   - Komunikaty zwrotne

8. Testy i optymalizacja:
   - Testy komponentów
   - Optymalizacja wydajności
   - Dostępność (ARIA)
