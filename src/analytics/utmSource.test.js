/**
 * UTM capture — run with:  node --test src/analytics/utmSource.test.js
 * local = localStorage (first touch, kept for good)
 * session = sessionStorage (latest touch, this visit only)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UTM_KEY, UTM_LATEST_KEY, utmSlug, readUtm, captureUtm, loadUtm, utmEventParams, utmKitFields,
} from './utmSource.js';

function mem(initial = {}) {
  const m = { ...initial };
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: (k) => { delete m[k]; },
    dump: () => m,
  };
}
const blocked = {
  getItem() { throw new Error('SecurityError'); },
  setItem() { throw new Error('SecurityError'); },
};
// one browser: a long-lived localStorage, and a fresh sessionStorage per visit
function browser() {
  const local = mem();
  let session = mem();
  return {
    local,
    get session() { return session; },
    newVisit() { session = mem(); },
    load(search) { return captureUtm({ search, storage: local, session }); },
  };
}

test('the 6 links from Yemi are read exactly', () => {
  for (const [s, m] of [['linkedin', 'social'], ['instagram', 'social'], ['youtube', 'video'], ['substack', 'newsletter'], ['website', 'site'], ['kit', 'email']]) {
    assert.deepEqual(readUtm(`?utm_source=${s}&utm_medium=${m}`), { source: s, medium: m });
  }
});

test('no UTMs / empty / other params → null', () => {
  assert.equal(readUtm(''), null);
  assert.equal(readUtm('?popup=97&page=home&type=inline'), null);
  assert.equal(readUtm('?utm_source=&utm_medium='), null);
  assert.equal(readUtm('?utm_campaign=x'), null);
});

test('values are slugged (case, spaces, symbols, length)', () => {
  assert.deepEqual(readUtm('?utm_source=LinkedIn&utm_medium=Social%20Post'), { source: 'linkedin', medium: 'social-post' });
  assert.equal(utmSlug('<script>'), 'script');
  assert.equal(utmSlug('x'.repeat(300)).length, 100);
  assert.deepEqual(readUtm('?utm_source=kit'), { source: 'kit', medium: null });
});

test('first visit sets first AND latest', () => {
  const b = browser();
  assert.deepEqual(b.load('?utm_source=linkedin&utm_medium=social'), { first: { source: 'linkedin', medium: 'social' }, latest: { source: 'linkedin', medium: 'social' } });
  assert.deepEqual(JSON.parse(b.local.dump()[UTM_KEY]), { first: { source: 'linkedin', medium: 'social' } });
  assert.deepEqual(JSON.parse(b.session.dump()[UTM_LATEST_KEY]), { source: 'linkedin', medium: 'social' });
});

test('same visit: /opt-in → quiz → results (no UTMs in the address) keeps both', () => {
  const b = browser();
  b.load('?utm_source=substack&utm_medium=newsletter'); // /opt-in
  assert.deepEqual(b.load(''), { first: { source: 'substack', medium: 'newsletter' }, latest: { source: 'substack', medium: 'newsletter' } }); // quiz
  assert.deepEqual(b.load('').latest, { source: 'substack', medium: 'newsletter' }); // results / reload
});

test('later visit from another link: first stays, latest = that visit', () => {
  const b = browser();
  b.load('?utm_source=linkedin&utm_medium=social');
  b.newVisit();
  const s = b.load('?utm_source=kit&utm_medium=email');
  assert.deepEqual(s.first, { source: 'linkedin', medium: 'social' });
  assert.deepEqual(s.latest, { source: 'kit', medium: 'email' });
});

test('later visit WITHOUT UTMs (typed address, bookmark, pop-up): first stays, no latest', () => {
  const b = browser();
  b.load('?utm_source=linkedin&utm_medium=social');
  b.newVisit();
  const s = b.load('?popup=97&page=home&type=inline');
  assert.deepEqual(s, { first: { source: 'linkedin', medium: 'social' }, latest: null });
  assert.deepEqual(utmEventParams(s), { first_utm_source: 'linkedin', first_utm_medium: 'social' });
  assert.deepEqual(utmKitFields(s), { quiz_taker_first_utm_source: 'linkedin', quiz_taker_first_utm_medium: 'social' });
});

test('a newer UTM link in the same visit replaces latest, never first', () => {
  const b = browser();
  b.load('?utm_source=linkedin&utm_medium=social');
  const s = b.load('?utm_source=youtube&utm_medium=video');
  assert.deepEqual(s.first, { source: 'linkedin', medium: 'social' });
  assert.deepEqual(s.latest, { source: 'youtube', medium: 'video' });
});

test('never seen any UTMs → nothing stored, no params, no Kit fields', () => {
  const b = browser();
  const s = b.load('?popup=97');
  assert.deepEqual(s, { first: null, latest: null });
  assert.equal(b.local.dump()[UTM_KEY], undefined);
  assert.equal(b.session.dump()[UTM_LATEST_KEY], undefined);
  assert.deepEqual(utmEventParams(s), {});
  assert.deepEqual(utmKitFields(s), {});
});

test('event params + Kit field names', () => {
  const s = { first: { source: 'linkedin', medium: 'social' }, latest: { source: 'kit', medium: 'email' } };
  assert.deepEqual(utmEventParams(s), { first_utm_source: 'linkedin', first_utm_medium: 'social', utm_source: 'kit', utm_medium: 'email' });
  assert.deepEqual(utmKitFields(s), {
    quiz_taker_first_utm_source: 'linkedin', quiz_taker_first_utm_medium: 'social',
    quiz_taker_utm_source: 'kit', quiz_taker_utm_medium: 'email',
  });
});

test('only a source → medium keys left out, never null', () => {
  const s = browser().load('?utm_source=website');
  assert.deepEqual(utmEventParams(s), { first_utm_source: 'website', utm_source: 'website' });
  assert.ok(!Object.values(utmKitFields(s)).includes(null));
});

test('another tab saved a first touch → loadUtm sees it (fresh read)', () => {
  const local = mem();
  assert.deepEqual(loadUtm({ storage: local, session: mem() }).first, null);
  captureUtm({ search: '?utm_source=instagram&utm_medium=social', storage: local, session: mem() }); // other tab
  assert.deepEqual(loadUtm({ storage: local, session: mem() }).first, { source: 'instagram', medium: 'social' });
});

test('storage blocked → never throws, this page load still counts', () => {
  const s = captureUtm({ search: '?utm_source=youtube&utm_medium=video', storage: blocked, session: blocked });
  assert.deepEqual(s, { first: { source: 'youtube', medium: 'video' }, latest: { source: 'youtube', medium: 'video' } });
  assert.deepEqual(captureUtm({ search: '', storage: blocked, session: blocked }), { first: null, latest: null });
  assert.deepEqual(captureUtm({ search: '?utm_source=x', storage: null, session: null }).first, { source: 'x', medium: null });
});

test('corrupt or tampered saved values are ignored / cleaned', () => {
  assert.deepEqual(loadUtm({ storage: mem({ [UTM_KEY]: '{bad json' }), session: mem({ [UTM_LATEST_KEY]: 'nope' }) }), { first: null, latest: null });
  const s = loadUtm({ storage: mem({ [UTM_KEY]: JSON.stringify({ first: { source: 'Evil Value!!', medium: 7 } }) }), session: mem({ [UTM_LATEST_KEY]: JSON.stringify({ source: 'KIT' }) }) });
  assert.deepEqual(s, { first: { source: 'evil-value', medium: '7' }, latest: { source: 'kit', medium: null } });
});
