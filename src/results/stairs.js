/**
 * Stairs graphic maths for the "Yes, {max}× sounds like a stretch" block
 * (Yemi, Cap Logic tab, Nov 4 evening): "The last step is the visitor's max.
 * Each earlier step sits at a fixed fraction of the distance between 1× and
 * the max" — 1 + f × (max − 1), f = 0 / 0.18 / 0.36 / 0.64 / 1 (copy.js
 * STOP_OR_PUSH.stairs). "Round each value to one decimal and drop '.0'".
 * "Bar heights scale to each person's max, so the last bar is always full
 * height." The max is the badge's max ÷ today (Step 8).
 */

/** Tallest bar (the visitor's max) — the old 12× bar's height. */
export const STAIRS_FULL_PX = 170;

/** "3×", "1.9×" — one decimal, ".0" dropped ("show 3×, not 3.0×") */
export const stepText = (v) => `${(Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '')}×`;

export function stairsSteps(stairs, maxMultiple) {
  return stairs.map((s) => {
    const v = 1 + s.f * (maxMultiple - 1);
    return {
      cap: s.cap,
      x: stepText(v),
      height: Math.max(14, Math.round((STAIRS_FULL_PX * v) / maxMultiple)),
    };
  });
}
