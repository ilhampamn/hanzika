import { requireUser } from './_lib/auth.js';
import { db } from './_lib/db.js';

const asArray = value => Array.isArray(value) ? value : [];
const asInt = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;
const asText = (value, max = 200) => String(value ?? '').slice(0, max);

async function bootstrap(userId) {
  const sql = db();
  const [profiles, words, stats, reviewLog, activities] = await Promise.all([
    sql`select * from profiles where id = ${userId} limit 1`,
    sql`select * from vocab_words where owner_id is null or owner_id = ${userId} order by created_at desc`,
    sql`select * from vocab_stats where user_id = ${userId}`,
    sql`select ts, knew, miss_reason from review_log where user_id = ${userId} order by ts asc`,
    sql`select * from activities where user_id = ${userId} order by ts asc`,
  ]);
  return { profile: profiles[0], words, stats, reviewLog, activities };
}
async function loadHsk(userId) {
  const sql = db();
  const [progress, testScores, chapterState] = await Promise.all([
    sql`select * from hsk_progress where user_id = ${userId}`,
    sql`select * from hsk_test_scores where user_id = ${userId}`,
    sql`select * from hsk_chapter_state where user_id = ${userId}`,
  ]);
  return { progress, testScores, chapterState };
}

async function mutate(userId, action, payload) {
  const sql = db();
  if (action === 'add-vocab') {
    await sql`insert into vocab_words
      (id, owner_id, chars, pinyin, meaning, source, hsk_level, tags, examples, image_url,
        image_provider, image_source, image_credit, image_credit_url)
      values (${payload.id}, ${userId}, ${asArray(payload.chars)}, ${JSON.stringify(asArray(payload.pinyin))}::jsonb,
        ${asText(payload.meaning, 500)}, 'custom', ${payload.hskLevel ?? null}, ${asArray(payload.tags)},
        ${JSON.stringify(asArray(payload.examples))}::jsonb, ${payload.imageUrl || null},
        ${asText(payload.imageProvider, 50) || null}, ${asText(payload.imageSource, 1000) || null},
        ${asText(payload.imageCredit, 200) || null}, ${asText(payload.imageCreditUrl, 1000) || null})`;
  } else if (action === 'import-vocab') {
    const rows = asArray(payload.rows).slice(0, 500);
    await Promise.all(rows.map(row => sql`insert into vocab_words
      (id, owner_id, chars, pinyin, meaning, source, hsk_level, tags, examples, image_url,
        image_provider, image_source, image_credit, image_credit_url)
      values (${row.id}, ${userId}, ${asArray(row.chars)}, ${JSON.stringify(asArray(row.pinyin))}::jsonb,
        ${asText(row.meaning, 500)}, 'custom', ${row.hskLevel ?? null}, ${asArray(row.tags)},
        ${JSON.stringify(asArray(row.examples))}::jsonb, ${row.imageUrl || null},
        ${asText(row.imageProvider, 50) || null}, ${asText(row.imageSource, 1000) || null},
        ${asText(row.imageCredit, 200) || null}, ${asText(row.imageCreditUrl, 1000) || null})`));
  } else if (action === 'update-vocab') {
    await sql`update vocab_words set chars = ${asArray(payload.chars)},
      pinyin = ${JSON.stringify(asArray(payload.pinyin))}::jsonb, meaning = ${asText(payload.meaning, 500)},
      hsk_level = ${payload.hskLevel ?? null}, tags = ${asArray(payload.tags)},
      examples = ${JSON.stringify(asArray(payload.examples))}::jsonb, image_url = ${payload.imageUrl || null},
      image_provider = ${asText(payload.imageProvider, 50) || null},
      image_source = ${asText(payload.imageSource, 1000) || null},
      image_credit = ${asText(payload.imageCredit, 200) || null},
      image_credit_url = ${asText(payload.imageCreditUrl, 1000) || null}
      where id = ${payload.id} and owner_id = ${userId} and source = 'custom'`;
  } else if (action === 'delete-vocab') {
    await sql`delete from vocab_words where id = ${payload.id} and owner_id = ${userId} and source = 'custom'`;
  } else if (action === 'review-vocab') {
    await sql`with allowed_word as (
      select id from vocab_words where id = ${payload.id} and (owner_id is null or owner_id = ${userId})
    ), stats_write as (
      insert into vocab_stats (user_id, word_id, box, seen, correct, streak, due_at, last_reviewed_at)
      select ${userId}, id, ${asInt(payload.box)}, ${asInt(payload.seen)}, ${asInt(payload.correct)},
        ${asInt(payload.streak)}, ${payload.dueAt}, ${payload.lastReviewedAt} from allowed_word
      on conflict (user_id, word_id) do update set box = excluded.box, seen = excluded.seen,
        correct = excluded.correct, streak = excluded.streak, due_at = excluded.due_at,
        last_reviewed_at = excluded.last_reviewed_at
      returning word_id
    )
    insert into review_log (user_id, word_id, knew, miss_reason)
    select ${userId}, word_id, ${Boolean(payload.knew)}, ${payload.missReason || null} from stats_write`;
  } else if (action === 'complete-session') {
    await sql`with activity_write as (
      insert into activities (id, user_id, ts, activity_date, kind, mode, mode_label, scope_label,
        item_count, unit, correct, incorrect, accuracy)
      values (${payload.id}, ${userId}, ${payload.ts}, ${payload.activityDate}, ${asText(payload.kind, 30)},
        ${asText(payload.mode, 30)}, ${asText(payload.modeLabel, 80)}, ${asText(payload.scopeLabel, 140)},
        ${asInt(payload.itemCount)}, ${payload.unit === 'questions' ? 'questions' : 'words'},
        ${asInt(payload.correct)}, ${asInt(payload.incorrect)}, ${payload.accuracy ?? null})
      returning 1
    )
    update profiles set sessions_completed = ${asInt(payload.sessionsCompleted)}, last_studied_at = ${payload.ts}
    where id = ${userId}`;
  } else if (action === 'record-hsk') {
    await sql`insert into hsk_progress (user_id, chapter_id, question_id, attempts, correct, skill)
      values (${userId}, ${asText(payload.chapterId, 100)}, ${asText(payload.questionId, 100)},
        ${asInt(payload.attempts)}, ${asInt(payload.correct)}, ${asText(payload.skill, 100)})
      on conflict (user_id, chapter_id, question_id) do update set attempts = excluded.attempts,
        correct = excluded.correct, skill = excluded.skill`;
  } else if (action === 'save-hsk-test') {
    await sql`insert into hsk_test_scores (user_id, chapter_id, test_id, best_score, attempts)
      values (${userId}, ${asText(payload.chapterId, 100)}, ${asText(payload.testId, 100)},
        ${asInt(payload.bestScore)}, ${asInt(payload.attempts)})
      on conflict (user_id, chapter_id, test_id) do update set best_score = excluded.best_score,
        attempts = excluded.attempts`;
  } else if (action === 'save-hsk-state') {
    await sql`insert into hsk_chapter_state (user_id, chapter_id, material_read, reviews_completed)
      values (${userId}, ${asText(payload.chapterId, 100)}, ${Boolean(payload.materialRead)}, ${asInt(payload.reviewsCompleted)})
      on conflict (user_id, chapter_id) do update set material_read = excluded.material_read,
        reviews_completed = excluded.reviews_completed`;
  } else {
    throw Object.assign(new Error('Unknown data action.'), { statusCode: 400 });
  }
}

export default async function handler(req, res) {
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    if (req.method === 'GET') {
      const scope = String(req.query?.scope || 'bootstrap');
      if (scope === 'bootstrap') return res.status(200).json(await bootstrap(user.id));
      if (scope === 'hsk') return res.status(200).json(await loadHsk(user.id));
      return res.status(400).json({ error: 'Unknown data scope.' });
    }
    if (req.method === 'POST') {
      await mutate(user.id, String(req.body?.action || ''), req.body?.payload || {});
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Data API failed:', error);
    return res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Could not save your data.' });
  }
}
