# Architektura UI dla 10xCards

## 1. Przegląd struktury UI

10xCards wykorzystuje hierarchiczną strukturę nawigacji opartą na zestawach fiszek. Głównym punktem wejścia jest dashboard prezentujący zestawy użytkownika. System wykorzystuje modalne formularze do edycji, klasyczną paginację i zapewnia ciągły feedback podczas operacji AI.

## 2. Lista widoków

### 2.1. Logowanie (/auth/login)

- **Cel**: Bezpieczna autentykacja użytkownika
- **Kluczowe informacje**: Formularz logowania
- **Komponenty**:
  - Formularz logowania (email + hasło)
  - Link do rejestracji
  - Przyciski logowania przez OAuth
- **UX/Dostępność**:
  - Walidacja formularza
  - Obsługa błędów logowania
  - Komunikaty o statusie (ARIA live)

### 2.2. Rejestracja (/auth/register)

- **Cel**: Utworzenie nowego konta
- **Kluczowe informacje**: Formularz rejestracji
- **Komponenty**:
  - Formularz rejestracji
  - Przyciski rejestracji przez OAuth
- **UX/Dostępność**:
  - Walidacja w czasie rzeczywistym
  - Komunikaty o statusie
  - Przekierowanie po sukcesie

### 2.3. Dashboard (/)

- **Cel**: Przegląd zestawów fiszek użytkownika
- **Kluczowe informacje**:
  - Lista zestawów
  - Podstawowe statystyki (ilość fiszek, ilość fiszek wygenerowanych przez AI, ilość edytowanych przez uytkownika i ilość dodanych ręcznie przez uzytkownika)
- **Komponenty**:
  - Lista kart zestawów z paginacją
  - Przycisk tworzenia nowego zestawu
  - Karty zestawów z metadanymi
- **UX/Dostępność**:
  - Paginacja z keyboard navigation
  - Sortowanie zestawów
  - Empty state dla nowych użytkowników

### 2.4. Tworzenie zestawu (/sets/new)

- **Cel**: Utworzenie nowego zestawu fiszek
- **Kluczowe informacje**:
  - Formularz tworzenia
  - Status generowania AI
- **Komponenty**:
  - Formularz z polami (nazwa, opis)
  - Pole tekstowe dla źródłowego tekstu
  - Progress indicator dla AI
  - Podgląd generowanych fiszek (mozliwość zaakceptowania fiszki, odrzucenia lub edytowania)
- **UX/Dostępność**:
  - Walidacja limitów tekstu
  - Wskaźnik postępu AI
  - Możliwość przerwania generowania
  - Explicit save

### 2.5. Widok zestawu (/sets/[id])

- **Cel**: Przeglądanie i zarządzanie fiszkami
- **Kluczowe informacje**:
  - Lista fiszek
  - Metadane zestawu
- **Komponenty**:
  - Lista fiszek z paginacją
  - Przyciski akcji dla fiszek (akceptacja wersji przygotowanej przez AI, edycja, usunięcie)
  - Modal edycji fiszki
  - Przycisk dodawania nowej fiszki
- **UX/Dostępność**:
  - Inline walidacja podczas edycji
  - Potwierdzenia usuwania
  - Wskaźniki typów fiszek (AI/manual)
  - Licznik fiszek (limit 30)

## 3. Mapa podróży użytkownika

### 3.1. Główny przepływ

1. Logowanie/Rejestracja
2. Dashboard z zestawami
3. Tworzenie nowego zestawu
   - Wprowadzenie tekstu źródłowego
   - Generowanie fiszek przez AI
   - Przegląd, akceptacja i edycja wygenerowanych fiszek
4. Zarządzanie zestawem
   - Przeglądanie fiszek
   - Edycja pojedynczych fiszek
   - Dodawanie/usuwanie fiszek

### 3.2. Alternatywne przepływy

- Manualne tworzenie fiszek
- Usuwanie zestawu

## 4. Układ i struktura nawigacji

### 4.1. Główna nawigacja

- Stały nagłówek z:
  - Logo (link do dashboard)
  - Menu z następującymi opcjami: Nowy zestaw, moje zestawy
  - Menu użytkownika (profil, wyloguj)

### 4.2. Nawigacja kontekstowa

- Breadcrumbs w widokach zestawów
- Przyciski powrotu
- Przyciski akcji kontekstowych

### 4.3. Hierarchia nawigacji

1. Dashboard (/)
2. Zestawy (/sets/\*)
3. Pojedyncze fiszki (w kontekście zestawu)

## 5. Kluczowe komponenty

### 5.1. Card flascard-set

- Bazowy komponent dla prezentacji zestawów
- Wyświetlany na liście zestawów
- Warianty dla różnych kontekstów
- Obsługa różnych stanów (hover, focus, active)

### 5.2. Card flascard

- Bazowy komponent dla prezentacji fiszek
- Warianty dla różnych kontekstów
- Obsługa różnych stanów (hover, focus, active)

### 5.3. Dialog

- Modal do edycji fiszek
- Potwierdzenia akcji
- Formularze w kontekście

### 5.4. Toast

- Notyfikacje o sukcesie/błędzie
- Statusy operacji
- Komunikaty walidacji

### 5.5. Pagination

- Nawigacja między stronami
- Kontrola liczby elementów
- Keyboard navigation

### 5.6. Progress Indicators

- Wskaźniki postępu AI
- Stany ładowania
- Feedback dla długich operacji

### 5.7. Form Controls

- Walidacja inline
- Liczniki znaków
- Przyciski akcji
- Stany błędów/sukcesu
