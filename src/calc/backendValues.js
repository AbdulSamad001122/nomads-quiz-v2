/**
 * Answer-id → backend value maps (Quiz Logics.docx · Question logic tables).
 * These are the numbers the calculator actually uses; the labels live in
 * questions.js. Manual entries and "don't track" defaults are resolved in
 * resolveInputs() below.
 */

export const Q2 = {
  'under-10k': 60000,
  '10k-35k': 270000,
  '35k-100k': 810000,
  '100k-250k': 2100000,
  '250k-500k': 4500000,
};

export const Q7 = {
  'under-3000': null, // disqualify
  '3000-5000': 4000,
  '5001-10000': 7500,
  '10001-50000': 30000,
  '50001-100000': 75000,
  '100000-plus': 150000,
  'dont-track': 10000, // default
};

export const Q7B = {
  'under-5k': 3500,
  '5k-10k': 7500,
  '10k-25k': 17500,
  '25k-50k': 37500,
  '50k-100k': 75000,
  '100k-plus': 125000,
};

export const Q7C = {
  'under-25': 0.15,
  '25-44': 0.35,
  '45-55': 0.5,
  '56-75': 0.65,
  'over-75': 0.85,
  'not-sure': 0.5, // default; shows slider on results
};

export const Q8 = {
  'under-1000': 500,
  '1000-5000': 3000,
  '5001-10000': 7500,
  '10001-25000': 17500,
  '25001-50000': 37500,
  '50000-plus': 75000,
  // 'dont-track' → 10% of Q7 (resolved below)
};

export const Q9A = {
  plg: {
    'under-1': 0.005,
    '1-5': 0.03,
    '5-10': 0.075,
    '10-15': 0.125,
    '15-plus': 0.175,
    'dont-track': 0.02,
  },
  slg: {
    'under-1': 0.005,
    '1-5': 0.03,
    '5-10': 0.075,
    '10-15': 0.125,
    '15-plus': 0.22, // stores at SLG lead cap
    'dont-track': 0.02,
  },
};

export const Q9B = {
  'under-10': 0.05,
  '10-25': 0.175,
  '25-50': 0.375,
  '50-75': 0.625,
  '75-plus': 0.75,
  'dont-track': 0.5,
};

export const Q10 = {
  plg: {
    'under-50': 25,
    '50-100': 75,
    '100-250': 175,
    '250-500': 375,
    '500-1000': 750,
    '1000-2000': 1500,
    '2000-plus': 3000,
  },
  slg: {
    '500-2000': 1250,
    '2000-5000': 3500,
    '5000-10000': 7500,
    '10000-25000': 17500,
    '25000-50000': 37500,
    '50000-plus': 75000,
  },
};

export const Q11 = {
  'under-25k': 12500,
  '25k-100k': 62500,
  '100k-250k': 175000,
  '250k-500k': 375000,
  '500k-1m': 750000,
  '1m-2.5m': 1750000,
  'over-2.5m': 3500000,
  'no-email': 0, // → RPS = 0
};

/** Parse a manual-entry string; percent inputs come in as 0–100 → decimal. */
function parseManual(raw, kind) {
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
  if (!isFinite(n)) return null;
  return kind === 'percent' ? n / 100 : n;
}

/**
 * Turn the raw quiz answers + manual values into the numeric inputs the
 * calculator needs. `path` = 'plg' | 'slg'. Returns null field where an
 * answer is missing.
 */
export function resolveInputs(answers, manualValues, path) {
  const man = (qid, kind) =>
    answers[qid] === 'manual' ? parseManual(manualValues[qid], kind) : undefined;

  // Q7 monthly visitors
  const q7 =
    man('q7a', 'number') ??
    (answers.q7a === 'dont-track' ? Q7['dont-track'] : Q7[answers.q7a]);

  // Q2 annual revenue
  const q2 = Q2[answers.q2a];

  // Q8 new subscribers/month (don't track → 10% of Q7)
  let q8 = man('q8', 'number');
  if (q8 === undefined) {
    q8 = answers.q8 === 'dont-track' ? (q7 != null ? q7 * 0.1 : null) : Q8[answers.q8];
  }

  // Q9a lead rate (path-specific)
  const q9a =
    man('q9a', 'percent') ??
    (Q9A[path] ? Q9A[path][answers.q9a] : undefined);

  // Q9b close rate
  const q9b = man('q9b', 'percent') ?? Q9B[answers.q9b];

  // Q10 order value / deal size (path-specific)
  const q10 =
    man('q10', 'currency') ??
    (Q10[path] ? Q10[path][answers.q10] : undefined);

  // Q11 email revenue (annual)
  const q11 = man('q11', 'currency') ?? Q11[answers.q11];

  // Ad module (conditional)
  const q7b = man('q7b', 'currency') ?? Q7B[answers.q7b];
  // Skipped Q7C on the ads path → doc default 0.50 (+ adjustable results
  // slider, same as "Not sure"). Off the ads path it stays undefined.
  const q7c =
    answers.q7c != null ? Q7C[answers.q7c] : q7b != null ? 0.5 : undefined;

  return { q2, q7, q7b, q7c, q8, q9a, q9b, q10, q11 };
}
