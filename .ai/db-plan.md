# Schema bazy danych PostgreSQL dla 10xCards

## 1. Lista tabel z kolumnami, typami danych i ograniczeniami

### 1.1. Tabela: users (rozszerzenie auth.users z Supabase)

This table is managed by Supabase Auth 

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,  -- już dostępne z auth.users
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),  -- już dostępne z auth.users
    confirmed_at: TIMESTAMPTZ,
);

-- Indeksy
CREATE INDEX users_email_idx ON public.users(email);
```

### 1.2. Tabela: flashcard_sets

```sql
CREATE TABLE public.flashcard_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ai_generated_count INTEGER NULLABLE,
    ai_accepted_count INTEGER NULLABLE,
    ai_edited_count INTEGER NULLABLE,
    manual_count INTEGER NULLABLE,
    is_deleted BOOLEAN DEFAULT false,
    generation_duration: INTEGER NOT NULL,
    CONSTRAINT flashcard_sets_name_length CHECK (char_length(name) <= 255),
    CONSTRAINT flashcard_sets_counts_check CHECK (
        ai_generated_count >= 0 AND
        ai_accepted_count >= 0 AND
        ai_edited_count >= 0 AND
        manual_count >= 0
    )
);

-- Indeksy
CREATE INDEX flashcard_sets_user_id_created_at_idx ON public.flashcard_sets(user_id, created_at);
CREATE INDEX flashcard_sets_user_id_is_deleted_idx ON public.flashcard_sets(user_id, is_deleted);
```

### 1.3. Tabela: flashcards

```sql
CREATE TYPE flashcard_creation_type AS ENUM ('ai_generated', 'ai_edited', 'manual');

CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id UUID NOT NULL REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
    question VARCHAR(200) NOT NULL,
    answer VARCHAR(500) NOT NULL,
    creation_type flashcard_creation_type NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT flashcards_question_length CHECK (char_length(question) <= 200),
    CONSTRAINT flashcards_answer_length CHECK (char_length(answer) <= 500)
);

-- Indeksy
CREATE INDEX flashcards_set_id_creation_type_idx ON public.flashcards(set_id, creation_type);
CREATE INDEX flashcards_set_id_is_deleted_idx ON public.flashcards(set_id, is_deleted);
```

### 1.4. Trigger dla limitu fiszek w zestawie

```sql
CREATE OR REPLACE FUNCTION check_flashcards_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM public.flashcards WHERE set_id = NEW.set_id AND is_deleted = false) >= 30 THEN
        RAISE EXCEPTION 'Przekroczono limit 30 fiszek w zestawie';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_flashcards_limit
BEFORE INSERT ON public.flashcards
FOR EACH ROW EXECUTE FUNCTION check_flashcards_limit();
```

### 1.5. Trigger dla aktualizacji liczników w zestawie

```sql
CREATE OR REPLACE FUNCTION update_flashcard_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.flashcard_sets
        SET
            ai_generated_count = CASE WHEN NEW.creation_type = 'ai_generated' THEN ai_generated_count + 1 ELSE ai_generated_count END,
            ai_edited_count = CASE WHEN NEW.creation_type = 'ai_edited' THEN ai_edited_count + 1 ELSE ai_edited_count END,
            manual_count = CASE WHEN NEW.creation_type = 'manual' THEN manual_count + 1 ELSE manual_count END,
            updated_at = now()
        WHERE id = NEW.set_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.is_deleted <> OLD.is_deleted THEN
            UPDATE public.flashcard_sets
            SET
                ai_generated_count = CASE
                    WHEN OLD.creation_type = 'ai_generated' THEN ai_generated_count - 1
                    ELSE ai_generated_count END,
                ai_edited_count = CASE
                    WHEN OLD.creation_type = 'ai_edited' THEN ai_edited_count - 1
                    ELSE ai_edited_count END,
                manual_count = CASE
                    WHEN OLD.creation_type = 'manual' THEN manual_count - 1
                    ELSE manual_count END,
                updated_at = now()
            WHERE id = NEW.set_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_flashcard_set_counts
AFTER INSERT OR UPDATE ON public.flashcards
FOR EACH ROW EXECUTE FUNCTION update_flashcard_counts();
```

## 2. Relacje między tabelami

- Użytkownik (users) → Zestawy fiszek (flashcard_sets): jeden-do-wielu (1:N)

  - Każdy użytkownik może mieć wiele zestawów fiszek
  - Każdy zestaw fiszek należy do jednego użytkownika
  - Usunięcie użytkownika powoduje kaskadowe usunięcie jego zestawów

- Zestaw fiszek (flashcard_sets) → Fiszki (flashcards): jeden-do-wielu (1:N)
  - Każdy zestaw może mieć maksymalnie 30 fiszek
  - Każda fiszka należy do jednego zestawu
  - Usunięcie zestawu powoduje kaskadowe usunięcie wszystkich jego fiszek

## 3. Indeksy

Wszystkie indeksy zostały zdefiniowane w sekcji 1 przy odpowiednich tabelach. Podsumowanie:

- Tabela users:

  - `users_email_idx` - dla szybkiego wyszukiwania po emailu

- Tabela flashcard_sets:

  - `flashcard_sets_user_id_created_at_idx` - dla szybkiego pobierania zestawów użytkownika
  - `flashcard_sets_user_id_is_deleted_idx` - dla filtrowania nieusunietych zestawów

- Tabela flashcards:
  - `flashcards_set_id_creation_type_idx` - dla filtrowania fiszek po typie
  - `flashcards_set_id_is_deleted_idx` - dla filtrowania nieusunietych fiszek

## 4. Zasady Row Level Security (RLS)

### 4.1. Tabela users

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY users_update ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Brak polityki DELETE - używamy soft delete
```

### 4.2. Tabela flashcard_sets

```sql
ALTER TABLE public.flashcard_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY flashcard_sets_select ON public.flashcard_sets
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY flashcard_sets_insert ON public.flashcard_sets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY flashcard_sets_update ON public.flashcard_sets
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Brak polityki DELETE - używamy soft delete
```

### 4.3. Tabela flashcards

```sql
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY flashcards_select ON public.flashcards
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.flashcard_sets
        WHERE id = flashcards.set_id
        AND user_id = auth.uid()
    ));

CREATE POLICY flashcards_insert ON public.flashcards
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.flashcard_sets
        WHERE id = flashcards.set_id
        AND user_id = auth.uid()
    ));

CREATE POLICY flashcards_update ON public.flashcards
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.flashcard_sets
        WHERE id = flashcards.set_id
        AND user_id = auth.uid()
    ));

-- Brak polityki DELETE - używamy soft delete
```

## 5. Dodatkowe uwagi i wyjaśnienia

1. Soft Delete

   - Wykorzystujemy flagi `is_deleted` zamiast fizycznego usuwania rekordów
   - Pozwala to na zachowanie historii i potencjalne przywracanie danych
   - Ułatwia audyt i analitykę

2. Automatyczna aktualizacja statystyk

   - Triggery automatycznie aktualizują liczniki w `flashcard_sets`
   - Zapewnia to spójność danych i eliminuje potrzebę ręcznego zliczania

3. Walidacja danych

   - Ograniczenia CHECK zapewniają integralność danych
   - Limity długości tekstu są wymuszane na poziomie bazy danych

4. Bezpieczeństwo

   - RLS zapewnia izolację danych między użytkownikami
   - Każdy użytkownik ma dostęp tylko do własnych danych
   - Wykorzystanie UUID zmniejsza ryzyko zgadywania identyfikatorów

5. Wydajność

   - Indeksy zoptymalizowane pod najczęstsze operacje
   - Composite indeksy dla częstych warunków filtrowania

6. Skalowalność
   - Możliwość łatwego dodania nowych funkcjonalności bez zmian schematu
