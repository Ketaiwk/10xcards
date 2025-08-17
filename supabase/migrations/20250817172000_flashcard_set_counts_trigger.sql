-- Supabase migration: trigger aktualizujący liczniki fiszek w zestawie
-- Aktualizuje ai_generated_count, ai_edited_count, manual_count po każdej zmianie w tabeli flashcards

create or replace function update_flashcard_set_counts() returns trigger as $$
begin
  update flashcard_sets
  set
    ai_generated_count = (select count(*) from flashcards where set_id = NEW.set_id and creation_type = 'ai_generated' and (is_deleted is null or is_deleted = false)),
    ai_edited_count    = (select count(*) from flashcards where set_id = NEW.set_id and creation_type = 'ai_edited' and (is_deleted is null or is_deleted = false)),
    manual_count       = (select count(*) from flashcards where set_id = NEW.set_id and creation_type = 'manual' and (is_deleted is null or is_deleted = false))
  where id = NEW.set_id;
  return null;
end;
$$ language plpgsql;

-- Trigger na insert/update/delete w tabeli flashcards
create trigger flashcard_set_counts_update
  after insert or update or delete on flashcards
  for each row execute procedure update_flashcard_set_counts();
