// Cheap presence check — no external API calls, just reports which providers
// have a key configured. The frontend (initAssistantChat -> checkStatus) only
// needs to know whether to show the panel as ready or unavailable.
export default function handler(req, res) {
  const qwen = Boolean(process.env.QWEN_API_KEY);
  const gemini = Boolean(process.env.GEMINI_API_KEY);
  res.status(200).json({
    qwen,
    gemini,
    qwenChatModel: qwen ? 'qwen-plus' : undefined,
    geminiChatModel: gemini ? 'gemini-3.1-flash-lite' : undefined,
  });
}
