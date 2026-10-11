// node --test api/_email-given.test.js
//   (the leading underscore keeps Vercel from publishing this file as a function)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from './email-given.js';
import { emailGivenCookie } from '../src/popups/emailGivenCookie.js';

function fakeRes() {
  const r = { statusCode: null, body: null, headers: {} };
  r.status = (c) => ((r.statusCode = c), r);
  r.json = (b) => ((r.body = b), r);
  r.setHeader = (k, v) => ((r.headers[k.toLowerCase()] = v), r);
  return r;
}
const call = (req) => {
  const res = fakeRes();
  handler(req, res);
  return res;
};
const post = (headers) => call({ method: 'POST', headers });

test('POST only', () => {
  const res = call({ method: 'GET', headers: { origin: 'https://diagnostic.nomadsmarketing.co' } });
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers['set-cookie'], undefined);
});

test('live quiz → shared-domain cookie, same string as the browser writes', () => {
  const res = post({ origin: 'https://diagnostic.nomadsmarketing.co' });
  assert.equal(res.statusCode, 200);
  assert.equal(
    res.headers['set-cookie'],
    emailGivenCookie({ hostname: 'diagnostic.nomadsmarketing.co', protocol: 'https:' })
  );
  assert.ok(res.headers['set-cookie'].includes('domain=.nomadsmarketing.co'));
  assert.ok(!/httponly/i.test(res.headers['set-cookie']), 'Framer must be able to read it');
});

test('falls back to Referer when Origin is missing', () => {
  const res = post({ referer: 'https://diagnostic.nomadsmarketing.co/diagnostic-start-now?popup=97' });
  assert.equal(res.statusCode, 200);
  assert.ok(res.headers['set-cookie'].includes('domain=.nomadsmarketing.co'));
});

test('vercel.app and localhost → host-only cookie', () => {
  for (const origin of ['https://nomads-quiz.vercel.app', 'https://nomads-quiz-git-x-abc.vercel.app', 'http://localhost:5198']) {
    const res = post({ origin });
    assert.equal(res.statusCode, 200, origin);
    assert.ok(!res.headers['set-cookie'].includes('domain='), origin);
  }
});

test('other sites, missing or broken origin → 403, no cookie', () => {
  for (const headers of [
    { origin: 'https://evil.example' },
    { origin: 'https://evilnomadsmarketing.co' },
    { origin: 'https://nomadsmarketing.co.evil.com' },
    { origin: 'null' },
    { origin: 'not a url' },
    {},
  ]) {
    const res = post(headers);
    assert.equal(res.statusCode, 403, JSON.stringify(headers));
    assert.equal(res.headers['set-cookie'], undefined);
  }
});
