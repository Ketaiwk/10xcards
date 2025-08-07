# Diagram przepływu autentykacji w 10xCards

```mermaid
flowchart TD
    subgraph Client [Przeglądarka]
        UF[Formularze Auth]
        SC[Supabase Client]
        LS[(LocalStorage)]
    end

    subgraph Server [Serwer Astro]
        AM[AuthMiddleware]
        AE[Endpointy Auth]
        AS[Auth Service]
    end

    subgraph Supabase [Supabase Auth]
        SA[Auth API]
        JWT[JWT Service]
        DB[(Auth DB)]
    end

    %% Przepływ logowania
    UF -->|1. Dane logowania| SC
    SC -->|2. Żądanie auth| SA
    SA -->|3. Weryfikacja| DB
    DB -->|4. Dane użytkownika| SA
    SA -->|5. Generowanie JWT| JWT
    JWT -->|6. Token + Refresh| SC
    SC -->|7. Zapis tokenu| LS

    %% Weryfikacja sesji
    AM -->|8. Sprawdza token| SA
    SA -->|9. Weryfikacja JWT| JWT
    JWT -->|10. Status ważności| AM

    %% Chronione zasoby
    LS -->|11. Token w nagłówku| AM
    AM -->|12. Dodaje user context| AE
    AE -->|13. Operacje CRUD| AS
    AS -->|14. RLS policies| DB

    %% Odświeżanie tokenu
    SC -->|15. Token wygasł| SA
    SA -->|16. Nowy token| SC

    %% Style
    classDef browser fill:#f9f,stroke:#333,stroke-width:2px
    classDef server fill:#bbf,stroke:#333,stroke-width:2px
    classDef db fill:#dfd,stroke:#333,stroke-width:2px

    class Client browser
    class Server server
    class Supabase db

    %% Notatki
    style UF fill:#f9f,stroke:#333,stroke-width:1px
    style SC fill:#f9f,stroke:#333,stroke-width:1px
    style LS fill:#f96,stroke:#333,stroke-width:1px
    style SA fill:#9f9,stroke:#333,stroke-width:1px
    style JWT fill:#9f9,stroke:#333,stroke-width:1px
    style DB fill:#9f9,stroke:#333,stroke-width:1px
```

## Legenda

### Komponenty

- **Przeglądarka**

  - UF: Formularze logowania/rejestracji/resetu hasła
  - SC: Klient Supabase do komunikacji z API
  - LS: LocalStorage przechowujący token JWT

- **Serwer Astro**

  - AM: Middleware weryfikujący sesje
  - AE: Endpointy API obsługujące auth
  - AS: Serwis autoryzacji

- **Supabase Auth**
  - SA: API autentykacji
  - JWT: Serwis tokenów JWT
  - DB: Baza danych auth

### Przepływy

1. **Logowanie/Rejestracja**

   - Krok 1-7: Od formularza do zapisu tokenu

2. **Weryfikacja Sesji**

   - Krok 8-10: Sprawdzanie ważności tokenu

3. **Dostęp do Zasobów**

   - Krok 11-14: Weryfikacja i autoryzacja operacji

4. **Odświeżanie Tokenów**
   - Krok 15-16: Automatyczne odświeżanie wygasłych tokenów
