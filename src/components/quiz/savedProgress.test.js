// node --test src/components/quiz/savedProgress.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS } from '../../data/questions.js';
import { quizFingerprint, STORAGE_KEY as RESULTS_KEY } from '../../results/savedResults.js';
import {
  PROGRESS_KEY,
  PROGRESS_VERSION,
  PROGRESS_MAX_AGE_MS,
  saveProgress,
  loadProgress,
  clearProgress,
} from './savedProgress.js';

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

const NOW = 1_800_000_000_000;
const DAY = 24 * 60 * 60 * 1000;
const HALF = {
  screen: 'q7a',
  answers: { q1: 'founder', q2a: '35k-100k', q3: 'agency', q4: 'calls', q5: 'cold-traffic', q6: ['seo', 'other'] },
  manualValues: { q2a: '' },
  otherText: 'Podcasts',
  overrides: ['q8'],
  clampedBrackets: ['q8'],
  lead: { firstName: 'Sam', email: 'sam@example.com' },
};
const rec = (s) => JSON.parse(s.data[PROGRESS_KEY]);

test('7-day expiry constant is exactly 7 days', () => {
  assert.equal(PROGRESS_MAX_AGE_MS, 7 * DAY);
});

test('round trip: what was saved comes back', () => {
  const s = memoryStorage();
  assert.equal(saveProgress(HALF, { storage: s, now: NOW }), true);
  const got = loadProgress({ storage: s, now: NOW });
  assert.deepEqual(got, { ...HALF, savedAt: NOW });
});

test('uses its own key — never touches the saved results', () => {
  assert.notEqual(PROGRESS_KEY, RESULTS_KEY);
  const s = memoryStorage({ [RESULTS_KEY]: 'results-json' });
  saveProgress(HALF, { storage: s, now: NOW });
  clearProgress({ storage: s });
  assert.equal(s.data[RESULTS_KEY], 'results-json');
  assert.equal(PROGRESS_KEY in s.data, false);
});

test('still valid at 7 days, gone just after (and the stale save is deleted)', () => {
  const s = memoryStorage();
  saveProgress(HALF, { storage: s, now: NOW });
  assert.ok(loadProgress({ storage: s, now: NOW + 7 * DAY }));
  assert.equal(loadProgress({ storage: s, now: NOW + 7 * DAY + 1 }), null);
  assert.equal(PROGRESS_KEY in s.data, false);
});

test('each new save resets the 7-day clock', () => {
  const s = memoryStorage();
  saveProgress(HALF, { storage: s, now: NOW });
  saveProgress({ ...HALF, screen: 'q8' }, { storage: s, now: NOW + 6 * DAY });
  const got = loadProgress({ storage: s, now: NOW + 12 * DAY });
  assert.equal(got.screen, 'q8');
});

test('a save from the future (clock moved back) is rejected; small drift is fine', () => {
  const s = memoryStorage();
  saveProgress(HALF, { storage: s, now: NOW + 60 * 1000 });
  assert.ok(loadProgress({ storage: s, now: NOW }));
  saveProgress(HALF, { storage: s, now: NOW + DAY });
  assert.equal(loadProgress({ storage: s, now: NOW }), null);
});

test('a changed quiz (fingerprint) or another version throws the save away', () => {
  const s = memoryStorage();
  saveProgress(HALF, { storage: s, now: NOW, fingerprint: 'old-quiz' });
  assert.equal(loadProgress({ storage: s, now: NOW, fingerprint: quizFingerprint() }), null);
  assert.equal(PROGRESS_KEY in s.data, false);

  saveProgress(HALF, { storage: s, now: NOW });
  const r = rec(s);
  s.data[PROGRESS_KEY] = JSON.stringify({ ...r, v: PROGRESS_VERSION + 1 });
  assert.equal(loadProgress({ storage: s, now: NOW }), null);
});

test('the default fingerprint matches the live quiz definition', () => {
  const s = memoryStorage();
  saveProgress(HALF, { storage: s, now: NOW });
  assert.equal(rec(s).fp, quizFingerprint(QUESTIONS));
});

test('a screen that is no longer resumable is rejected and deleted', () => {
  const s = memoryStorage();
  saveProgress({ ...HALF, screen: 'q99' }, { storage: s, now: NOW });
  assert.equal(loadProgress({ storage: s, now: NOW, isResumable: (id) => id !== 'q99' }), null);
  assert.equal(PROGRESS_KEY in s.data, false);
});

test('corrupt or wrong-shaped data never throws and is deleted', () => {
  for (const bad of ['{not json', 'null', '[]', '42', '"str"', JSON.stringify({ v: 1 })]) {
    const s = memoryStorage({ [PROGRESS_KEY]: bad });
    assert.equal(loadProgress({ storage: s, now: NOW }), null, bad);
    assert.equal(PROGRESS_KEY in s.data, false, bad);
  }
  const s = memoryStorage();
  saveProgress(HALF, { storage: s, now: NOW });
  for (const patch of [{ savedAt: 'x' }, { savedAt: Infinity }, { answers: [] }, { manualValues: null }, { screen: 5 }]) {
    s.data[PROGRESS_KEY] = JSON.stringify({ ...rec(memoryStorageWith(HALF)), ...patch });
    assert.equal(loadProgress({ storage: s, now: NOW }), null, JSON.stringify(patch));
  }
});
function memoryStorageWith(p) {
  const s = memoryStorage();
  saveProgress(p, { storage: s, now: NOW });
  return s;
}

test('only known questions and well-formed values are kept; Q14 free text never', () => {
  const s = memoryStorage();
  saveProgress(
    {
      ...HALF,
      answers: { ...HALF.answers, q14: 'my secret voc text', bogus: 'x', q12: 5, q13: ['a', 3] },
      manualValues: { q8: '1200', q10: 7, name: 'Sam' },
      overrides: ['q8', 'q8', 'nope'],
      clampedBrackets: 'q8',
    },
    { storage: s, now: NOW }
  );
  const r = rec(s);
  assert.equal('q14' in r.answers, false);
  assert.equal('bogus' in r.answers, false);
  assert.equal('q12' in r.answers, false);
  assert.equal('q13' in r.answers, false);
  assert.deepEqual(r.manualValues, { q8: '1200' });
  assert.deepEqual(r.overrides, ['q8']);
  assert.deepEqual(r.clampedBrackets, []);
  assert.equal(JSON.stringify(r).includes('my secret voc text'), false);
});

test('tampered stored answers are cleaned on load, not trusted', () => {
  const s = memoryStorage();
  saveProgress(HALF, { storage: s, now: NOW });
  const r = rec(s);
  r.answers.q14 = 'injected';
  r.answers.evil = 'x';
  r.lead = { firstName: 7, email: 'a@b.co', extra: 'x' };
  r.otherText = 'x'.repeat(10_000);
  s.data[PROGRESS_KEY] = JSON.stringify(r);
  const got = loadProgress({ storage: s, now: NOW });
  assert.equal('q14' in got.answers, false);
  assert.equal('evil' in got.answers, false);
  assert.deepEqual(got.lead, { firstName: '', email: 'a@b.co' });
  assert.equal(got.otherText, '');
});

test('no lead yet (before the opt-in) is stored as null', () => {
  const s = memoryStorage();
  saveProgress({ ...HALF, screen: 'q2a', lead: null }, { storage: s, now: NOW });
  assert.equal(loadProgress({ storage: s, now: NOW }).lead, null);
});

test('skipped answers (null) survive the round trip', () => {
  const s = memoryStorage();
  saveProgress({ ...HALF, answers: { ...HALF.answers, q7c: null } }, { storage: s, now: NOW });
  assert.equal(loadProgress({ storage: s, now: NOW }).answers.q7c, null);
});

test('missing screen id refuses to save', () => {
  const s = memoryStorage();
  assert.equal(saveProgress({ ...HALF, screen: undefined }, { storage: s, now: NOW }), false);
  assert.equal(PROGRESS_KEY in s.data, false);
});

test('blocked / full / missing storage never throws', () => {
  assert.equal(saveProgress(HALF, { storage: throwing('setItem'), now: NOW }), false);
  assert.equal(saveProgress(HALF, { storage: null, now: NOW }), false);
  assert.equal(loadProgress({ storage: throwing('getItem'), now: NOW }), null);
  assert.equal(loadProgress({ storage: null, now: NOW }), null);
  assert.doesNotThrow(() => clearProgress({ storage: throwing('removeItem') }));
  assert.doesNotThrow(() => clearProgress({ storage: null }));
});

test('nothing saved → null, storage untouched', () => {
  const s = memoryStorage();
  assert.equal(loadProgress({ storage: s, now: NOW }), null);
  assert.deepEqual(s.data, {});
});

test('in Node (no window) the default storage is absent and calls are no-ops', () => {
  assert.equal(saveProgress(HALF), false);
  assert.equal(loadProgress(), null);
  assert.doesNotThrow(() => clearProgress());
});
