# Dokumentacja funkcjonalności tworzenia zestawu fiszek

## Przegląd

Widok tworzenia zestawu fiszek umożliwia użytkownikom tworzenie nowych zestawów fiszek poprzez automatyczne generowanie z tekstu źródłowego przy pomocy AI.

## Główne funkcjonalności

### 1. Tworzenie zestawu

- Wprowadzanie nazwy i opisu zestawu
- Walidacja nazwy (wymagana, max 100 znaków)
- Walidacja opisu (opcjonalny, max 500 znaków)

### 2. Generowanie fiszek

- Wprowadzanie tekstu źródłowego (1000-10000 znaków)
- Automatyczne generowanie fiszek przez AI
- Wskaźnik postępu generowania
- Limit 30 fiszek per zestaw

### 3. Zarządzanie fiszkami

- Edycja inline fiszek
- Walidacja pytań (max 200 znaków) i odpowiedzi (max 500 znaków)
- Usuwanie pojedynczych fiszek
- Usuwanie wszystkich fiszek
- Usuwanie całego zestawu

## Skróty klawiszowe

### Globalne

- `Ctrl/Cmd + S` - Zapisz zestaw
- `Escape` - Anuluj bieżącą operację

### Podczas edycji fiszki

- `Ctrl/Cmd + S` - Zapisz zmiany w fiszce
- `Escape` - Anuluj edycję fiszki

## Animacje i efekty wizualne

- Płynne pojawianie się nowych fiszek
- Animacje usuwania fiszek
- Wskaźniki ładowania podczas operacji
- Animowany wskaźnik postępu generowania

## Komunikaty i powiadomienia

- Informacje o postępie operacji
- Komunikaty o błędach walidacji
- Potwierdzenia dla operacji nieodwracalnych
- Powiadomienia o sukcesie operacji

## Dostępność

- Pełna obsługa klawiatury
- Odpowiednie atrybuty ARIA dla formularzy
- Komunikaty o błędach powiązane z polami formularzy
- Wyraźne stany aktywne i fokus dla interaktywnych elementów
- Odpowiedni kontrast kolorów dla tekstu i elementów interfejsu
