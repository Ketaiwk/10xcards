# Plan Testów - 10xCards

## 1. Wprowadzenie i cele testowania

### 1.1. Cel dokumentu

Plan określa strategię, metodologię i zakres testowania aplikacji 10xCards w fazie MVP.

### 1.2. Cele testowania

- Weryfikacja poprawności działania kluczowych funkcjonalności aplikacji
- Zapewnienie wysokiej jakości generowanych fiszek przez AI
- Walidacja bezpieczeństwa danych użytkowników
- Weryfikacja dostępności i użyteczności interfejsu
- Zapewnienie stabilności integracji z zewnętrznymi serwisami (Supabase, OpenRouter.ai)

## 2. Zakres testów

### 2.1. Funkcjonalności objęte testami

1. System autentykacji użytkowników

   - Rejestracja
   - Logowanie
   - Resetowanie hasła
   - Zarządzanie sesją

2. Zarządzanie zestawami fiszek

   - Tworzenie nowego zestawu
   - Edycja zestawu
   - Usuwanie zestawu
   - Listowanie zestawów

3. Generowanie fiszek przez AI

   - Przetwarzanie tekstu źródłowego
   - Generowanie fiszek
   - Edycja wygenerowanych fiszek
   - Weryfikacja limitów i walidacji

4. Interfejs użytkownika
   - Responsywność
   - Dostępność
   - Obsługa błędów
   - Komunikaty dla użytkownika

### 2.2. Elementy wyłączone z testów

- Zaawansowane algorytmy powtórek
- Import z różnych formatów plików
- Współdzielenie fiszek między użytkownikami
- Integracje z innymi platformami edukacyjnymi
- Aplikacje mobilne

## 3. Typy testów

### 3.1. Testy jednostkowe

- Testowanie komponentów React
- Testowanie serwisów i funkcji pomocniczych
- Testowanie walidatorów i transformatorów danych
- Pokrycie testami min. 80% kodu

### 3.2. Testy integracyjne

- Integracja z Supabase
- Integracja z OpenRouter.ai
- Komunikacja między komponentami
- Przepływ danych w aplikacji

### 3.3. Testy E2E

- Pełne przepływy użytkownika
- Scenariusze biznesowe
- Testy różnych ścieżek nawigacji
- Walidacja formularzy

### 3.4. Testy wydajnościowe

- Czas odpowiedzi API
- Wydajność generowania fiszek
- Obsługa współbieżnych żądań
- Optymalizacja zapytań do bazy danych

### 3.5. Testy dostępności

- Zgodność z WCAG 2.1
- Testowanie z czytnikami ekranu
- Nawigacja klawiaturą
- Kontrast i czytelność

### 3.6. Testy bezpieczeństwa

- Autoryzacja i autentykacja
- Walidacja danych wejściowych
- Bezpieczeństwo sesji
- Ochrona danych użytkownika

## 4. Scenariusze testowe

### 4.1. Autentykacja

1. Rejestracja nowego użytkownika

   - Poprawna rejestracja z poprawnymi danymi
   - Walidacja pól formularza
   - Obsługa duplikatów emaili
   - Weryfikacja wymagań dotyczących hasła

2. Logowanie
   - Logowanie poprawnymi danymi
   - Obsługa niepoprawnych danych
   - Mechanizm "Zapomniałem hasła"
   - Persistencja sesji

### 4.2. Zarządzanie zestawami fiszek

1. Tworzenie zestawu

   - Walidacja nazwy (max 100 znaków)
   - Walidacja opisu (max 500 znaków)
   - Zapisywanie zestawu
   - Anulowanie tworzenia

2. Generowanie fiszek

   - Walidacja tekstu źródłowego (1000-10000 znaków)
   - Generowanie przez AI (limit 30 fiszek)
   - Wskaźnik postępu
   - Obsługa błędów AI

3. Edycja fiszek
   - Edycja pytań (max 200 znaków)
   - Edycja odpowiedzi (max 500 znaków)
   - Usuwanie pojedynczych fiszek
   - Usuwanie wszystkich fiszek

### 4.3. Interfejs użytkownika

1. Responsywność

   - Testowanie na różnych rozdzielczościach
   - Testowanie na różnych urządzeniach
   - Sprawdzenie punktów przełamania (breakpoints)

2. Dostępność

   - Testowanie nawigacji klawiaturą
   - Sprawdzenie atrybutów ARIA
   - Testowanie z czytnikami ekranu
   - Walidacja kontrastu kolorów

3. Komunikaty i powiadomienia
   - Wyświetlanie błędów walidacji
   - Potwierdzenia operacji
   - Wskaźniki ładowania
   - Komunikaty o sukcesie

## 5. Środowisko testowe

### 5.1. Środowiska

- Lokalne środowisko deweloperskie
- Środowisko testowe (staging)
- Środowisko produkcyjne

### 5.2. Wymagania techniczne

- Node.js v22.14.0
- Astro 5.5.5
- Supabase
- OpenRouter.ai API
- Przeglądarki: Chrome, Firefox, Safari, Edge (najnowsze wersje)

## 6. Narzędzia

### 6.1. Narzędzia do testowania

- Vitest + React Testing Library + MSW (testy jednostkowe i mocki API)
- Playwright (testy E2E)
- Lighthouse CI + WebPageTest (wydajność)
- Axe + pa11y + Storybook a11y addon (testy dostępności)
- k6 + Core Web Vitals monitoring (testy wydajnościowe)

### 6.2. Narzędzia do monitorowania i analizy

- Sentry + LogRocket (monitoring błędów i sesji użytkowników)
- OpenTelemetry + DataDog (monitoring wydajności)
- GitHub Actions + Dependabot + CodeQL + SonarCloud (CI/CD i jakość kodu)
- Supabase monitoring
- DigitalOcean monitoring

## 7. Harmonogram testów

### 7.1. Testy podczas rozwoju

- Testy jednostkowe podczas implementacji (Vitest)
- Code review z testami i analizą SonarCloud
- Testy integracyjne dla nowych funkcjonalności
- Automatyczne testy dostępności (pa11y, Storybook a11y)
- Ciągłe monitorowanie wydajności (Lighthouse CI)

### 7.2. Testy przed wdrożeniem

- Pełny zestaw testów automatycznych
- Testy manualne kluczowych scenariuszy
- Testy wydajnościowe
- Testy bezpieczeństwa

## 8. Kryteria akceptacji

### 8.1. Kryteria ilościowe

- Pokrycie kodu testami > 80% (mierzone przez Vitest i SonarCloud)
- Czas odpowiedzi API < 1s (monitorowane przez OpenTelemetry i DataDog)
- Wskaźnik akceptacji fiszek > 75%
- Zero krytycznych błędów bezpieczeństwa (weryfikowane przez CodeQL)
- Core Web Vitals w zielonym zakresie
- Wynik Lighthouse > 90 dla wszystkich kategorii
- Zero błędów dostępności w testach automatycznych (pa11y, axe)

### 8.2. Kryteria jakościowe

- Pozytywne wyniki testów dostępności
- Spójne działanie na wszystkich przeglądarkach
- Intuicyjność interfejsu użytkownika
- Poprawność generowanych fiszek

## 9. Role i odpowiedzialności

### 9.1. Zespół testowy

- Inżynier QA (lead)
- Tester automatyzujący
- Tester manualny
- Deweloper testowy

### 9.2. Pozostałe role

- Product Owner (akceptacja testów)
- Deweloperzy (testy jednostkowe)
- DevOps (środowiska testowe)

## 10. Procedury raportowania błędów

### 10.1. Klasyfikacja błędów

- Krytyczne (blokujące)
- Wysokie (istotne)
- Średnie (uciążliwe)
- Niskie (kosmetyczne)

### 10.2. Proces raportowania

1. Utworzenie zgłoszenia w systemie
2. Przypisanie priorytetu i kategorii
3. Dokumentacja kroków reprodukcji
4. Weryfikacja poprawki
5. Zamknięcie zgłoszenia

### 10.3. Wymagane informacje w zgłoszeniu

- Środowisko testowe
- Kroki reprodukcji
- Oczekiwany rezultat
- Aktualny rezultat
- Załączniki (screenshoty, logi)

Ten plan testów będzie regularnie aktualizowany w miarę rozwoju projektu i identyfikacji nowych wymagań testowych.
