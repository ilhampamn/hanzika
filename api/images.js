import { requireUser } from './_lib/auth.js';

const UTM = 'utm_source=hanzika&utm_medium=referral';

function withUtm(url) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${UTM}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const user = await requireUser(req, res);
  if (!user) return;

  const query = String(req.query?.q || '').trim().slice(0, 120);
  if (!query) return res.status(400).json({ error: 'An image search query is required.' });
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return res.status(503).json({ error: 'Unsplash is not configured.' });
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: '1',
      orientation: 'squarish',
      content_filter: 'high',
    });
    const headers = {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      'Accept-Version': 'v1',
    };
    const searchResponse = await fetch(`https://api.unsplash.com/search/photos?${params}`, { headers });
    if (!searchResponse.ok) throw new Error(`Unsplash search HTTP ${searchResponse.status}`);
    const searchResult = await searchResponse.json();
    const photo = searchResult.results?.[0];
    if (!photo) return res.status(200).json({ image: null });

    const trackingUrl = photo.links?.download_location;
    if (trackingUrl) {
      const trackingResponse = await fetch(trackingUrl, { headers });
      if (!trackingResponse.ok) throw new Error(`Unsplash download tracking HTTP ${trackingResponse.status}`);
    }

    return res.status(200).json({
      image: {
        url: photo.urls?.small || photo.urls?.regular,
        provider: 'Unsplash',
        source: withUtm(photo.links?.html),
        credit: photo.user?.name || photo.user?.username || 'Unsplash photographer',
        creditUrl: withUtm(photo.user?.links?.html),
      },
    });
  } catch (error) {
    console.error('Unsplash image search failed:', error.message);
    return res.status(502).json({ error: 'Unsplash image search failed.' });
  }
}
