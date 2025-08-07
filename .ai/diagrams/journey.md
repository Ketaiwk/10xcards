# Journey Map - Proces autentykacji w 10xCards

```mermaid
journey
    title Mapa procesu autentykacji użytkownika
    section Logowanie
        Wypełnienie formularza: 3: Użytkownik
        Wysłanie danych: 3: Użytkownik, SupabaseClient
        Weryfikacja danych: 2: SupabaseAuth
        Generowanie tokenu: 2: JWT
        Zapis tokenu: 3: LocalStorage
    section Weryfikacja sesji
        Sprawdzenie tokenu: 2: AuthMiddleware
        Weryfikacja JWT: 2: SupabaseAuth
        Potwierdzenie ważności: 3: AuthMiddleware
    section Dostęp do zasobów
        Dołączenie tokenu: 3: LocalStorage
        Autoryzacja dostępu: 2: AuthMiddleware
        Wykonanie operacji: 3: AuthService
    section Odświeżanie tokenu
        Wykrycie wygaśnięcia: 2: SupabaseClient
        Pobranie nowego tokenu: 3: SupabaseAuth
```

## Opis etapów

### Logowanie

- Użytkownik wprowadza dane logowania w formularzu
- Dane są przesyłane do Supabase przez klienta
- Supabase weryfikuje dane w bazie
- Generowany jest token JWT
- Token jest zapisywany w LocalStorage

### Weryfikacja sesji

- Middleware sprawdza obecność tokenu
- Token jest weryfikowany przez Supabase
- Middleware potwierdza ważność sesji

### Dostęp do zasobów

- Token jest dołączany do żądań
- Middleware autoryzuje dostęp
- Serwis wykonuje operacje z odpowiednimi uprawnieniami

### Odświeżanie tokenu

- Wykrycie wygaśnięcia tokenu przez klienta
- Automatyczne pobranie nowego tokenu od Supabase

## Skala satysfakcji

- 1: Problematyczne
- 2: Neutralne
- 3: Satysfakcjonujące
