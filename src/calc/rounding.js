/**
 * Display rounding helpers (Quiz Logics.docx · Rounding rules).
 * NOTE: rounding is DISPLAY ONLY — never round inside the improvement loop.
 */

export const round100 = (x) => Math.round(x / 100) * 100; // money → nearest $100
export const round5 = (x) => Math.round(x / 5) * 5; // percentages → nearest 5 (Block 1)
export const roundVisitors100 = (x) => Math.round(x / 100) * 100; // visitors → nearest 100
export const rpv2 = (x) => Math.round(x * 100) / 100; // RPV → 2 dp
export const pctWhole = (x) => Math.round(x * 100); // rate (0–1) → whole %
export const roas1 = (x) => Math.round(x * 10) / 10; // ROAS → 1 dp

/** "$1,234,500" style money for display. */
export const money = (x) => '$' + round100(x).toLocaleString('en-US');

/** "$2.25" RPV display (always 2 dp). */
export const rpvMoney = (x) => '$' + rpv2(x).toFixed(2);

/**
 * Daily-visitor display. The doc says "visitors → nearest 100", but a daily
 * figure is often small (e.g. ~10/day), and nearest-100 would floor it to a
 * nonsensical 0. So: round to nearest 100 only once the number is big enough
 * for that to make sense; below that, show the real whole number (min 1).
 */
export const dailyVisitors = (x) =>
  x <= 0 ? 0 : x >= 100 ? roundVisitors100(x) : Math.max(1, Math.round(x));
