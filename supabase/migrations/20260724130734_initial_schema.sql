-- Hanzika — initial schema (Phase 1 of DEPLOYMENT_PLAN.md)
-- Translates the current localStorage-backed `Store`/`HSKProgress` shapes into real
-- Postgres tables, using Supabase's built-in `auth.users` for identity (no custom
-- password/user table — Supabase Auth already handles hashing, sessions, etc.).

-- ---------------------------------------------------------------------------
-- profiles — app-specific fields for a user, 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  sessions_completed integer not null default 0,
  last_studied_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- vocab_words — shared HSK content (owner_id null) + user-owned custom words
-- today: seedWord()/addVocab() entries in the client-side vocab array
-- ---------------------------------------------------------------------------
create table public.vocab_words (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade, -- null = shared HSK content
  chars text[] not null,
  pinyin jsonb not null,               -- [[syllable, tone], ...] — matches word.pinyin today
  meaning text not null,
  source text not null check (source in ('hsk','custom')),
  hsk_level integer,
  hsk_chapter integer,
  tags text[] not null default '{}',
  examples jsonb not null default '[]', -- [{zh, en}, ...]
  image_url text,
  created_at timestamptz not null default now()
);

create index vocab_words_owner_idx on public.vocab_words (owner_id);
create index vocab_words_source_idx on public.vocab_words (source, hsk_level, hsk_chapter);

alter table public.vocab_words enable row level security;

create policy "vocab_words: read shared or own" on public.vocab_words
  for select using (owner_id is null or owner_id = auth.uid());
create policy "vocab_words: insert own custom words" on public.vocab_words
  for insert with check (owner_id = auth.uid() and source = 'custom');
create policy "vocab_words: update own custom words" on public.vocab_words
  for update using (owner_id = auth.uid() and source = 'custom');
create policy "vocab_words: delete own custom words" on public.vocab_words
  for delete using (owner_id = auth.uid() and source = 'custom');

-- ---------------------------------------------------------------------------
-- vocab_stats — per-user progress on a word (today: word.stats on the client)
-- ---------------------------------------------------------------------------
create table public.vocab_stats (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id uuid not null references public.vocab_words(id) on delete cascade,
  box integer not null default 0,
  seen integer not null default 0,
  correct integer not null default 0,
  streak integer not null default 0,
  due_at timestamptz,
  last_reviewed_at timestamptz,
  added_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

create index vocab_stats_due_idx on public.vocab_stats (user_id, due_at);

alter table public.vocab_stats enable row level security;

create policy "vocab_stats: all own rows" on public.vocab_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- review_log — one row per flashcard review (today: reviewLogByUser[] in Store)
-- powers the "Review activity" this-month/quarter/lifetime accuracy windows
-- ---------------------------------------------------------------------------
create table public.review_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id uuid references public.vocab_words(id) on delete set null,
  ts timestamptz not null default now(),
  knew boolean not null
);

create index review_log_user_ts_idx on public.review_log (user_id, ts desc);

alter table public.review_log enable row level security;

create policy "review_log: all own rows" on public.review_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- activities — flattened completion log (today: completionByUser[day].activities[])
-- powers the streak calendar, the activity detail modal, and "Work on next"
-- ---------------------------------------------------------------------------
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ts timestamptz not null default now(),
  activity_date date not null,          -- derived from ts in the user's local date, set by the app
  kind text not null default 'study',   -- 'study' | 'hsk'
  mode text not null default 'study',   -- 'flashcard' | 'translate' | 'write' | 'hsk-practice' | 'hsk-test'
  mode_label text not null default 'Study round',
  scope_label text not null default 'All vocabulary',
  item_count integer not null default 0,
  unit text not null default 'words' check (unit in ('words','questions')),
  correct integer not null default 0,
  incorrect integer not null default 0,
  accuracy integer
);

create index activities_user_date_idx on public.activities (user_id, activity_date);

alter table public.activities enable row level security;

create policy "activities: all own rows" on public.activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- hsk_progress — question-level attempts (today: HSKProgress.chapter(id).questions)
-- ---------------------------------------------------------------------------
create table public.hsk_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  question_id text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  skill text,
  primary key (user_id, chapter_id, question_id)
);

create index hsk_progress_chapter_idx on public.hsk_progress (user_id, chapter_id);

alter table public.hsk_progress enable row level security;

create policy "hsk_progress: all own rows" on public.hsk_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- hsk_test_scores — per-test best score (today: HSKProgress.chapter(id).testScores)
-- ---------------------------------------------------------------------------
create table public.hsk_test_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  test_id text not null,
  best_score integer not null default 0,
  attempts integer not null default 0,
  primary key (user_id, chapter_id, test_id)
);

alter table public.hsk_test_scores enable row level security;

create policy "hsk_test_scores: all own rows" on public.hsk_test_scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notes for Phase 1 follow-up (not done in this migration):
--   - Seed public.vocab_words with the existing HSK curriculum content
--     (hanzika_hsk_data.js / hanzika_hsk_study_data.js) via a separate seed script.
--   - hsk_progress/hsk_test_scores use text ids (chapter_id/question_id/test_id)
--     matching the client's current string ids; revisit if curriculum content
--     moves into the database with its own real primary keys later.
-- ---------------------------------------------------------------------------
