/**
 * "This visitor has already given their email" — read by the Framer site
 * (nomadsmarketing.co) so quiz popups stop showing to people who opted in.
 *
 * Set when the opt-in form is submitted with an email. It's a cookie, not
 * localStorage, because only a cookie on .nomadsmarketing.co is readable from
 * both diagnostic.nomadsmarketing.co (this quiz) and nomadsmarketing.co
 * (Framer). It holds no personal data — just "1".
 *
 * Per browser/device: another device or a cleared browser won't have it.
 * Safari / iOS browsers (WebKit ITP) and Brave keep cookies written by page
 * scripts for 7 days at most, so the same cookie is also set by the server
 * (api/email-given.js), which isn't capped that way. Framer must only READ
 * it: rewriting it with document.cookie would bring the 7-day cap back.
 */
export const EMAIL_GIVEN_COOKIE = 'nomads_email_given';
export const MAX_AGE_DAYS = 365;
const SITE_DOMAIN = 'nomadsmarketing.co';

/** The Set-Cookie string for this address (shared domain only on our site). */
export function emailGivenCookie({ hostname, protocol }) {
  const parts = [
    `${EMAIL_GIVEN_COOKIE}=1`,
    'path=/',
    `max-age=${MAX_AGE_DAYS * 24 * 60 * 60}`,
    'SameSite=Lax',
  ];
  const host = String(hostname || '').toLowerCase();
  // nomads-quiz.vercel.app / localhost: a cookie for this host only (a
  // .nomadsmarketing.co domain there would be rejected by the browser).
  if (host === SITE_DOMAIN || host.endsWith('.' + SITE_DOMAIN)) {
    parts.push('domain=.' + SITE_DOMAIN);
  }
  if (protocol === 'https:') parts.push('Secure');
  return parts.join('; ');
}

export const SERVER_ENDPOINT = '/api/email-given';

/** True when this browser already has the cookie. Never throws. */
export function hasEmailGivenCookie(doc = typeof document !== 'undefined' ? document : null) {
  try {
    return new RegExp(`(?:^|;\\s*)${EMAIL_GIVEN_COOKIE}=1(?:;|$)`).test(String(doc?.cookie ?? ''));
  } catch {
    return false;
  }
}

/**
 * Writes the cookie now, and asks the server to set the same cookie (the
 * long-lasting copy on Safari/iOS). Never throws, never waits; false when the
 * immediate cookie couldn't be written.
 */
export function markEmailGiven({
  doc = typeof document !== 'undefined' ? document : null,
  loc = typeof window !== 'undefined' ? window.location : null,
  fetchImpl = typeof fetch === 'function' ? fetch : null,
} = {}) {
  if (!doc || !loc) return false;
  let written = false;
  try {
    doc.cookie = emailGivenCookie({ hostname: loc.hostname, protocol: loc.protocol });
    written = true;
  } catch {
    /* cookies blocked: the quiz carries on as before */
  }
  if (fetchImpl) {
    try {
      Promise.resolve(
        fetchImpl(SERVER_ENDPOINT, { method: 'POST', keepalive: true, credentials: 'same-origin' })
      ).catch(() => {});
    } catch {
      /* no network: the immediate cookie still applies */
    }
  }
  return written;
}
