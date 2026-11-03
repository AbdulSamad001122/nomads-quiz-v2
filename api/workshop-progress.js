/**
 * Vercel serverless function — tags a Kit subscriber with how much of the
 * workshop video they have watched: 25 / 50 / 75 / 95 %.
 *
 * Called by the video on the Framer workshop page (nomadsmarketing.co/workshop,
 * code component "WorkshopVideo" in framer/WorkshopVideo.tsx) each time the
 * viewer passes a milestone. Framer has no server of its own and the Kit API
 * secret must never sit in a web page, so the page asks this helper and the
 * helper talks to Kit.
 *
 * POST body — JSON, or JSON sent as text/plain (navigator.sendBeacon):
 *   { subscriber_id: "1234567", sh_kit: "<64 hex chars>", milestone: 25 }
 *
 * Who the viewer is comes from Kit's own link parameters, ck_subscriber_id and
 * sh_kit (Kit → Settings → Email → Advanced: "Add subscriber_id parameter in
 * email links" + "Automatically append hashed subscriber email to email
 * links"); the quiz results page adds the same two to its workshop links
 * (src/kit/viewerId.js). The tag is only added when sh_kit is the SHA-256 of
 * that subscriber's email in Kit, so a guessed id can't tag someone else.
 * People who unsubscribed are never tagged (a v3 tag subscribe could
 * re-activate them).
 *
 * Environment (Vercel → Settings → Environment Variables):
 *   KIT_API_KEY, KIT_API_SECRET — already set for /api/kit-subscribe
 *   KIT_WORKSHOP_TAG_25 / _50 / _75 / _95 — optional: the tag names Nomads
 *     created in Kit (defaults below). Tags are looked up, never created, so
 *     a typo can't spawn a stray tag.
 */
import { createHash, timingSafeEqual } from 'node:crypto';

const KIT_API = 'https://api.convertkit.com/v3';
export const MILESTONES = [25, 50, 75, 95];
const DEFAULT_TAG = (m) => `Workshop watched ${m}%`;
// Browsers on these sites may read the reply; sendBeacon doesn't need it.
const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?nomadsmarketing\.co$/,
  /^https:\/\/[a-z0-9-]+\.framer\.(app|website)$/,
];

// tag name → id, cached for the lifetime of the lambda
const tagIds = {};

export const tagNameFor = (m) => process.env[`KIT_WORKSHOP_TAG_${m}`] || DEFAULT_TAG(m);

async function kitJson(url, options) {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body && body.message ? body.message : `Kit ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

async function findTagId(apiSecret, name) {
  if (tagIds[name]) return tagIds[name];
  const list = await kitJson(`${KIT_API}/tags?api_secret=${encodeURIComponent(apiSecret)}`, { method: 'GET' });
  const tag = (list.tags || []).find((t) => String(t.name).toLowerCase() === name.toLowerCase());
  if (!tag) return null;
  tagIds[name] = tag.id;
  return tag.id;
}

const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex');

function sameHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function readBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  return body && typeof body === 'object' ? body : {};
}

function allowOrigin(req, res) {
  const origin = req.headers && req.headers.origin;
  if (origin && ALLOWED_ORIGINS.some((re) => re.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

export default async function handler(req, res) {
  allowOrigin(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
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

  const { subscriber_id: rawId, sh_kit: rawHash, milestone: rawMilestone } = readBody(req);
  const id = String(rawId ?? '').trim();
  const hash = String(rawHash ?? '').trim().toLowerCase();
  const milestone = Number(rawMilestone);
  if (!/^\d{1,15}$/.test(id) || !/^[a-f0-9]{64}$/.test(hash) || !MILESTONES.includes(milestone)) {
    res.status(400).json({ error: 'subscriber_id, sh_kit and milestone (25, 50, 75 or 95) required' });
    return;
  }

  try {
    // 1. Who is it? Kit returns their email and whether they're still subscribed.
    let subscriber;
    try {
      const out = await kitJson(`${KIT_API}/subscribers/${id}?api_secret=${encodeURIComponent(apiSecret)}`, { method: 'GET' });
      subscriber = out.subscriber || {};
    } catch (err) {
      if (err.status === 404) {
        res.status(404).json({ error: 'unknown subscriber' });
        return;
      }
      throw err;
    }
    const email = String(subscriber.email_address || '');

    // 2. Is the link really theirs? sh_kit must be the SHA-256 of that email.
    const verified = email && (sameHex(sha256(email), hash) || sameHex(sha256(email.trim().toLowerCase()), hash));
    if (!verified) {
      res.status(403).json({ error: 'link not verified' });
      return;
    }

    // 3. Never touch people who left the list.
    if (subscriber.state && subscriber.state !== 'active') {
      res.status(200).json({ ok: true, skipped: `subscriber is ${subscriber.state}` });
      return;
    }

    // 4. Add the tag (adding a tag twice is harmless).
    const name = tagNameFor(milestone);
    const tagId = await findTagId(apiSecret, name);
    if (!tagId) {
      console.error(`workshop-progress: tag "${name}" not found in Kit`);
      res.status(500).json({ error: `tag "${name}" not found in Kit` });
      return;
    }
    await kitJson(`${KIT_API}/tags/${tagId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    });
    res.status(200).json({ ok: true, tag: name });
  } catch (err) {
    console.error('workshop-progress failed:', err.message);
    res.status(502).json({ error: err.message });
  }
}
