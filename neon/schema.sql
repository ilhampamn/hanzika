-- Hanzika schema for Neon Postgres.
-- Run with: npm run db:migrate

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  name text not null default '',
  created_at timestamptz not null default now()
);
create unique index if not exists users_email_lower_idx on users (lower(email));

create table if not exists sessions (
  token_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_user_idx on sessions (user_id);
create index if not exists sessions_expires_idx on sessions (expires_at);

create table if not exists profiles (
  id uuid primary key references users(id) on delete cascade,
  name text not null default '',
  sessions_completed integer not null default 0,
  last_studied_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists vocab_words (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id) on delete cascade,
  chars text[] not null,
  pinyin jsonb not null,
  meaning text not null,
  source text not null check (source in ('hsk','custom')),
  hsk_level integer,
  hsk_chapter integer,
  tags text[] not null default '{}',
  examples jsonb not null default '[]',
  image_url text,
  image_provider text,
  image_source text,
  image_credit text,
  image_credit_url text,
  created_at timestamptz not null default now()
);
alter table vocab_words add column if not exists image_provider text;
alter table vocab_words add column if not exists image_source text;
alter table vocab_words add column if not exists image_credit text;
alter table vocab_words add column if not exists image_credit_url text;
create index if not exists vocab_words_owner_idx on vocab_words (owner_id);
create index if not exists vocab_words_source_idx on vocab_words (source, hsk_level, hsk_chapter);

create table if not exists vocab_stats (
  user_id uuid not null references users(id) on delete cascade,
  word_id uuid not null references vocab_words(id) on delete cascade,
  box integer not null default 0,
  seen integer not null default 0,
  correct integer not null default 0,
  streak integer not null default 0,
  due_at timestamptz,
  last_reviewed_at timestamptz,
  added_at timestamptz not null default now(),
  primary key (user_id, word_id)
);
create index if not exists vocab_stats_due_idx on vocab_stats (user_id, due_at);

create table if not exists review_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references users(id) on delete cascade,
  word_id uuid references vocab_words(id) on delete set null,
  ts timestamptz not null default now(),
  knew boolean not null,
  miss_reason text check (miss_reason in ('word','tone'))
);
create index if not exists review_log_user_ts_idx on review_log (user_id, ts desc);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  ts timestamptz not null default now(),
  activity_date date not null,
  kind text not null default 'study',
  mode text not null default 'study',
  mode_label text not null default 'Study round',
  scope_label text not null default 'All vocabulary',
  item_count integer not null default 0,
  unit text not null default 'words' check (unit in ('words','questions')),
  correct integer not null default 0,
  incorrect integer not null default 0,
  accuracy integer
);
create index if not exists activities_user_date_idx on activities (user_id, activity_date);

create table if not exists hsk_progress (
  user_id uuid not null references users(id) on delete cascade,
  chapter_id text not null,
  question_id text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  skill text,
  primary key (user_id, chapter_id, question_id)
);
create index if not exists hsk_progress_chapter_idx on hsk_progress (user_id, chapter_id);

create table if not exists hsk_test_scores (
  user_id uuid not null references users(id) on delete cascade,
  chapter_id text not null,
  test_id text not null,
  best_score integer not null default 0,
  attempts integer not null default 0,
  primary key (user_id, chapter_id, test_id)
);

create table if not exists hsk_chapter_state (
  user_id uuid not null references users(id) on delete cascade,
  chapter_id text not null,
  material_read boolean not null default false,
  reviews_completed integer not null default 0,
  primary key (user_id, chapter_id)
);
