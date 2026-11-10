import { QUESTIONS } from '../../data/questions.js';
import { quizFingerprint } from '../../results/savedResults.js';

/**
 * Saved progress: a half-finished quiz, kept in the taker's own browser
 * (localStorage) so they can continue where they left off (Nomads, Nov 9).
 *
 * - Saved after every step from Q1 up to Q14. Nothing is sent to a server.
 * - Expires 7 days after the LAST step they took (each save resets the clock).
 * - Deleted when they finish (the results get their own save), when they
 *   press "Start over", and when a new attempt starts from the welcome screen.
 * - Anything unexpected (corrupt JSON, another version, a changed quiz, a
 *   screen that no longer exists, blocked or full storage) is treated as
 *   "nothing saved": the quiz just starts at the welcome screen as before.
 * - Only works in the same browser on the same device; clearing browser data
 *   or closing a private window removes it.
 *
 * What is kept: the screen they were on, their answers and typed numbers,
 * the Q13 "Other" text, the impossible-answer overrides, and the first name +
 * email they gave at the opt-in. The email is kept so the Kit push at the end
 * (the "Quiz Taker" tag that starts the results emails) still fires for a
 * resumed taker. The Q14 free-text answer is never saved.
 */
export const PROGRESS_KEY = 'nomadsRpvProgress';
export const PROGRESS_VERSION = 1;
export const PROGRESS_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
// A save stamped later than "now" means the clock moved; small drift is fine.
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;
const MAX_TEXT = 500;

// Free-text questions (Q14) are never saved, whatever their value holds.
const QUESTION_IDS = new Set(QUESTIONS.filter((q) => q.variant !== 'text').map((q) => q.id));

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
const isShortString = (v) => typeof v === 'string' && v.length <= MAX_TEXT;

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
    if (QUESTION_IDS.has(k) && isShortString(v)) out[k] = v;
  }
  return out;
}
const cleanIdList = (list) =>
  Array.isArray(list) ? [...new Set(list.filter((x) => QUESTION_IDS.has(x)))] : [];
function cleanLead(lead) {
  if (!isPlainObject(lead)) return null;
  const firstName = isShortString(lead.firstName) ? lead.firstName : '';
  const email = isShortString(lead.email) ? lead.email : '';
  return { firstName, email };
}

/**
 * Saves the quiz as it stands. `screen` is the screen id (e.g. 'q7a'), not
 * an index, so a reordered screen list can never resume on the wrong screen.
 * Returns false if storage refused.
 */
export function saveProgress(
  { screen, answers, manualValues, otherText, overrides, clampedBrackets, lead },
  { storage = browserStorage(), now = Date.now(), fingerprint = quizFingerprint() } = {}
) {
  if (!storage || typeof screen !== 'string') return false;
  const record = {
    v: PROGRESS_VERSION,
    fp: fingerprint,
    savedAt: now,
    screen,
    answers: cleanAnswers(answers),
    manualValues: cleanManual(manualValues),
    otherText: isShortString(otherText) ? otherText : '',
    overrides: cleanIdList(overrides),
    clampedBrackets: cleanIdList(clampedBrackets),
    lead: cleanLead(lead),
  };
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false; // private mode / quota full: the quiz simply works as before
  }
}

/** Deletes any saved progress. Never throws. */
export function clearProgress({ storage = browserStorage() } = {}) {
  if (!storage) return;
  try {
    storage.removeItem(PROGRESS_KEY);
  } catch {
    /* storage blocked: nothing to delete */
  }
}

/**
 * Returns the saved progress for a valid, unexpired save made by this
 * version of the quiz, or null. `isResumable(screenId)` lets the caller
 * reject screens that no longer exist or can't be resumed. Invalid saves are
 * deleted.
 */
export function loadProgress({
  storage = browserStorage(),
  now = Date.now(),
  fingerprint = quizFingerprint(),
  isResumable = () => true,
} = {}) {
  if (!storage) return null;
  let raw;
  try {
    raw = storage.getItem(PROGRESS_KEY);
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
    data.v === PROGRESS_VERSION &&
    data.fp === fingerprint &&
    typeof data.screen === 'string' &&
    isResumable(data.screen) &&
    typeof data.savedAt === 'number' &&
    Number.isFinite(data.savedAt) &&
    now - data.savedAt <= PROGRESS_MAX_AGE_MS &&
    data.savedAt - now <= FUTURE_TOLERANCE_MS &&
    isPlainObject(data.answers) &&
    isPlainObject(data.manualValues);

  if (!valid) {
    clearProgress({ storage });
    return null;
  }
  return {
    screen: data.screen,
    answers: cleanAnswers(data.answers),
    manualValues: cleanManual(data.manualValues),
    otherText: isShortString(data.otherText) ? data.otherText : '',
    overrides: cleanIdList(data.overrides),
    clampedBrackets: cleanIdList(data.clampedBrackets),
    lead: cleanLead(data.lead),
    savedAt: data.savedAt,
  };
}
