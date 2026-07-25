// Vercel Serverless Function backing HskAlibabaAudio's fetch('/api/tts', ...)
// call (see hanzika_18_hover_dictionary_stable.html) — a frontend module that
// already existed, expecting a backend that was never built. Contract: POST
// {provider, text} -> raw audio bytes with a Content-Type: audio/* header
// (the frontend does response.blob(), not response.json()).

const SUPABASE_URL = 'https://vertgsgbmtvopwqtigty.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Wvh11Vb64FxHavrKNtsTew_BCt9nuPl';

async function verifySession(authHeader) {
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return false;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
  });
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const authed = await verifySession(req.headers.authorization);
  if (!authed) return res.status(401).json({ error: 'You need to be signed in to play audio.' });

  const text = String(req.body?.text || '').trim().slice(0, 500);
  if (!text) return res.status(400).json({ error: 'No text provided.' });

  if (!process.env.QWEN_API_KEY) return res.status(503).json({ error: 'Text-to-speech is not configured.' });

  try {
    const genRes = await fetch(
      'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen3-tts-flash',
          input: { text, voice: 'Cherry' },
        }),
      }
    );
    if (!genRes.ok) throw new Error(`Qwen TTS HTTP ${genRes.status}`);
    const genData = await genRes.json();
    const audioUrl = genData.output?.audio?.url;
    if (!audioUrl) throw new Error('Qwen TTS returned no audio URL.');

    // The generation call returns a short-lived signed OSS URL, not the audio
    // itself — fetch it here so the client only ever talks to our own /api/tts.
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) throw new Error(`Fetching generated audio failed (${audioRes.status})`);
    const buffer = Buffer.from(await audioRes.arrayBuffer());

    res.setHeader('Content-Type', audioRes.headers.get('content-type') || 'audio/wav');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(buffer);
  } catch (err) {
    console.error('TTS failed:', err.message);
    res.status(502).json({ error: 'Could not generate audio right now. Please try again.' });
  }
}
