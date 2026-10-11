// node --test src/popups/emailGivenCookie.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EMAIL_GIVEN_COOKIE,
  MAX_AGE_DAYS,
  SERVER_ENDPOINT,
  emailGivenCookie,
  hasEmailGivenCookie,
  markEmailGiven,
} from './emailGivenCookie.js';

const https = (hostname) => ({ hostname, protocol: 'https:' });
const parts = (s) => s.split('; ');

test('live quiz address → shared with the whole nomadsmarketing.co domain', () => {
  const p = parts(emailGivenCookie(https('diagnostic.nomadsmarketing.co')));
  assert.equal(p[0], `${EMAIL_GIVEN_COOKIE}=1`);
  assert.ok(p.includes('domain=.nomadsmarketing.co'));
  assert.ok(p.includes('path=/'));
  assert.ok(p.includes('SameSite=Lax'));
  assert.ok(p.includes('Secure'));
});

test('lasts a year (Chrome caps at 400 days)', () => {
  assert.ok(parts(emailGivenCookie(https('diagnostic.nomadsmarketing.co'))).includes(`max-age=${365 * 86400}`));
  assert.equal(MAX_AGE_DAYS, 365);
});

test('apex and www also get the shared domain', () => {
  for (const h of ['nomadsmarketing.co', 'www.nomadsmarketing.co', 'DIAGNOSTIC.NomadsMarketing.co']) {
    assert.ok(parts(emailGivenCookie(https(h))).includes('domain=.nomadsmarketing.co'), h);
  }
});

test('other hosts get a host-only cookie (browser would reject a foreign domain)', () => {
  for (const h of ['nomads-quiz.vercel.app', 'localhost', 'evilnomadsmarketing.co', 'nomadsmarketing.co.evil.com']) {
    assert.ok(!emailGivenCookie(https(h)).includes('domain='), h);
  }
});

test('plain http (local dev) → no Secure flag, so the cookie still saves', () => {
  assert.ok(!parts(emailGivenCookie({ hostname: 'localhost', protocol: 'http:' })).includes('Secure'));
});

test('holds no personal data — only "1"', () => {
  const s = emailGivenCookie(https('diagnostic.nomadsmarketing.co'));
  assert.ok(!s.includes('@'));
  assert.equal(s.split(';')[0], 'nomads_email_given=1');
});

test('markEmailGiven writes the cookie', () => {
  const doc = {};
  assert.equal(markEmailGiven({ doc, loc: https('diagnostic.nomadsmarketing.co'), fetchImpl: null }), true);
  assert.equal(doc.cookie, emailGivenCookie(https('diagnostic.nomadsmarketing.co')));
});

test('markEmailGiven also asks the server for the long-lasting copy', () => {
  const calls = [];
  const fetchImpl = (url, opts) => (calls.push({ url, opts }), Promise.resolve({ ok: true }));
  markEmailGiven({ doc: {}, loc: https('diagnostic.nomadsmarketing.co'), fetchImpl });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, SERVER_ENDPOINT);
  assert.equal(SERVER_ENDPOINT, '/api/email-given');
  assert.equal(calls[0].opts.method, 'POST');
  assert.equal(calls[0].opts.keepalive, true);
  assert.equal(calls[0].opts.credentials, 'same-origin');
});

test('server call failing never throws or leaks a rejection', async () => {
  const rejecting = () => Promise.reject(new Error('offline'));
  const throwing = () => { throw new Error('no fetch'); };
  assert.equal(markEmailGiven({ doc: {}, loc: https('diagnostic.nomadsmarketing.co'), fetchImpl: rejecting }), true);
  assert.equal(markEmailGiven({ doc: {}, loc: https('diagnostic.nomadsmarketing.co'), fetchImpl: throwing }), true);
  await new Promise((r) => setTimeout(r, 10)); // an unhandled rejection would fail the run
});

test('hasEmailGivenCookie reads only our exact cookie', () => {
  assert.equal(hasEmailGivenCookie({ cookie: 'nomads_email_given=1' }), true);
  assert.equal(hasEmailGivenCookie({ cookie: '_ga=GA1.1.1; nomads_email_given=1; x=2' }), true);
  assert.equal(hasEmailGivenCookie({ cookie: '' }), false);
  assert.equal(hasEmailGivenCookie({ cookie: 'nomads_email_given=0' }), false);
  assert.equal(hasEmailGivenCookie({ cookie: 'nomads_email_given=10' }), false);
  assert.equal(hasEmailGivenCookie({ cookie: 'xnomads_email_given=1' }), false);
  assert.equal(hasEmailGivenCookie(null), false);
  const blocked = {};
  Object.defineProperty(blocked, 'cookie', { get() { throw new Error('blocked'); } });
  assert.equal(hasEmailGivenCookie(blocked), false);
  assert.equal(hasEmailGivenCookie(), false); // Node: no document
});

test('markEmailGiven never throws (cookies blocked, no document)', () => {
  const blocked = {};
  Object.defineProperty(blocked, 'cookie', { set() { throw new Error('blocked'); } });
  assert.equal(markEmailGiven({ doc: blocked, loc: https('diagnostic.nomadsmarketing.co'), fetchImpl: null }), false);
  assert.equal(markEmailGiven({ doc: null, loc: null }), false);
  assert.equal(markEmailGiven(), false); // Node: no document/window
});
