/**
 * Vercel serverless function — pushes a finished quiz-taker into Kit.
 *
 * The Kit credentials are SECRETS and live only in Vercel environment
 * variables (Settings → Environment Variables), never in the repo:
 *   KIT_API_KEY     (required) — Kit v3 API key
 *   KIT_API_SECRET  (required) — Kit v3 API secret
 *   KIT_FORM_ID     (optional) — subscribe through this form if set
 *   KIT_TAG_NAME    (optional) — else subscribe through this tag
 *                                 (created on first use; default "crpv-quiz")
 *
 * Kit v3 needs an entry point (form/tag/sequence) to create a subscriber.
 * If no KIT_FORM_ID is configured we find-or-create the entry tag once and
 * cache its id for the lifetime of the lambda.
 *
 * POST body: { email, first_name, fields: { quiz_taker_*, current_rpv, … } }
 */

const KIT_API = 'https://api.convertkit.com/v3';

let cachedTagId = null;

async function kitJson(url, options) {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = body && body.message ? body.message : `Kit ${res.status}`;
    throw new Error(message);
  }
  return body;
}

async function resolveEntryTagId(apiSecret, tagName) {
  if (cachedTagId) return cachedTagId;

  const list = await kitJson(
    `${KIT_API}/tags?api_secret=${encodeURIComponent(apiSecret)}`,
    { method: 'GET' }
  );
  const existing = (list.tags || []).find(
    (t) => t.name.toLowerCase() === tagName.toLowerCase()
  );
  if (existing) {
    cachedTagId = existing.id;
    return cachedTagId;
  }

  const created = await kitJson(`${KIT_API}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_secret: apiSecret, tag: { name: tagName } }),
  });
  cachedTagId = created.id || (created.tag && created.tag.id);
  return cachedTagId;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }

  const apiKey = process.env.KIT_API_KEY;
  const apiSecret = process.env.KIT_API_SECRET;
  if (!apiKey || !apiSecret) {
    res.status(500).json({ error: 'Kit credentials not configured' });
    return;
  }

  const { email, first_name: firstName, fields } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'valid email required' });
    return;
  }

  const subscription = {
    api_key: apiKey,
    email,
    first_name: firstName || undefined,
    fields: fields && typeof fields === 'object' ? fields : undefined,
  };

  try {
    let endpoint;
    if (process.env.KIT_FORM_ID) {
      endpoint = `${KIT_API}/forms/${process.env.KIT_FORM_ID}/subscribe`;
    } else {
      const tagId = await resolveEntryTagId(
        apiSecret,
        process.env.KIT_TAG_NAME || 'crpv-quiz'
      );
      endpoint = `${KIT_API}/tags/${tagId}/subscribe`;
    }

    const out = await kitJson(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    res.status(200).json({
      ok: true,
      subscriber_id: out.subscription?.subscriber?.id ?? null,
    });
  } catch (err) {
    console.error('kit-subscribe failed:', err.message);
    res.status(502).json({ error: err.message });
  }
}
