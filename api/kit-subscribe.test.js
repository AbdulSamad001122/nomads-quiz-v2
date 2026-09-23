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

/* ---------- extra TAGS by name (Sep 23: capped-state tag) ---------- */
const tagCalls = [];
globalThis.fetch = async (url, options = {}) => {
  tagCalls.push({ url, options });
  const json = (data) => ({ ok: true, json: async () => data });
  if (url.includes('/tags?') && (!options.method || options.method === 'GET'))
    return json({ tags: [{ id: 777, name: 'crpv-quiz' }, { id: 888, name: 'Quiz Taker Capped State' }] });
  if (url.includes('/subscribe'))
    return json({ subscription: { subscriber: { id: 555 } } });
  return { ok: false, status: 404, json: async () => ({ message: 'nope' }) };
};

res = await run({
  method: 'POST',
  body: { email: 'capped@example.com', tags: ['Quiz Taker Capped State'] },
});
ok(res.statusCode === 200, 'tags: 200 on success');
ok(
  res.body.tags_applied.length === 1 && res.body.tags_applied[0] === 'Quiz Taker Capped State',
  'tags: capped tag reported applied'
);
const tagSub = tagCalls.find((c) => c.url.endsWith('/tags/888/subscribe'));
ok(!!tagSub, 'tags: subscribed to the capped tag by resolved id');
{
  const body = JSON.parse(tagSub.options.body);
  ok(body.api_key === 'test-key' && body.email === 'capped@example.com', 'tags: subscribe body is api_key + email only');
}
ok(
  tagCalls.findIndex((c) => c.url.endsWith('/tags/777/subscribe')) <
    tagCalls.indexOf(tagSub),
  'tags: main subscribe happens BEFORE the tag'
);

/* tag failure must not fail the request (subscriber already created) */
globalThis.fetch = async (url, options = {}) => {
  const json = (data) => ({ ok: true, json: async () => data });
  if (url.endsWith('/tags/888/subscribe'))
    return { ok: false, status: 500, json: async () => ({ message: 'tag boom' }) };
  if (url.includes('/subscribe'))
    return json({ subscription: { subscriber: { id: 556 } } });
  return json({ tags: [] });
};
res = await run({
  method: 'POST',
  body: { email: 'capped2@example.com', tags: ['Quiz Taker Capped State'] },
});
ok(res.statusCode === 200, 'tags: tag failure still returns 200');
ok(res.body.subscriber_id === 556, 'tags: subscriber still created on tag failure');
ok(res.body.tags_applied.length === 0, 'tags: failed tag not reported applied');

/* garbage tags input must not crash */
res = await run({ method: 'POST', body: { email: 'g@example.com', tags: 'garbage' } });
ok(res.statusCode === 200 && res.body.tags_applied.length === 0, 'tags: non-array ignored');
res = await run({ method: 'POST', body: { email: 'g2@example.com', tags: [null, 42, '   '] } });
ok(res.statusCode === 200 && res.body.tags_applied.length === 0, 'tags: junk entries filtered');

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
