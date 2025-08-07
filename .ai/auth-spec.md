# Specyfikacja Techniczna Modułu Autentykacji 10xCards

## 1. Architektura Interfejsu Użytkownika

### 1.1 Nowe Strony Astro

#### `/pages/auth/login.astro`

- Strona logowania z przekierowaniem na dashboard dla zalogowanych użytkowników
- Server-side rendering z obsługą stanu sesji
- Integracja komponentu `LoginForm`
- Obsługa parametrów URL dla przekierowań i komunikatów

#### `/pages/auth/register.astro`

- Strona rejestracji z podobną logiką co login
- Integracja komponentu `RegisterForm`
- Walidacja server-side stanu sesji

#### `/pages/auth/forgot-password.astro`

- Strona resetowania hasła
- Integracja komponentu `ForgotPasswordForm`

#### `/pages/auth/reset-password.astro`

- Strona zmiany hasła po otrzymaniu linku reset
- Walidacja tokenu reset i obsługa błędów
- Integracja komponentu `ResetPasswordForm`

### 1.2 Komponenty React

#### Formularze Autentykacji (`/src/components/auth/`)

##### `LoginForm.tsx`

- Formularz logowania email/hasło
- Walidacja client-side:
  - Email (format)
  - Hasło (min. 8 znaków)
- Obsługa błędów Supabase
- Integracja z systemem powiadomień
- Stan ładowania
- Link do resetowania hasła

##### `RegisterForm.tsx`

- Formularz rejestracji
- Walidacja client-side:
  - Email (format)
  - Hasło (min. 8 znaków)
  - Potwierdzenie hasła
- Obsługa błędów Supabase
- Stan ładowania
- Link do logowania

##### `ForgotPasswordForm.tsx`

- Formularz requestu resetu hasła
- Walidacja emaila
- Komunikat potwierdzenia wysłania
- Stan ładowania
- Link powrotu do logowania

##### `ResetPasswordForm.tsx`

- Formularz zmiany hasła
- Walidacja nowego hasła
- Obsługa błędów tokenu reset
- Przekierowanie po resecie

#### Komponenty UI

##### `AuthLayout.tsx`

- Layout dla stron auth z logo i opisem
- Kontener na komunikaty i formularze
- Spójny wygląd dla wszystkich formularzy

##### `AuthStatus.tsx`

- Komponent w prawym górnym rogu layoutu
- Wyświetla stan zalogowania
- Przycisk Login/Logout
- Menu użytkownika

### 1.3 Modyfikacje Istniejących Komponentów

#### Layout.astro

- Dodanie `AuthStatus` w headerze
- Przekazywanie stanu sesji
- Warunkowe renderowanie elementów auth

#### FlashcardSetCreationView.tsx

- Dodanie warunkowego renderowania dla niezalogowanych
- Komunikat zachęcający do rejestracji z informacją o niemożności zapisania zestawu
- Przekierowanie do /auth/login z return_url
- Zachowanie tymczasowego stanu fiszek w localStorage dla płynnego UX po zalogowaniu

## 2. Logika Backendowa

### 2.1 Endpointy API (/pages/api/auth/)

#### POST /api/auth/login

- Logowanie użytkownika przez Supabase Auth
- Walidacja danych wejściowych (Zod)
- Zwraca token sesji i dane użytkownika
- Obsługa błędów auth

#### POST /api/auth/register

- Rejestracja użytkownika przez Supabase Auth
- Walidacja danych (Zod)
- Utworzenie rekordu w profiles
- Automatyczne logowanie po rejestracji

#### POST /api/auth/logout

- Wylogowanie i czyszczenie sesji
- Przekierowanie do strony głównej

#### POST /api/auth/forgot-password

- Inicjacja procesu reset hasła
- Wysłanie emaila z linkiem reset

#### POST /api/auth/reset-password

- Reset hasła po weryfikacji tokenu
- Walidacja nowego hasła
- Aktualizacja w Supabase Auth

### 2.2 Middleware (/middleware/index.ts)

#### AuthMiddleware

- Weryfikacja sesji w Supabase
- Przekierowania dla chronionych ścieżek:
  - /sets/\* (dostęp do zestawów)
  - /api/sets/\* (operacje na zestawach)
  - /api/flashcards/\* (operacje na fiszkach)
- Dodanie danych użytkownika do context
- Obsługa dostępu do publicznych zestawów dla niezalogowanych:
  - Podgląd zestawu dozwolony
  - Operacje modyfikacji zablokowane

### 2.3 Serwisy (/lib/services/)

#### auth.service.ts

- Logika biznesowa auth
- Integracja z Supabase Auth
- Obsługa sesji i tokenów
- Mapowanie błędów na komunikaty

#### user.service.ts

- Zarządzanie profilem użytkownika
- Integracja z tabelą profiles
- Obsługa dodatkowych danych

## 3. System Autentykacji

### 3.1 Integracja Supabase Auth

#### Konfiguracja

- Email auth z własnym UI
- Domyślne emaile (rejestracja, reset)
- Rate limiting
- Sesje cookie-based

#### Middleware Astro

- Sprawdzanie sesji w cookies
- Przekazywanie klienta Supabase
- Obsługa wygasłych sesji

#### Obsługa Sesji

- Server-side session check
- Automatyczne odświeżanie
- Czyszczenie przy wylogowaniu

### 3.2 Przepływ Danych

#### Context i State

- Przechowywanie stanu auth w React
- Przekazywanie przez Context
- SSR z danymi sesji

#### Kontrola Dostępu

- Guard routes w middleware
- Warunkowe renderowanie UI
- Przekierowania z return_url

### 3.3 Bezpieczeństwo

#### Walidacja

- Sanityzacja inputów
- Walidacja tokenów
- Rate limiting endpointów

#### Sesje

- HttpOnly cookies
- CSRF protection
- Secure headers

#### Errors

- Bezpieczne komunikaty błędów
- Logowanie incydentów
- Obsługa edge cases
