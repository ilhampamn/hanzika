// Vercel Serverless Function backing the "Guide" assistant panel. Contract
// (request/response shapes) is dictated by the existing frontend code in
// initAssistantChat() / sendQuestion() — see ASSISTANT_IMPLEMENTATION_PLAN.md.

import { requireUser } from './_lib/auth.js';

const SYSTEM_PROMPT = `You are the in-app learning guide for Hanzika, a Mandarin Chinese
learning app. You help with: Mandarin vocabulary and grammar, hanzi (Chinese characters),
idioms, Chinese traditions, history, literature, food culture, and etiquette.

If the user's question is on that topic, answer it helpfully and concisely.
If it is NOT on that topic, still give a short, polite answer but gently steer the
conversation back toward Mandarin/Chinese-culture topics.

Respond with ONLY a JSON object (no markdown fences, no other text) matching exactly:
{"answer": string, "inScope": boolean, "suggestions": [string, string, string]}

- "answer": your reply, plain text, no markdown formatting.
- "inScope": true if the question was about Mandarin/Chinese culture/language, false otherwise.
- "suggestions": up to 3 short natural follow-up questions the user might ask next. Use fewer
  than 3, or an empty array, if you can't think of good ones — never pad with generic filler.`;

function parseModelJson(text) {
  const trimmed = String(text || '').trim();
  const stripped = trimmed.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(stripped);
  if (typeof parsed.answer !== 'string' || !parsed.answer.trim()) throw new Error('empty answer');
  return {
    answer: parsed.answer.trim(),
    inScope: parsed.inScope !== false,
    suggestions: Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter(s => typeof s === 'string' && s.trim()).slice(0, 3)
      : [],
  };
}

async function callQwen(messages) {
  const apiKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY;
  const res = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`Qwen HTTP ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  return { ...parseModelJson(text), provider: 'qwen', model: 'qwen-plus' };
}

async function callGemini(messages) {
  // Gemini's API has no "system" role — fold the system prompt into the first turn instead.
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('');
  return { ...parseModelJson(text), provider: 'gemini', model: 'gemini-3.1-flash-lite' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const user = await requireUser(req, res);
  if (!user) return;

  const messages = req.body?.messages;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'No messages provided.' });
  }
  const clean = messages
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.trim() }));
  if (!clean.length) return res.status(400).json({ error: 'No valid messages provided.' });

  const hasQwen = Boolean(process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY);
  if (!hasQwen && !process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Assistant is not configured.' });
  }

  let result = null;
  let fallbackUsed = false;
  if (hasQwen) {
    try {
      result = await callQwen(clean);
    } catch (err) {
      console.error('Qwen failed:', err.message);
    }
  }
  if (!result && process.env.GEMINI_API_KEY) {
    try {
      result = await callGemini(clean);
      fallbackUsed = hasQwen;
    } catch (err) {
      console.error('Gemini failed:', err.message);
    }
  }

  if (!result) return res.status(502).json({ error: 'Both providers failed to respond. Please try again.' });

  res.status(200).json({ ...result, fallbackUsed });
}
