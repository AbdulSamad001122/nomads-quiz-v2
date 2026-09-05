/**
 * Client-side Kit push — dev/prod separation:
 *
 *  - PROD build (Vercel):        POSTs to /api/kit-subscribe → real Kit push.
 *  - DEV (`npm run dev`):        NO network call. The full payload is printed
 *                                to the console ("[kit] DEV …") so the data
 *                                pipeline can be verified without creating
 *                                subscribers in the client's Kit account.
 *  - DEV with VITE_KIT_DEV=true: pushes for real even in dev (needs
 *                                `vercel dev` so /api exists) — only for
 *                                deliberate end-to-end tests.
 *
 * Fire-and-forget: a Kit failure must never block the quiz taker from
 * reaching their results, so errors are logged and swallowed.
 */

const ENABLED =
  import.meta.env.PROD || import.meta.env.VITE_KIT_DEV === 'true';

export async function pushToKit({ email, firstName, fields }) {
  const payload = { email, first_name: firstName, fields };

  if (!ENABLED) {
    console.info('[kit] DEV — push skipped, payload would be:', payload);
    return { ok: true, dev: true };
  }

  try {
    const res = await fetch('/api/kit-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
    return body;
  } catch (err) {
    console.warn('[kit] push failed (quiz continues):', err.message);
    return { ok: false, error: err.message };
  }
}
