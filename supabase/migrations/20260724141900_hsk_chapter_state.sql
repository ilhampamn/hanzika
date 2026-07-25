-- Adds the two per-chapter fields HSKProgress tracks that have no home in
-- hsk_progress (question-level) or hsk_test_scores (per-test): whether the
-- study material has been marked read, and how many non-test review rounds
-- have been completed. (testsCompleted/bestTest are derivable from
-- hsk_test_scores and don't need their own columns.)
create table public.hsk_chapter_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  material_read boolean not null default false,
  reviews_completed integer not null default 0,
  primary key (user_id, chapter_id)
);

alter table public.hsk_chapter_state enable row level security;

create policy "hsk_chapter_state: all own rows" on public.hsk_chapter_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
