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

## US-004: Kolekcje fiszek
- **Opis:** Jako użytkownik chcę móc zapisywać i edytować zestawy fiszek, aby móc się z nich uczyć.
- Kryteria akceptacji:
  - Użytkownik może zapisać aktualny zestaw fiszek.
  - Użytkownik może aktualizować zestaw.
  - Użytkownik może usunąć zestaw.
  - Funkcjonalność zestawów nie jest dostępna bez logowania się do systemu (US-001, US-002, US-003).

## US-005: Bezpieczny dostęp i uwierzytelnianie
- **Opis:** Jako użytkownik chcę mieć możliwość rejestracji i logowania się do systemu w sposób zapewniający bezpieczeństwo moich danych.
- **Kryteria akceptacji:**
  - Logowanie i rejestracja odbywają się na dedykowanych stronach.
  - Logowanie wymaga podania adresu email i hasła.
  - Rejestracja wymaga podania adresu email, hasła i potwierdzenia hasła.
  - Użytkownik NIE MOŻE korzystać z fiszek i zestawów fiszek bez logowania się do systemu (US-001, US-002, US-003).
  - Użytkownik może logować się do systemu poprzez przycisk w prawym górnym rogu.
  - Użytkownik może się wylogować z systemu poprzez przycisk w prawym górnym rogu w głównym @Layout.astro.
  - Nie korzystamy z zewnętrznych serwisów logowania (np. Google, GitHub).
  - Odzyskiwanie hasła powinno być możliwe.

## 6. Metryki sukcesu
- 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkownika.
- Użytkownicy tworzą 75% fiszek z wykorzystaniem AI.