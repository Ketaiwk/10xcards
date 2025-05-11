-- Migration: Initial schema for 10xCards
-- Description: Creates the base schema including users extension, flashcard sets, and flashcards
-- with appropriate RLS policies and triggers
-- Author: GitHub Copilot
-- Date: 2025-05-04

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type public.flashcard_creation_type as enum ('ai_generated', 'ai_edited', 'manual');

-- Create users table (extension of auth.users)
create table public.users (
    id uuid primary key references auth.users(id),
    email varchar(255) not null,
    created_at timestamptz not null default now(),
    confirmed_at timestamptz
);

create index users_email_idx on public.users(email);

-- Create flashcard sets table
create table public.flashcard_sets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    name varchar(255) not null,
    description text,
    source_text text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    ai_generated_count integer default 0,
    ai_accepted_count integer default 0,
    ai_edited_count integer default 0,
    manual_count integer default 0,
    is_deleted boolean default false,
    generation_duration integer not null default 0,
    constraint flashcard_sets_name_length check (char_length(name) <= 255),
    constraint flashcard_sets_counts_check check (
        (ai_generated_count is null or ai_generated_count >= 0) and
        (ai_accepted_count is null or ai_accepted_count >= 0) and
        (ai_edited_count is null or ai_edited_count >= 0) and
        (manual_count is null or manual_count >= 0)
    )
);

create index flashcard_sets_user_id_created_at_idx on public.flashcard_sets(user_id, created_at);
create index flashcard_sets_user_id_is_deleted_idx on public.flashcard_sets(user_id, is_deleted);

-- Create flashcards table
create table public.flashcards (
    id uuid primary key default gen_random_uuid(),
    set_id uuid not null references public.flashcard_sets(id) on delete cascade,
    question varchar(200) not null,
    answer varchar(500) not null,
    creation_type flashcard_creation_type not null,
    is_deleted boolean default false,
    created_at timestamptz not null default now(),
    constraint flashcards_question_length check (char_length(question) <= 200),
    constraint flashcards_answer_length check (char_length(answer) <= 500)
);

create index flashcards_set_id_creation_type_idx on public.flashcards(set_id, creation_type);
create index flashcards_set_id_is_deleted_idx on public.flashcards(set_id, is_deleted);

-- Create function for flashcards limit check
create or replace function public.check_flashcards_limit()
returns trigger as $$
begin
    if (select count(*) from public.flashcards where set_id = new.set_id and is_deleted = false) >= 30 then
        raise exception 'Maximum limit of 30 flashcards per set has been reached';
    end if;
    return new;
end;
$$ language plpgsql;

-- Create trigger for flashcards limit
create trigger enforce_flashcards_limit
    before insert on public.flashcards
    for each row execute function public.check_flashcards_limit();

-- Create function for updating flashcard counts
create or replace function public.update_flashcard_counts()
returns trigger as $$
begin
    if tg_op = 'insert' then
        update public.flashcard_sets
        set
            ai_generated_count = case when new.creation_type = 'ai_generated' then coalesce(ai_generated_count, 0) + 1 else ai_generated_count end,
            ai_edited_count = case when new.creation_type = 'ai_edited' then coalesce(ai_edited_count, 0) + 1 else ai_edited_count end,
            manual_count = case when new.creation_type = 'manual' then coalesce(manual_count, 0) + 1 else manual_count end,
            updated_at = now()
        where id = new.set_id;
    elsif tg_op = 'update' then
        if new.is_deleted <> old.is_deleted then
            update public.flashcard_sets
            set
                ai_generated_count = case
                    when old.creation_type = 'ai_generated' then coalesce(ai_generated_count, 0) - 1
                    else ai_generated_count end,
                ai_edited_count = case
                    when old.creation_type = 'ai_edited' then coalesce(ai_edited_count, 0) - 1
                    else ai_edited_count end,
                manual_count = case
                    when old.creation_type = 'manual' then coalesce(manual_count, 0) - 1
                    else manual_count end,
                updated_at = now()
            where id = new.set_id;
        end if;
    end if;
    return new;
end;
$$ language plpgsql;

-- Create trigger for updating flashcard counts
create trigger update_flashcard_set_counts
    after insert or update on public.flashcards
    for each row execute function public.update_flashcard_counts();

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.flashcard_sets enable row level security;
alter table public.flashcards enable row level security;

-- RLS Policies for users table
create policy users_select on public.users
    for select using (auth.uid() = id);

create policy users_update on public.users
    for update using (auth.uid() = id);

-- RLS Policies for flashcard_sets table
create policy flashcard_sets_select on public.flashcard_sets
    for select using (auth.uid() = user_id);

create policy flashcard_sets_insert on public.flashcard_sets
    for insert with check (auth.uid() = user_id);

create policy flashcard_sets_update on public.flashcard_sets
    for update using (auth.uid() = user_id);

-- RLS Policies for flashcards table
create policy flashcards_select on public.flashcards
    for select using (
        exists (
            select 1 from public.flashcard_sets
            where id = flashcards.set_id
            and user_id = auth.uid()
        )
    );

create policy flashcards_insert on public.flashcards
    for insert with check (
        exists (
            select 1 from public.flashcard_sets
            where id = flashcards.set_id
            and user_id = auth.uid()
        )
    );

create policy flashcards_update on public.flashcards
    for update using (
        exists (
            select 1 from public.flashcard_sets
            where id = flashcards.set_id
            and user_id = auth.uid()
        )
    );

-- Add comments
comment on table public.users is 'Extends auth.users with additional user profile data';
comment on table public.flashcard_sets is 'Collection of flashcards created by users';
comment on table public.flashcards is 'Individual flashcards containing questions and answers';
comment on column public.flashcard_sets.generation_duration is 'Duration in seconds taken to generate the flashcard set';
comment on column public.flashcard_sets.ai_generated_count is 'Number of AI-generated flashcards in the set';
comment on column public.flashcard_sets.ai_accepted_count is 'Number of AI-generated flashcards accepted by the user';
comment on column public.flashcard_sets.ai_edited_count is 'Number of AI-generated flashcards edited by the user';
comment on column public.flashcard_sets.manual_count is 'Number of manually created flashcards in the set';