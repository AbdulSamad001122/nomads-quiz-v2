/**
 * Serverless handler validation — run with:  node api/_workshop-progress.test.js
 *   (the leading underscore keeps Vercel from publishing this file as a
 *   function — every other file in api/ becomes a public endpoint)
 * Mocks the Kit API (no network): guards, the sh_kit check, unsubscribed
 * people, tag lookup, the tag call's shape, text/plain bodies, CORS.
 */
import assert from 'node:assert';
import { createHash } from 'node:crypto';
import handler, { tagNameFor } from './workshop-progress.js';

let passed = 0;
const ok = (cond, label) => {
  assert.ok(cond, label);
  passed += 1;
};

function fakeRes() {
  const r = { statusCode: null, body: null, headers: {}, ended: false };
  r.status = (c) => ((r.statusCode = c), r);
  r.json = (b) => ((r.body = b), r);
  r.end = () => ((r.ended = true), r);
  r.setHeader = (k, v) => ((r.headers[k.toLowerCase()] = v), r);
  return r;
}
const run = (req) => {
  const res = fakeRes();
  return Promise.resolve(handler({ headers: {}, ...req }, res)).then(() => res);
};
const sha = (s) => createHash('sha256').update(s).digest('hex');

const EMAIL = 'Viewer@Example.com';
const GOOD = { subscriber_id: '4338103015', sh_kit: sha(EMAIL.toLowerCase()), milestone: 50 };

/* ---------- guards ---------- */
delete process.env.KIT_API_KEY;
delete process.env.KIT_API_SECRET;
let res = await run({ method: 'GET' });
ok(res.statusCode === 405, '405 on GET');
res = await run({ method: 'POST', body: GOOD });
ok(res.statusCode === 500, '500 without credentials');

process.env.KIT_API_KEY = 'test-key';
process.env.KIT_API_SECRET = 'test-secret';

for (const [bad, label] of [
  [{ ...GOOD, milestone: 40 }, 'milestone 40'],
  [{ ...GOOD, milestone: '' }, 'no milestone'],
  [{ ...GOOD, subscriber_id: 'abc' }, 'non-numeric id'],
  [{ ...GOOD, sh_kit: 'short' }, 'bad hash'],
  [{}, 'empty body'],
]) {
  res = await run({ method: 'POST', body: bad });
  ok(res.statusCode === 400, `400 on ${label}`);
}

/* ---------- mocked Kit ---------- */
let calls = [];
let subscriber = { id: 4338103015, email_address: EMAIL.toLowerCase(), state: 'active' };
let tags = [
  { id: 1, name: 'crpv-quiz' },
  // the real tag names + ids Nomads created in Kit (Nov 3)
  { id: 25380510, name: 'Workshop 25%' },
  { id: 25380528, name: 'Workshop 50%' },
  { id: 25380535, name: 'Workshop 75%' },
  { id: 25380551, name: 'Workshop 90+%' },
];
globalThis.fetch = async (url, options = {}) => {
  calls.push({ url, options });
  const json = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
  if (url.includes('/subscribers/4338103015?')) return json({ subscriber });
  if (url.includes('/subscribers/')) return json({ error: 'Not Found', message: 'The subscriber does not exist' }, 404);
  if (url.includes('/tags?')) return json({ tags });
  if (url.includes('/subscribe')) return json({ subscription: { subscriber: { id: subscriber.id } } });
  return json({ message: 'nope' }, 500);
};

/* happy path */
res = await run({ method: 'POST', body: GOOD });
ok(res.statusCode === 200 && res.body.tag === 'Workshop 50%', '200 + 50% tag');
const tagCall = calls.find((c) => c.url.includes('/tags/25380528/subscribe'));
ok(!!tagCall, 'Workshop 50% tag (25380528) subscribe called');
ok(JSON.parse(tagCall.options.body).email === EMAIL.toLowerCase(), 'tag call carries the Kit email');
ok(JSON.parse(tagCall.options.body).api_key === 'test-key', 'tag call uses api_key');
ok(!calls.some((c) => c.url.includes('api_key=test-secret') || (c.options.body || '').includes('test-secret')), 'secret never sent in a tag body');

/* text/plain JSON body (navigator.sendBeacon) */
calls = [];
res = await run({ method: 'POST', body: JSON.stringify({ ...GOOD, milestone: 25 }) });
ok(res.statusCode === 200 && res.body.tag === 'Workshop 25%', 'text/plain body works');

/* hash of the email exactly as Kit stores it also accepted */
subscriber = { ...subscriber, email_address: EMAIL };
res = await run({ method: 'POST', body: { ...GOOD, sh_kit: sha(EMAIL), milestone: 75 } });
ok(res.statusCode === 200, 'hash of the stored email accepted');
subscriber = { ...subscriber, email_address: EMAIL.toLowerCase() };

/* wrong person */
calls = [];
res = await run({ method: 'POST', body: { ...GOOD, sh_kit: sha('someone@else.com') } });
ok(res.statusCode === 403, '403 when sh_kit is not this subscriber');
ok(!calls.some((c) => /\/tags\/\d+\/subscribe/.test(c.url)), 'no tag added for an unverified link');

/* unknown subscriber */
res = await run({ method: 'POST', body: { ...GOOD, subscriber_id: '999' } });
ok(res.statusCode === 404, '404 for an unknown subscriber id');

/* unsubscribed */
calls = [];
subscriber = { ...subscriber, state: 'cancelled' };
res = await run({ method: 'POST', body: GOOD });
ok(res.statusCode === 200 && /cancelled/.test(res.body.skipped), 'unsubscribed person skipped');
ok(!calls.some((c) => /\/tags\/\d+\/subscribe/.test(c.url)), 'no tag for an unsubscribed person');
subscriber = { ...subscriber, state: 'active' };

/* the last milestone is 90% ("Workshop 90+%" = watched 90% and above), not 95% */
calls = [];
res = await run({ method: 'POST', body: { ...GOOD, milestone: 90 } });
ok(res.statusCode === 200 && res.body.tag === 'Workshop 90+%', '90 -> "Workshop 90+%"');
ok(calls.some((c) => c.url.includes('/tags/25380551/subscribe')), 'Workshop 90+% tag (25380551) subscribe called');
res = await run({ method: 'POST', body: { ...GOOD, milestone: 95 } });
ok(res.statusCode === 400, '95 is no longer a milestone (400)');
ok(['Workshop 25%', 'Workshop 50%', 'Workshop 75%', 'Workshop 90+%'].join() === [25, 50, 75, 90].map(tagNameFor).join(), 'default names = Kit names');

/* tag names from Vercel settings; missing tag is never created */
process.env.KIT_WORKSHOP_TAG_90 = 'WS - watched 90';
ok(tagNameFor(90) === 'WS - watched 90', 'tag name from KIT_WORKSHOP_TAG_90');
calls = [];
res = await run({ method: 'POST', body: { ...GOOD, milestone: 90 } });
ok(res.statusCode === 500 && /not found/.test(res.body.error), '500 when the tag is missing in Kit');
ok(!calls.some((c) => c.options.method === 'POST' && /\/tags$/.test(c.url)), 'missing tag is not created');
tags.push({ id: 9090, name: 'WS - watched 90' });
res = await run({ method: 'POST', body: { ...GOOD, milestone: 90 } });
ok(res.statusCode === 200 && res.body.tag === 'WS - watched 90', 'custom tag name used once it exists');
delete process.env.KIT_WORKSHOP_TAG_90;

/* Kit down */
globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({ message: 'Kit is down' }) });
res = await run({ method: 'POST', body: GOOD });
ok(res.statusCode === 502, '502 when Kit fails');

/* CORS */
res = await run({ method: 'OPTIONS', headers: { origin: 'https://nomadsmarketing.co' } });
ok(res.statusCode === 204 && res.headers['access-control-allow-origin'] === 'https://nomadsmarketing.co', 'preflight allowed from nomadsmarketing.co');
res = await run({ method: 'OPTIONS', headers: { origin: 'https://evil.example' } });
ok(!res.headers['access-control-allow-origin'], 'no CORS header for other sites');

console.log(`workshop-progress: all ${passed} checks passed ✓`);
