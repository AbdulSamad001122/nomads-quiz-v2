/**
 * UTM capture — run with:  node --test src/analytics/utmSource.test.js
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UTM_KEY, utmSlug, readUtm, captureUtm, utmEventParams, utmKitFields } from './utmSource.js';

function memStorage(initial = {}) {
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

test('the 6 links from Yemi are read exactly', () => {
  const links = [
    ['linkedin', 'social'], ['instagram', 'social'], ['youtube', 'video'],
    ['substack', 'newsletter'], ['website', 'site'], ['kit', 'email'],
  ];
  for (const [s, m] of links) {
    assert.deepEqual(readUtm(`?utm_source=${s}&utm_medium=${m}`), { source: s, medium: m });
  }
});

test('no UTMs / empty / junk → null', () => {
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
  const st = memStorage();
  const s = captureUtm({ search: '?utm_source=linkedin&utm_medium=social', storage: st });
  assert.deepEqual(s, { first: { source: 'linkedin', medium: 'social' }, latest: { source: 'linkedin', medium: 'social' } });
  assert.deepEqual(JSON.parse(st.dump()[UTM_KEY]), s);
});

test('a later UTM visit changes latest only; first is never overwritten', () => {
  const st = memStorage();
  captureUtm({ search: '?utm_source=linkedin&utm_medium=social', storage: st });
  const s = captureUtm({ search: '?utm_source=kit&utm_medium=email', storage: st });
  assert.deepEqual(s.first, { source: 'linkedin', medium: 'social' });
  assert.deepEqual(s.latest, { source: 'kit', medium: 'email' });
  const s3 = captureUtm({ search: '?utm_source=youtube&utm_medium=video', storage: st });
  assert.deepEqual(s3.first, { source: 'linkedin', medium: 'social' });
  assert.deepEqual(s3.latest, { source: 'youtube', medium: 'video' });
});

test('a visit without UTMs (typed address, quiz page after /opt-in, reload) keeps both', () => {
  const st = memStorage();
  captureUtm({ search: '?utm_source=substack&utm_medium=newsletter', storage: st });
  const s = captureUtm({ search: '', storage: st });
  assert.deepEqual(s.first, { source: 'substack', medium: 'newsletter' });
  assert.deepEqual(s.latest, { source: 'substack', medium: 'newsletter' });
});

test('never seen any UTMs → nothing stored, no params, no Kit fields', () => {
  const st = memStorage();
  const s = captureUtm({ search: '?popup=97', storage: st });
  assert.deepEqual(s, { first: null, latest: null });
  assert.equal(st.dump()[UTM_KEY], undefined);
  assert.deepEqual(utmEventParams(s), {});
  assert.deepEqual(utmKitFields(s), {});
});

test('event params + Kit field names', () => {
  const st = memStorage();
  captureUtm({ search: '?utm_source=linkedin&utm_medium=social', storage: st });
  const s = captureUtm({ search: '?utm_source=kit&utm_medium=email', storage: st });
  assert.deepEqual(utmEventParams(s), { first_utm_source: 'linkedin', first_utm_medium: 'social', utm_source: 'kit', utm_medium: 'email' });
  assert.deepEqual(utmKitFields(s), {
    quiz_taker_first_utm_source: 'linkedin', quiz_taker_first_utm_medium: 'social',
    quiz_taker_utm_source: 'kit', quiz_taker_utm_medium: 'email',
  });
});

test('only a source (no medium) → medium keys are left out, never null', () => {
  const s = captureUtm({ search: '?utm_source=website', storage: memStorage() });
  assert.deepEqual(utmEventParams(s), { first_utm_source: 'website', utm_source: 'website' });
  assert.ok(!Object.values(utmKitFields(s)).includes(null));
});

test('storage blocked → never throws, this page load still counts', () => {
  const s = captureUtm({ search: '?utm_source=youtube&utm_medium=video', storage: blocked });
  assert.deepEqual(s.latest, { source: 'youtube', medium: 'video' });
  assert.deepEqual(captureUtm({ search: '', storage: blocked }), { first: null, latest: null });
  assert.deepEqual(captureUtm({ search: '?utm_source=x', storage: null }).first, { source: 'x', medium: null });
});

test('corrupt or tampered saved value is ignored / cleaned', () => {
  assert.deepEqual(captureUtm({ search: '', storage: memStorage({ [UTM_KEY]: '{bad json' }) }), { first: null, latest: null });
  const s = captureUtm({ search: '', storage: memStorage({ [UTM_KEY]: JSON.stringify({ first: { source: 'Evil Value!!', medium: 7 }, latest: 'nope' }) }) });
  assert.deepEqual(s, { first: { source: 'evil-value', medium: '7' }, latest: null });
});
