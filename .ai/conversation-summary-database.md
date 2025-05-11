<conversation_summary>

<decisions>

## Decisions

1. Struktura zestawów fiszek będzie płaska dla każdego użytkownika.
2. Każdy zestaw reprezentuje jedną sesję tworzenia fiszek.
3. System będzie przechowywał tekst źródłowy i datę utworzenia zestawu.
4. Dla każdego zestawu będą śledzone statystyki:
   - liczba fiszek wygenerowanych przez AI,
   - liczba zaakceptowanych fiszek,
   - liczba edytowanych fiszek,
   - liczba fiszek utworzonych manualnie.
5. Każda fiszka będzie miała oznaczenie typu utworzenia:
   - `ai_generated`,
   - `ai_edited`,
   - `manual`.
6. Zestawy będą miały nazwę (wymagane) i opis (opcjonalne).
7. Limit 30 fiszek na zestaw.
8. Możliwość usuwania całych zestawów.
9. Śledzenie daty ostatniej modyfikacji zestawu.

</decisions>

<matched_recommendations>

## Matched Recommendations

### Struktura tabel:

#### a) users (rozszerzenie tabeli auth.users z Supabase)

- `id` (uuid, PRIMARY KEY, REFERENCES auth.users)
- `email` (text, NOT NULL) - już dostępne z auth.users
- `created_at` (timestamp with time zone) - już dostępne z auth.users
- `first_name` (varchar(50))
- `last_name` (varchar(50))
- `avatar_url` (text)
- `settings` (jsonb) - dla przyszłych preferencji użytkownika
- `last_active_at` (timestamp with time zone)
- `is_active` (boolean, default false)

#### b) flashcard_sets

- `id` (uuid, PRIMARY KEY)
- `user_id` (uuid, REFERENCES auth.users)
- `name` (varchar(255), NOT NULL)
- `description` (text)
- `source_text` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)
- `ai_generated_count` (integer)
- `ai_accepted_count` (integer)
- `ai_edited_count` (integer)
- `manual_count` (integer)
- `is_deleted` (boolean, default false)
- `metadata` (jsonb)

#### c) flashcards

- `id` (uuid, PRIMARY KEY)
- `set_id` (uuid, REFERENCES flashcard_sets)
- `question` (varchar(200))
- `answer` (varchar(500))
- `creation_type` (enum: 'ai_generated', 'ai_edited', 'manual')
- `is_deleted` (boolean, default false)
- `created_at` (timestamp with time zone)

### Implementacja Row Level Security (RLS) dla obu tabel

### Indeksy:

- `users(email)`
- `users(last_active_at)` gdzie `is_active = true`
- `flashcard_sets(user_id, created_at)`
- `flashcard_sets(user_id, is_deleted)`
- `flashcards(set_id, creation_type)`
- `flashcards(set_id, is_deleted)`

### Ograniczenia:

- `CHECK` na długość `question` (200 znaków) i `answer` (500 znaków).
- `CHECK` na `creation_type` (enum).
- `CHECK` na limit fiszek w zestawie (30).
- Foreign key constraints z `CASCADE` na usuwanie.

### Polityki RLS:

#### Tabela users:

- SELECT: użytkownik może zobaczyć tylko własne dane
- UPDATE: użytkownik może aktualizować tylko własne dane
- DELETE: brak możliwości usunięcia (soft delete przez is_active)

#### Tabela flashcard_sets:

- SELECT: użytkownik może zobaczyć tylko własne zestawy
- UPDATE: użytkownik może aktualizować tylko własne zestawy
- DELETE: brak możliwości usunięcia (soft delete przez is_deleted)

</matched_recommendations>

<database_planning_summary>

## Database Planning Summary

Schemat bazy danych dla MVP 10xCards został zaplanowany z uwzględnieniem głównych wymagań funkcjonalnych i technicznych:

### Główne encje:

- Zestawy fiszek (`flashcard_sets`)
- Fiszki (`flashcards`)
- Użytkownicy (zarządzane przez Supabase Auth)

### Relacje:

- Jeden użytkownik może mieć wiele zestawów (1:N).
- Jeden zestaw może mieć wiele fiszek (1:N, max 30).

### Kluczowe funkcjonalności:

- Śledzenie źródła utworzenia fiszek (AI vs manual).
- Statystyki dla zestawów.

</database_planning_summary>
