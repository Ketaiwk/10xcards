# Dokument wymagań produktu (PRD) - 10xCards

## 1. Przegląd produktu
10xCards to aplikacja webowa, która automatyzuje proces tworzenia fiszek edukacyjnych za pomocą AI. Umożliwia użytkownikom generowanie, edytowanie i zarządzanie fiszkami w prosty i intuicyjny sposób. Produkt jest skierowany do osób uczących się, które chcą efektywnie korzystać z metody spaced repetition.

## 2. Problem użytkownika
Manualne tworzenie wysokiej jakości fiszek edukacyjnych jest czasochłonne i zniechęca użytkowników do korzystania z efektywnej metody nauki, jaką jest spaced repetition. Brak automatyzacji i intuicyjnych narzędzi ogranicza dostępność tej metody dla szerszego grona użytkowników.

## 3. Wymagania funkcjonalne
- Automatyczne generowanie fiszek przez AI na podstawie wprowadzonego tekstu.
- Możliwość manualnego tworzenia fiszek.
- Edycja inline fiszek.
- Przeglądanie i usuwanie fiszek.
- Prosty system kont użytkowników do przechowywania fiszek.
- Walidacja liczby znaków: maks. 200 znaków dla pytania i 500 znaków dla odpowiedzi.

## 4. Granice produktu
- MVP nie obejmuje zaawansowanego algorytmu powtórek (np. SuperMemo, Anki).
- Brak wsparcia dla importu wielu formatów (PDF, DOCX, itp.).
- Brak funkcji współdzielenia zestawów fiszek między użytkownikami.
- Brak integracji z innymi platformami edukacyjnymi.
- Aplikacja dostępna wyłącznie w wersji webowej (brak aplikacji mobilnych).

## 5. Historyjki użytkowników

### US-001: Generowanie fiszek przez AI
- **Opis:** Jako użytkownik chcę wkleić tekst, aby AI automatycznie wygenerowało fiszki, co pozwoli mi zaoszczędzić czas.
- **Kryteria akceptacji:**
  - Użytkownik wkleja tekst w dedykowane pole.
  - AI generuje fiszki z podziałem na pytania i odpowiedzi.
  - Fiszki spełniają ograniczenia liczby znaków.

### US-002: Edycja fiszek inline
- **Opis:** Jako użytkownik chcę edytować wygenerowane fiszki bezpośrednio w interfejsie, aby dostosować je do moich potrzeb.
- **Kryteria akceptacji:**
  - Użytkownik może kliknąć na fiszkę, aby edytować jej treść.
  - System waliduje liczbę znaków podczas edycji.

### US-003: Przeglądanie i usuwanie fiszek
- **Opis:** Jako użytkownik chcę przeglądać i usuwać fiszki, aby zarządzać moimi materiałami do nauki.
- **Kryteria akceptacji:**
  - Użytkownik widzi listę wszystkich fiszek.
  - Użytkownik może usunąć wybraną fiszkę.

### US-004: Bezpieczne logowanie
- **Opis:** Jako użytkownik chcę logować się do systemu, aby moje fiszki były bezpieczne.
- **Kryteria akceptacji:**
  - Użytkownik może zarejestrować konto za pomocą e-maila i hasła.
  - Użytkownik może zalogować się na swoje konto.

## 6. Metryki sukcesu
- 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkownika.
- Użytkownicy tworzą 75% fiszek z wykorzystaniem AI.