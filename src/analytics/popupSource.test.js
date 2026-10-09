// node --test src/analytics/popupSource.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SOURCE_KEY,
  slug,
  readPopupSource,
  resolvePopupSource,
  rememberPopupSource,
  popupGaParams,
  popupSource,
} from './popupSource.js';
import { saveResults, clearResults, resultSignature } from '../results/savedResults.js';
import { resultFor } from '../results/restoreResults.js';

/** In-memory stand-in for window.localStorage. */
function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
  };
}
const throwing = () => {
  const s = memoryStorage();
  s.getItem = s.setItem = s.removeItem = () => { throw new Error('blocked'); };
  return s;
};

test('full popup link → popup, page, type', () => {
  assert.deepEqual(readPopupSource('?popup=97&page=home&type=inline'), {
    popup: '97',
    page: 'home',
    type: 'inline',
  });
});

test('designer-only link (?popup=97) → page and type null', () => {
  assert.deepEqual(readPopupSource('?popup=97'), { popup: '97', page: null, type: null });
});

test('no popup → null (banner/landing traffic, plain reloads)', () => {
  assert.equal(readPopupSource(''), null);
  assert.equal(readPopupSource('?page=home&type=inline'), null);
  assert.equal(readPopupSource('?utm_source=x'), null);
  assert.equal(readPopupSource('?popup=%20%20'), null);
  assert.equal(readPopupSource(undefined), null);
});

test('slug: same rule as the Framer script', () => {
  assert.equal(slug(' Metric '), 'metric');
  assert.equal(slug('Case-Studies'), 'case-studies');
  assert.equal(slug('The 97%'), 'the-97');
  assert.equal(slug('v2.1 exit'), 'v2-1-exit');
  assert.equal(slug('-97-'), '97');
  assert.equal(slug('<script>'), 'script');
  assert.equal(slug('%%%'), null);
  assert.equal(slug(null), null);
});

test('long values are cut to 100 chars (GA4 limit), not dropped', () => {
  const long = 'blog-' + 'a'.repeat(200);
  const s = readPopupSource('?popup=97&page=' + long);
  assert.equal(s.page.length, 100);
  assert.ok(s.page.startsWith('blog-aaa'));
  assert.equal(slug('a'.repeat(99) + '-b'), 'a'.repeat(99)); // no trailing "-" after the cut
});

test('other query params are ignored (utm, dev routes)', () => {
  assert.deepEqual(readPopupSource('?utm_source=fb&popup=spend&page=process&type=modal-exit&goto=q5'), {
    popup: 'spend',
    page: 'process',
    type: 'modal-exit',
  });
});

test('address bar wins on any route', () => {
  const storage = memoryStorage({ [SOURCE_KEY]: JSON.stringify({ popup: 'old', page: 'faq', type: 'inline' }) });
  assert.deepEqual(
    resolvePopupSource({ search: '?popup=97&page=home&type=inline', pathname: '/diagnostic-results', storage }),
    { popup: '97', page: 'home', type: 'inline' }
  );
});

test('reopened /diagnostic-results with no query → remembered source', () => {
  const storage = memoryStorage({ [SOURCE_KEY]: JSON.stringify({ popup: '97', page: 'home', type: 'modal-exit' }) });
  const resultsReopen = () => true;
  assert.deepEqual(resolvePopupSource({ search: '', pathname: '/diagnostic-results', storage, resultsReopen }), {
    popup: '97',
    page: 'home',
    type: 'modal-exit',
  });
  assert.deepEqual(resolvePopupSource({ search: '', pathname: '/diagnostic-results/', storage, resultsReopen }), {
    popup: '97',
    page: 'home',
    type: 'modal-exit',
  });
});

test('remembered source is ignored when the results do not reopen', () => {
  const storage = memoryStorage({ [SOURCE_KEY]: JSON.stringify({ popup: '97', page: 'home', type: 'inline' }) });
  const p = { search: '', pathname: '/diagnostic-results', storage };
  assert.equal(resolvePopupSource({ ...p, resultsReopen: () => false }), null);
  assert.equal(resolvePopupSource({ ...p, resultsReopen: () => { throw new Error('x'); } }), null);
});

// Real saved-results checks (same code SavedResultsRoute uses)
const ANSWERS = {
  q1: 'founder', q2a: '35k-100k', q3: 'agency', q4: 'calls', q5: 'cold-traffic', q6: ['seo'],
  q7a: '10001-50000', q8: '1000-5000', q9a: '1-5', q9b: '25-50', q10: '2000-5000', q11: '25k-100k',
  q12: 'a', q13: ['paid-ads'],
};
const DAY = 24 * 60 * 60 * 1000;
function finishedTaker({ savedAt = Date.now() } = {}) {
  const storage = memoryStorage();
  const sig = resultSignature(resultFor(ANSWERS, {}));
  assert.equal(saveResults({ answers: ANSWERS, manualValues: {}, sig }, { storage, now: savedAt }), true);
  rememberPopupSource({ source: { popup: '97', page: 'home', type: 'modal-exit' }, storage });
  return storage;
}
const reopen = (storage) => resolvePopupSource({ search: '', pathname: '/diagnostic-results', storage });

test('real results that reopen → remembered source used', () => {
  assert.deepEqual(reopen(finishedTaker()), { popup: '97', page: 'home', type: 'modal-exit' });
});

test('results cleared (new attempt started) → old popup not used', () => {
  const storage = finishedTaker();
  clearResults({ storage });
  assert.equal(reopen(storage), null);
});

test('results expired (over 30 days) → old popup not used', () => {
  assert.equal(reopen(finishedTaker({ savedAt: Date.now() - 31 * DAY })), null);
});

test('start page with no query never uses the remembered source', () => {
  const storage = memoryStorage({ [SOURCE_KEY]: JSON.stringify({ popup: '97', page: 'home', type: 'inline' }) });
  assert.equal(resolvePopupSource({ search: '', pathname: '/diagnostic-start-now', storage }), null);
  assert.equal(resolvePopupSource({ search: '?utm_source=x', pathname: '/', storage }), null);
});

test('bad or blocked storage → null, never throws', () => {
  const p = { search: '', pathname: '/diagnostic-results' };
  assert.equal(resolvePopupSource({ ...p, storage: null }), null);
  assert.equal(resolvePopupSource({ ...p, storage: throwing() }), null);
  assert.equal(resolvePopupSource({ ...p, storage: memoryStorage({ [SOURCE_KEY]: '{not json' }) }), null);
  assert.equal(resolvePopupSource({ ...p, storage: memoryStorage({ [SOURCE_KEY]: '"97"' }) }), null);
  assert.equal(resolvePopupSource({ ...p, storage: memoryStorage({ [SOURCE_KEY]: '{"page":"home"}' }) }), null);
  assert.deepEqual(
    resolvePopupSource({
      ...p,
      storage: memoryStorage({ [SOURCE_KEY]: '{"popup":"<b>97</b>","page":"x y"}' }),
      resultsReopen: () => true,
    }),
    { popup: 'b-97-b', page: 'x-y', type: null }
  );
});

test('remember: saves a popup source, removes it for a non-popup finish', () => {
  const storage = memoryStorage();
  rememberPopupSource({ source: { popup: '97', page: 'home', type: 'inline' }, storage });
  assert.deepEqual(JSON.parse(storage.data[SOURCE_KEY]), { popup: '97', page: 'home', type: 'inline' });
  rememberPopupSource({ source: null, storage });
  assert.equal(SOURCE_KEY in storage.data, false);
});

test('remember never throws (blocked storage, no storage)', () => {
  assert.doesNotThrow(() => rememberPopupSource({ source: { popup: '97' }, storage: throwing() }));
  assert.doesNotThrow(() => rememberPopupSource({ source: { popup: '97' }, storage: null }));
});

test('GA4 params use the custom-dimension names; missing parts omitted', () => {
  assert.deepEqual(popupGaParams({ popup: '97', page: 'home', type: 'inline' }), {
    popup_id: '97',
    page: 'home',
    popup_type: 'inline',
  });
  assert.deepEqual(popupGaParams({ popup: '97', page: null, type: null }), { popup_id: '97' });
  assert.deepEqual(popupGaParams(null), {});
});

test('no window (Node) → popupSource is null', () => {
  assert.equal(popupSource, null);
});
