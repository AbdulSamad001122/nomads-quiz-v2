/**
 * Vercel serverless function — sets the "email given" cookie from the server.
 *
 * The quiz already writes nomads_email_given with document.cookie when the
 * opt-in is submitted (src/popups/emailGivenCookie.js). Safari / every iOS
 * browser (WebKit ITP) and Brave cap cookies written by page scripts at 7
 * days, so the Framer site would show popups again a week later. A cookie set
 * by a response from the page's own host isn't capped that way, so the quiz
 * also calls this endpoint (same host: diagnostic.nomadsmarketing.co/api/…,
 * passed through by the landing project).
 *
 * POST only, no body. Sets the cookie only for requests from our own pages
 * (Origin/Referer); the cookie holds no personal data, just "1".
 */
import { emailGivenCookie } from '../src/popups/emailGivenCookie.js';

const ALLOWED = [/(^|\.)nomadsmarketing\.co$/, /^nomads-quiz[a-z0-9-]*\.vercel\.app$/, /^localhost$/];

/** The page that made the request (Origin, else Referer), or null. */
function requestingPage(headers = {}) {
  for (const value of [headers.origin, headers.referer]) {
    if (!value || value === 'null') continue;
    try {
      return new URL(value);
    } catch {
      /* try the next one */
    }
  }
  return null;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const page = requestingPage(req.headers);
  const host = page ? page.hostname.toLowerCase() : '';
  if (!ALLOWED.some((re) => re.test(host))) {
    res.status(403).json({ error: 'unknown origin' });
    return;
  }
  res.setHeader('Set-Cookie', emailGivenCookie({ hostname: host, protocol: page.protocol }));
  res.status(200).json({ ok: true });
}
