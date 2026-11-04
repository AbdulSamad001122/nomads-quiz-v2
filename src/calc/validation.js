/**
 * Manual-entry bounds + impossible-answer checks (Quiz Logics.docx ·
 * Manual entry & validation). Reject out-of-bounds; do not silently clamp.
 */

/** Q2 "$500K+/month" minimum annual revenue (Cap Logic, Nov 4). Kept here,
 *  not in backendValues.js, which already imports this file. */
export const Q2_TOP_MIN = 6_000_000;

export const BOUNDS = {
  // Q2 "$500K+/month" annual revenue (Cap Logic, Nov 4). Min $1: revenue is
  // what every RPV divides into, so $0 would break the maths. Under $6M is
  // not rejected here — it gets the "check the number" prompt (impossibleCheck).
  q2a: { type: 'currency', min: 1, max: 100_000_000_000 },
  q7a: { type: 'integer', min: 1, max: 100_000_000 },
  // Yemi ruling (2026-09-15, Q7): the Logic Doc's bounds table has no Q7b
  // row; min $1 approved. A guessed min of 0 previously let "$0 spend" divide
  // to an Infinity× ROAS.
  q7b: { type: 'currency', min: 1, max: 1_000_000_000 },
  q8: { type: 'integer', min: 0, max: 100_000_000 },
  q9a: { type: 'percent', min: 0, max: 100 },
  q9b: { type: 'percent', min: 0, max: 100 },
  q10: { type: 'currency', min: 0.01, max: 10_000_000 },
  q11: { type: 'currency', min: 0, max: 1_000_000_000 },
};

/**
 * Parse a manual-entry string strictly. People do type "$17,500" and "45%",
 * so currency/percent signs, spaces and thousands separators are accepted —
 * but whatever is left must be a plain number. Anything else returns null
 * rather than being coerced.
 *
 * The old approach stripped every non-digit, which silently turned "1e6" into
 * 16 and "-2000" into 2000. A negative now parses through to the bounds check
 * so the taker gets the doc's "out of range" message instead of a wrong value.
 */
export function parseNumeric(raw) {
  const cleaned = String(raw ?? '')
    .trim()
    .replace(/[$%\s]/g, '')
    .replace(/,/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Validate one manual-entry field. Returns { ok, value?, message? }. */
export function validateManual(qid, raw) {
  const b = BOUNDS[qid];
  if (!b) return { ok: true, value: raw };
  const n = parseNumeric(raw);
  if (n === null) return { ok: false, message: 'Please enter a number.' };
  if (b.type === 'integer' && !Number.isInteger(n))
    return { ok: false, message: 'Please enter a whole number.' };
  if (n < b.min || n > b.max)
    return {
      ok: false,
      message: `Enter a value between ${b.min.toLocaleString()} and ${b.max.toLocaleString()}.`,
    };
  return { ok: true, value: n };
}

/**
 * Cross-question impossible-answer checks that fire on advancing.
 * `resolved` is the numeric inputs so far ({ q7, q8, q2, q11 }); `answers`
 * the raw answer ids (only Q2 needs to know which option was picked).
 * Returns null, or { id, message } for the first check that trips.
 */
export function impossibleCheck(qid, resolved, answers = {}) {
  // Cap Logic (Yemi, Nov 4): "If someone picks $500K+/month, their annual
  // revenue must be at least $6M. If they enter less, ask them to check the
  // number before continuing."
  if (
    qid === 'q2a' &&
    answers.q2a === 'manual' &&
    resolved.q2 != null &&
    resolved.q2 < Q2_TOP_MIN
  ) {
    return {
      id: 'top-revenue-under-6m',
      message:
        "$500K+/month is at least $6M a year, but you entered less than that. Mind checking the number?",
    };
  }
  if (qid === 'q8' && resolved.q8 != null && resolved.q7 != null && resolved.q8 >= resolved.q7) {
    return {
      id: 'subs-gt-visitors',
      message:
        "That's more new subscribers than visitors, which usually means one of these is off. Mind having another look?",
    };
  }
  if (qid === 'q11' && resolved.q11 != null && resolved.q2 != null && resolved.q11 > resolved.q2) {
    return {
      id: 'email-gt-total',
      message:
        "That's more email revenue than total revenue. Mind having another look?",
    };
  }
  return null;
}
