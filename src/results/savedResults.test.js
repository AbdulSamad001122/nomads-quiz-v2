// node --test src/results/savedResults.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS } from '../data/questions.js';
import {
  STORAGE_KEY,
  STORAGE_VERSION,
  MAX_AGE_MS,
  quizFingerprint,
  resultSignature,
  saveResults,
  loadResults,
  clearResults,
} from './savedResults.js';
import { resultFor, restoreSavedResults } from './restoreResults.js';

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
const throwing = (which) => {
  const s = memoryStorage();
  s[which] = () => { throw new Error(`${which} blocked`); };
  return s;
};

// The quiz's own dev fixture (QuizFlow devInitialState): a complete SLG run.
const ANSWERS = {
  q1: 'founder', q2a: '35k-100k', q3: 'agency', q4: 'calls', q5: 'cold-traffic',
  q6: ['seo'], q7a: '10001-50000', q8: '1000-5000', q9a: '1-5', q9b: '25-50',
  q10: '2000-5000', q11: '25k-100k', q12: 'a', q13: ['paid-ads'],
};
const NOW = 1_800_000_000_000;

const savedRecord = (s) => JSON.parse(s.data[STORAGE_KEY]);

test('round trip: what was saved comes back', () => {
  const s = memoryStorage();
  assert.equal(saveResults({ answers: ANSWERS, manualValues: { q8: '1200' }, sig: 'abc' }, { storage: s, now: NOW }), true);
  const got = loadResults({ storage: s, now: NOW });
  assert.deepEqual(got, { answers: ANSWERS, manualValues: { q8: '1200' }, sig: 'abc' });
});

test('only known questions with well-formed values are saved', () => {
  const s = memoryStorage();
  saveResults(
    {
      answers: { ...ANSWERS, email: 'x@example.com', q14: 'free text never belongs here', bogus: 'x', q12: 5 },
      manualValues: { q8: '1200', q10: 7, name: 'Sam' },
      sig: 'abc',
    },
    { storage: s, now: NOW }
  );
  const rec = savedRecord(s);
  assert.equal('email' in rec.answers, false);
  assert.equal('bogus' in rec.answers, false);
  assert.equal('q12' in rec.answers, false, 'non-string answer dropped');
  assert.equal('q14' in rec.answers, false, 'free-text question never saved');
  assert.equal(JSON.stringify(rec).includes('free text'), false);
  assert.deepEqual(rec.manualValues, { q8: '1200' });
  assert.equal(JSON.stringify(rec).includes('Sam'), false);
  assert.equal(JSON.stringify(rec).includes('x@example.com'), false);
});

test('expires 30 days after saving', () => {
  const s = memoryStorage();
  saveResults({ answers: ANSWERS, manualValues: {}, sig: 'abc' }, { storage: s, now: NOW });
  assert.ok(loadResults({ storage: s, now: NOW + MAX_AGE_MS }), 'still valid at exactly 30 days');
  assert.equal(loadResults({ storage: s, now: NOW + MAX_AGE_MS + 1 }), null);
  assert.equal(STORAGE_KEY in s.data, false, 'expired save deleted');
});

test('a save dated in the future (clock moved) is rejected', () => {
  const s = memoryStorage();
  saveResults({ answers: ANSWERS, manualValues: {}, sig: 'abc' }, { storage: s, now: NOW + 60 * 60 * 1000 });
  assert.equal(loadResults({ storage: s, now: NOW }), null);
  assert.equal(STORAGE_KEY in s.data, false);
});

test('small clock drift is tolerated', () => {
  const s = memoryStorage();
  saveResults({ answers: ANSWERS, manualValues: {}, sig: 'abc' }, { storage: s, now: NOW + 60 * 1000 });
  assert.ok(loadResults({ storage: s, now: NOW }));
});

test('another storage version is rejected', () => {
  const s = memoryStorage();
  saveResults({ answers: ANSWERS, manualValues: {}, sig: 'abc' }, { storage: s, now: NOW });
  const rec = savedRecord(s);
  s.data[STORAGE_KEY] = JSON.stringify({ ...rec, v: STORAGE_VERSION + 1 });
  assert.equal(loadResults({ storage: s, now: NOW }), null);
  assert.equal(STORAGE_KEY in s.data, false);
});

test('a save from a different version of the questions is rejected', () => {
  const s = memoryStorage();
  saveResults({ answers: ANSWERS, manualValues: {}, sig: 'abc' }, { storage: s, now: NOW, fingerprint: 'old-quiz' });
  assert.equal(loadResults({ storage: s, now: NOW }), null);
  assert.equal(STORAGE_KEY in s.data, false);
});

test('corrupt or wrongly shaped data is rejected and deleted', () => {
  const bad = [
    '{not json',
    'null',
    '[]',
    '"text"',
    JSON.stringify({ v: STORAGE_VERSION, fp: quizFingerprint(), savedAt: NOW, sig: 'a', answers: [], manualValues: {} }),
    JSON.stringify({ v: STORAGE_VERSION, fp: quizFingerprint(), savedAt: NOW, sig: 'a', answers: {}, manualValues: { q8: 12 } }),
    JSON.stringify({ v: STORAGE_VERSION, fp: quizFingerprint(), savedAt: NOW, sig: 'a', answers: { hacked: 'x' }, manualValues: {} }),
    JSON.stringify({ v: STORAGE_VERSION, fp: quizFingerprint(), savedAt: NOW, sig: 'a', answers: { q6: [1, 2] }, manualValues: {} }),
    JSON.stringify({ v: STORAGE_VERSION, fp: quizFingerprint(), savedAt: 'yesterday', sig: 'a', answers: {}, manualValues: {} }),
    JSON.stringify({ v: STORAGE_VERSION, fp: quizFingerprint(), savedAt: NOW, answers: {}, manualValues: {} }),
  ];
  for (const raw of bad) {
    const s = memoryStorage({ [STORAGE_KEY]: raw });
    assert.equal(loadResults({ storage: s, now: NOW }), null, raw);
    assert.equal(STORAGE_KEY in s.data, false, `deleted: ${raw}`);
  }
});

test('nothing saved → null, no error', () => {
  assert.equal(loadResults({ storage: memoryStorage(), now: NOW }), null);
});

test('blocked or full storage never throws', () => {
  assert.equal(loadResults({ storage: throwing('getItem'), now: NOW }), null);
  assert.equal(saveResults({ answers: ANSWERS, manualValues: {}, sig: 'a' }, { storage: throwing('setItem'), now: NOW }), false);
  assert.doesNotThrow(() => clearResults({ storage: throwing('removeItem') }));
  assert.equal(loadResults({ storage: null, now: NOW }), null);
  assert.equal(saveResults({ answers: ANSWERS, manualValues: {}, sig: 'a' }, { storage: null, now: NOW }), false);
  assert.doesNotThrow(() => clearResults({ storage: null }));
  // outside a browser (no window) the defaults fall back to "no storage"
  assert.equal(loadResults(), null);
});

test('clearResults deletes the save (new attempt)', () => {
  const s = memoryStorage();
  saveResults({ answers: ANSWERS, manualValues: {}, sig: 'abc' }, { storage: s, now: NOW });
  clearResults({ storage: s });
  assert.equal(loadResults({ storage: s, now: NOW }), null);
});

test('quiz fingerprint is stable and changes with the questions', () => {
  assert.equal(quizFingerprint(), quizFingerprint());
  const renamed = QUESTIONS.map((q, i) => (i === 3 && Array.isArray(q.options)
    ? { ...q, options: q.options.map((o, j) => (j === 0 ? { ...o, id: o.id + '-x' } : o)) }
    : q));
  assert.notEqual(quizFingerprint(renamed), quizFingerprint());
  assert.notEqual(quizFingerprint(QUESTIONS.slice(1)), quizFingerprint());
  // labels (copy) don't matter, only ids
  const relabelled = QUESTIONS.map((q) => ({ ...q, question: 'changed copy' }));
  assert.equal(quizFingerprint(relabelled), quizFingerprint());
});

test('result signature ignores key order and changes with any number', () => {
  assert.equal(resultSignature({ a: 1, b: { c: 2, d: [1, 2] } }), resultSignature({ b: { d: [1, 2], c: 2 }, a: 1 }));
  assert.notEqual(resultSignature({ a: 1, b: { c: 2 } }), resultSignature({ a: 1, b: { c: 3 } }));
  assert.notEqual(resultSignature({ a: [1, 2] }), resultSignature({ a: [2, 1] }));
});

test('restore returns the saved answers when the numbers still match', () => {
  const s = memoryStorage();
  const result = resultFor(ANSWERS, {});
  assert.ok(result, 'fixture calculates');
  saveResults({ answers: ANSWERS, manualValues: {}, sig: resultSignature(result) }, { storage: s, now: NOW });
  const got = restoreSavedResults({ storage: s, now: NOW });
  assert.deepEqual(got, { answers: ANSWERS, manualValues: {}, sig: resultSignature(result) });
  // and recalculating gives the identical result object
  assert.deepEqual(resultFor(got.answers, got.manualValues), result);
});

test('restore rejects (and deletes) a save whose numbers would now differ', () => {
  const s = memoryStorage();
  saveResults({ answers: ANSWERS, manualValues: {}, sig: 'numbers-from-an-older-calculator' }, { storage: s, now: NOW });
  assert.equal(restoreSavedResults({ storage: s, now: NOW }), null);
  assert.equal(STORAGE_KEY in s.data, false);
});

test('restore rejects (and deletes) answers that cannot be calculated', () => {
  const s = memoryStorage();
  const missing = { ...ANSWERS };
  delete missing.q7a; // no visitors → the "missing numbers" case
  assert.equal(resultFor(missing, {}), null);
  saveResults({ answers: missing, manualValues: {}, sig: 'x' }, { storage: s, now: NOW });
  assert.equal(restoreSavedResults({ storage: s, now: NOW }), null);
  assert.equal(STORAGE_KEY in s.data, false);
});

test('restore works with typed exact numbers (manual entry)', () => {
  const s = memoryStorage();
  const answers = { ...ANSWERS, q7a: 'manual', q10: 'manual' };
  const manualValues = { q7a: '42000', q10: '6500' };
  const result = resultFor(answers, manualValues);
  assert.ok(result);
  saveResults({ answers, manualValues, sig: resultSignature(result) }, { storage: s, now: NOW });
  const got = restoreSavedResults({ storage: s, now: NOW });
  assert.deepEqual(resultFor(got.answers, got.manualValues), result);
});
