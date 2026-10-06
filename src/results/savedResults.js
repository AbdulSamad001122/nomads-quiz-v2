import { QUESTIONS } from '../data/questions.js';

/**
 * Saved results: the finished taker's answers, kept in their own browser
 * (localStorage) so /diagnostic-results survives a refresh or a later visit.
 *
 * - Only the answer ids and typed numbers are saved. Name, email and the
 *   free-text answers live outside `answers`, so they never reach storage.
 * - Expires 30 days after the quiz was finished.
 * - Deleted the moment a new attempt starts (QuizFlow's Start button), so
 *   old results are never shown once someone retakes the quiz.
 * - Anything unexpected (corrupt JSON, another version, a changed quiz, a
 *   changed calculation, blocked or full storage) is treated as "nothing
 *   saved": the visitor is sent to the start instead of seeing an error or
 *   wrong numbers.
 */
export const STORAGE_KEY = 'nomadsRpvResults';
export const STORAGE_VERSION = 1;
export const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
// A save stamped later than "now" means the clock moved; small drift is fine.
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;

// Free-text questions (Q14) are never saved, whatever their value holds.
const QUESTION_IDS = new Set(QUESTIONS.filter((q) => q.variant !== 'text').map((q) => q.id));

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** Changes whenever a question or answer option is added, removed or renamed. */
export function quizFingerprint(questions = QUESTIONS) {
  return hash(
    questions
      .map((q) => {
        const opts = Array.isArray(q.options)
          ? q.options
          : q.options
            ? [...(q.options.slg || []), ...(q.options.plg || [])]
            : [];
        return `${q.id}${q.multi ? '*' : ''}${q.manualEntry ? '#' : ''}:${opts.map((o) => o.id).join(',')}`;
      })
      .join('|')
  );
}

/** JSON with sorted keys, so equal results always give equal strings. */
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value === undefined ? null : value);
}

/** Changes whenever any number the results page shows would change. */
export function resultSignature(result) {
  return hash(stableStringify(result));
}

function browserStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // storage blocked (e.g. cookies disabled)
  }
}

const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isAnswerValue = (v) =>
  v === null ||
  typeof v === 'string' ||
  (Array.isArray(v) && v.every((x) => typeof x === 'string'));

/** Keeps only known questions with well-formed values. */
function cleanAnswers(answers) {
  const out = {};
  for (const [k, v] of Object.entries(answers || {})) {
    if (QUESTION_IDS.has(k) && isAnswerValue(v)) out[k] = Array.isArray(v) ? [...v] : v;
  }
  return out;
}
function cleanManual(manualValues) {
  const out = {};
  for (const [k, v] of Object.entries(manualValues || {})) {
    if (QUESTION_IDS.has(k) && typeof v === 'string') out[k] = v;
  }
  return out;
}

/** Saves the finished taker's answers. Returns false if storage refused. */
export function saveResults(
  { answers, manualValues, sig },
  { storage = browserStorage(), now = Date.now(), fingerprint = quizFingerprint() } = {}
) {
  if (!storage) return false;
  const record = {
    v: STORAGE_VERSION,
    fp: fingerprint,
    savedAt: now,
    sig,
    answers: cleanAnswers(answers),
    manualValues: cleanManual(manualValues),
  };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false; // private mode / quota full: the quiz simply works as before
  }
}

/** Deletes any saved results. Never throws. */
export function clearResults({ storage = browserStorage() } = {}) {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* storage blocked: nothing to delete */
  }
}

/**
 * Returns { answers, manualValues, sig } for a valid, unexpired save made by
 * this version of the quiz, or null. Invalid saves are deleted.
 */
export function loadResults({
  storage = browserStorage(),
  now = Date.now(),
  fingerprint = quizFingerprint(),
} = {}) {
  if (!storage) return null;
  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw == null) return null;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = null;
  }
  const valid =
    isPlainObject(data) &&
    data.v === STORAGE_VERSION &&
    data.fp === fingerprint &&
    typeof data.sig === 'string' &&
    typeof data.savedAt === 'number' &&
    Number.isFinite(data.savedAt) &&
    now - data.savedAt <= MAX_AGE_MS &&
    data.savedAt - now <= FUTURE_TOLERANCE_MS &&
    isPlainObject(data.answers) &&
    isPlainObject(data.manualValues) &&
    Object.entries(data.answers).every(([k, v]) => QUESTION_IDS.has(k) && isAnswerValue(v)) &&
    Object.entries(data.manualValues).every(([k, v]) => QUESTION_IDS.has(k) && typeof v === 'string');

  if (!valid) {
    clearResults({ storage });
    return null;
  }
  return { answers: data.answers, manualValues: data.manualValues, sig: data.sig };
}
