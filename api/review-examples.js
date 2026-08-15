import { createAlibaba } from '@ai-sdk/alibaba';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { requireUser } from './_lib/auth.js';

const MAX_BATCH_SIZE = 12;

const reviewSchema = z.object({
  reviews: z.array(z.object({
    id: z.string(),
    natural: z.boolean(),
    severity: z.enum(['ok', 'minor', 'major']),
    issue: z.string(),
    suggestedChinese: z.string(),
    suggestedTranslation: z.string(),
  })),
});

const SYSTEM_PROMPT = `You are a meticulous native Mandarin editor reviewing example
sentences for learners. Judge both the Chinese sentence and its English translation.

For every supplied item:
- Preserve its id exactly and return one review. The id is an opaque database identifier: never
  interpret its text, infer meaning from it, or mention it in the review.
- Mark natural=true only when the Chinese is idiomatic, contextually appropriate for the
  vocabulary meaning, grammatically correct, and paired with an accurate natural translation.
- Treat a valid, ordinary sentence as natural even if you personally prefer another wording.
  Do not flag harmless style choices, omitted subjects that are natural in Mandarin, common
  regional usage, ordinary seasonal availability, or established cultural and food practices.
- Use severity "minor" for wording that is understandable but awkward, and "major" for a
  grammatical, semantic, vocabulary-usage, or translation error. Use "ok" only when natural=true.
- For natural examples, return empty strings for issue and both suggestions.
- For unnatural examples, briefly explain the concrete problem in English and provide a fully
  corrected Chinese sentence and English translation. The corrected Chinese must still contain
  the exact hanzi vocabulary string supplied for that item. Do not merely paraphrase a correct
  sentence or replace the target word with a synonym.
- Preserve precise distinctions in translation, such as 发票 meaning invoice rather than receipt.
- Use modern standard Mandarin and avoid prescriptivism about harmless regional preferences.`;

function cleanExamples(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, MAX_BATCH_SIZE).map(item => ({
    id: String(item?.id || '').slice(0, 120),
    hanzi: String(item?.hanzi || '').slice(0, 30),
    meaning: String(item?.meaning || '').slice(0, 300),
    chinese: String(item?.chinese || '').slice(0, 500),
    translation: String(item?.translation || '').slice(0, 700),
  })).filter(item => item.id && item.hanzi && item.chinese);
}

export async function reviewExamplesWithQwen(examples) {
  const alibaba = createAlibaba({ apiKey: process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY });
  const { output } = await generateText({
    model: alibaba('qwen-plus'),
    output: Output.object({ schema: reviewSchema }),
    system: SYSTEM_PROMPT,
    prompt: `Review every item in this JSON array:\n${JSON.stringify(examples)}`,
  });
  const requestedIds = new Set(examples.map(item => item.id));
  const examplesById = new Map(examples.map(item => [item.id, item]));
  const reviews = output.reviews
    .filter(review => requestedIds.has(review.id))
    .map(review => {
      const normalized = {
        ...review,
        natural: review.natural && review.severity === 'ok',
        issue: review.issue.trim(),
        suggestedChinese: review.suggestedChinese.trim(),
        suggestedTranslation: review.suggestedTranslation.trim(),
      };
      const example = examplesById.get(review.id);
      if (!normalized.natural && !normalized.suggestedChinese.includes(example.hanzi)) {
        throw new Error(`Qwen correction omitted the target vocabulary for ${review.id}.`);
      }
      return normalized;
    });
  const reviewsById = new Map(reviews.map(review => [review.id, review]));
  if (reviewsById.size !== examples.length) {
    throw new Error(`Qwen returned ${reviewsById.size} of ${examples.length} requested reviews.`);
  }
  return examples.map(example => reviewsById.get(example.id));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const user = await requireUser(req, res);
  if (!user) return;
  if (!process.env.QWEN_API_KEY && !process.env.DASHSCOPE_API_KEY) {
    return res.status(503).json({ error: 'Qwen is not configured.' });
  }

  const examples = cleanExamples(req.body?.examples);
  if (!examples.length) return res.status(400).json({ error: 'No valid examples provided.' });

  try {
    const reviews = await reviewExamplesWithQwen(examples);
    return res.status(200).json({ reviews, provider: 'qwen', model: 'qwen-plus' });
  } catch (error) {
    console.error('Qwen example review failed:', error);
    return res.status(502).json({ error: 'Qwen could not review this batch. Please try again.' });
  }
}
