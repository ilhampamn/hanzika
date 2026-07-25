-- Distinguishes *why* a flashcard review was marked wrong: forgetting the
-- character/meaning entirely ("word") vs recognizing it but misremembering
-- the tone ("tone"). Lets Store.reviewVocab apply a lighter SRS penalty for
-- tone-only misses, since character recall is intact.
alter table public.review_log
  add column miss_reason text check (miss_reason in ('word','tone'));
