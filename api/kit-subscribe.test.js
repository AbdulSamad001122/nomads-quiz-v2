/**
 * Serverless handler validation — run with:  node api/kit-subscribe.test.js
 * Mocks the Kit API (no network) and asserts the handler's behavior:
 * method guard, env guard, email guard, tag find-or-create, subscribe call
 * shape, and error propagation.
 */
import assert from 'node:assert';
import handler from './kit-subscribe.js';

let passed = 0;
const ok = (cond, label) => {
  assert.ok(cond, label);
  passed += 1;
};

function fakeRes() {
  const r = { statusCode: null, body: null };
  r.status = (c) => ((r.statusCode = c), r);
  r.json = (b) => ((r.body = b), r);
  return r;
}

const run = (req) => {
  const res = fakeRes();
  return Promise.resolve(handler(req, res)).then(() => res);
};

/* ---------- guards ---------- */
delete process.env.KIT_API_KEY;
delete process.env.KIT_API_SECRET;

let res = await run({ method: 'GET' });
ok(res.statusCode === 405, '405 on GET');

res = await run({ method: 'POST', body: { email: 'a@b.com' } });
ok(res.statusCode === 500, '500 without credentials');

process.env.KIT_API_KEY = 'test-key';
process.env.KIT_API_SECRET = 'test-secret';

res = await run({ method: 'POST', body: { email: 'not-an-email' } });
ok(res.statusCode === 400, '400 on bad email');

/* ---------- happy path via tag entry (mocked Kit) ---------- */
const calls = [];
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url, options });
  const json = (data) => ({ ok: true, json: async () => data });
  if (url.includes('/tags?') && (!options.method || options.method === 'GET'))
    return json({ tags: [{ id: 777, name: 'crpv-quiz' }] });
  if (url.includes('/subscribe'))
    return json({ subscription: { subscriber: { id: 12345 } } });
  return { ok: false, status: 404, json: async () => ({ message: 'nope' }) };
};

res = await run({
  method: 'POST',
  body: {
    email: 'test@example.com',
    first_name: 'Test',
    fields: { quiz_taker_role: 'Founder or Managing Partner', current_rpv: 2.25 },
  },
});

ok(res.statusCode === 200, '200 on success');
ok(res.body.subscriber_id === 12345, 'subscriber id returned');
ok(calls[0].url.includes('/tags?api_secret=test-secret'), 'lists tags with secret');
ok(calls[1].url === 'https://api.convertkit.com/v3/tags/777/subscribe', 'subscribes via found tag');

const sent = JSON.parse(calls[1].options.body);
ok(sent.api_key === 'test-key', 'subscribe uses api key');
ok(sent.email === 'test@example.com', 'email forwarded');
ok(sent.first_name === 'Test', 'first name forwarded');
ok(sent.fields.current_rpv === 2.25, 'fields forwarded');

/* ---------- tag cached on second call (no extra tag lookup) ---------- */
const before = calls.length;
await run({ method: 'POST', body: { email: 'x@y.com' } });
ok(calls.length === before + 1, 'tag id cached — only the subscribe call fires');

/* ---------- Kit error propagates as 502 ---------- */
globalThis.fetch = async () => ({
  ok: false,
  status: 401,
  json: async () => ({ message: 'Authorization Failed' }),
});
// new module state isn't reset (tag cached), so the subscribe call itself fails
res = await run({ method: 'POST', body: { email: 'x@y.com' } });
ok(res.statusCode === 502, '502 when Kit rejects');
ok(res.body.error === 'Authorization Failed', 'Kit error message surfaced');

console.log(`\nkit-subscribe handler: all ${passed} checks passed ✓`);
