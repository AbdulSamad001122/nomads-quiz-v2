import ResultsPage from './results/ResultsPage.jsx';
import { calculate } from './calc/calculator.js';

/**
 * Dev-only harness to preview the results page in different states without
 * walking the whole quiz. Reached via ?results=<scenario>.
 *
 * Every conditional case in Quiz Logics.docx · "Results-page logic" has a
 * scenario here, so each one can be opened and reviewed on its own:
 *
 *   Blocks 1–3  revenue split      → split-*
 *   Blocks 4–7  capped outcome     → capped*
 *   Section 7   ad-spend module    → ad-*
 *
 * `blocks` on each entry records what it renders — verified by running the
 * calculator, not by eye. Keep it in step if the inputs ever change.
 */
const SCENARIOS = {
  /* ——— Blocks 1–3 · the revenue-split paragraph ——— */

  // Block 1 alone: 20% of revenue runs through the five metrics.
  'split-normal': {
    blocks: '1 + 4',
    path: 'plg',
    inputs: { q2: 60000, q7: 7500, q7b: null, q7c: undefined, q8: 500, q9a: 0.005, q9b: 0.05, q10: 25, q11: 12500 },
  },
  // Block 2 fires: share is under 5%, so the "too much of your revenue is
  // unpredictable" warning renders under the split.
  'split-low': {
    blocks: '1(small) + 2 + 4',
    path: 'plg',
    inputs: { q2: 810000, q7: 7500, q7b: null, q7c: undefined, q8: 500, q9a: 0.005, q9b: 0.05, q10: 25, q11: 12500 },
  },
  // Block 3 fires: no email revenue at all, so RPS is $0. Yemi ruling Q1:
  // RPS grows to the $50 benchmark, so this taker now reaches the goal —
  // Block 4, no capped card. Block 1 renders the "less than 5%" wording (Q5).
  'split-noemail': {
    blocks: '1(small) + 3 + 4',
    path: 'plg',
    inputs: { q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 0 },
  },
  // Block 1 suppressed: email revenue exceeds total revenue, so the split
  // would be nonsense and the paragraph is dropped entirely.
  'split-hidden': {
    blocks: '7 only (Block 1 hidden)',
    path: 'plg',
    inputs: { q2: 810000, q7: 1000, q7b: null, q7c: undefined, q8: 500, q9a: 0.005, q9b: 0.05, q10: 25, q11: 900000 },
  },

  /* ——— no conditional blocks at all ——— */

  // The clean page: both conditional slots render nothing, so what's left is
  // the page every taker shares. Needs Block 1 suppressed (email revenue >
  // total revenue, which also puts the share over 5% so Block 2 can't fire,
  // and keeps RPS above 0 so Block 3 can't either) AND the goal reached, which
  // is Block 4 — the one capped case with no copy of its own.
  // Carries the ad answers too, so the ad calculator is on screen — the blocks
  // and the ad module are independent, so this stays block-free either way.
  'no-blocks': {
    blocks: 'none — both slots empty, ad module shown',
    path: 'plg',
    inputs: { q2: 60000, q7: 7500, q7b: 17500, q7c: 0.5, q8: 375, q9a: 0.03, q9b: 0.375, q10: 175, q11: 63000 },
    adAdjustable: true,
  },

  /* ——— Blocks 4–7 · the capped-state outcome ——— */

  // Block 4: goal reached. Doc says standard page, no capped-state copy — so
  // this slot renders nothing at all.
  capped4: {
    blocks: '1 + 4 (nothing renders)',
    path: 'plg',
    inputs: { q2: 60000, q7: 7500, q7b: null, q7c: undefined, q8: 500, q9a: 0.005, q9b: 0.05, q10: 25, q11: 12500 },
  },
  // Block 5: metrics maxed, still short — and the extra traffic is reachable.
  capped5: {
    blocks: '1 + 5',
    path: 'plg',
    inputs: { q2: 270000, q7: 4000, q7b: null, q7c: undefined, q8: 400, q9a: 0.03, q9b: 0.375, q10: 175, q11: 62500 },
  },
  // Block 6: metrics maxed, still short, and the traffic needed is out of
  // reach. Only reachable with a very small visitor count (manual entry).
  capped6: {
    blocks: '1 + 6',
    path: 'plg',
    inputs: { q2: 60000, q7: 20, q7b: null, q7c: undefined, q8: 1, q9a: 0.005, q9b: 0.05, q10: 25, q11: 6000 },
  },
  // Block 7: nothing left to gain from the five metrics.
  capped7: {
    blocks: '1 + 7',
    path: 'plg',
    inputs: { q2: 2100000, q7: 4000, q7b: null, q7c: undefined, q8: 400, q9a: 0.03, q9b: 0.375, q10: 175, q11: 1750000 },
  },

  /* ——— Section 7 · the ad-spend module ——— */

  // Q7c never answered → no ad section anywhere on the page.
  'ad-none': {
    blocks: '1 + 4 · no ad module',
    path: 'plg',
    inputs: { q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 175000 },
  },
  // Q7c answered with a real bracket (56–75%) → module, no slider. This is the
  // doc's worked fixture: 19,500 ad visitors, 2.5× → 7.2×, +$81,200/mo.
  'ad-fixed': {
    blocks: '1 + 4 · ad module, fixed share',
    path: 'slg',
    inputs: { q2: 810000, q7: 30000, q7b: 17500, q7c: 0.65, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 3500, q11: 175000 },
  },
  // Q7c = "Not sure" → module starts at 50% with the adjustable share slider.
  'ad-slider': {
    blocks: '1 + 4 · ad module + slider',
    path: 'plg',
    inputs: { q2: 810000, q7: 30000, q7b: 17500, q7c: 0.5, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 175000 },
    adAdjustable: true,
  },
  // Manual ad spend of $0 → ROAS has no ratio to show; both cells render an em
  // dash rather than "Infinity×".
  'ad-zero': {
    blocks: '1 + 4 · ad module, $0 spend',
    path: 'plg',
    inputs: { q2: 810000, q7: 30000, q7b: 0, q7c: 0.65, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 175000 },
  },

  /* ——— original scenario names, kept so existing links still work ——— */
  fixture: { blocks: '1 + 4 · ad module', path: 'slg', inputs: { q2: 810000, q7: 30000, q7b: 17500, q7c: 0.65, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 3500, q11: 175000 } },
  capped: { blocks: '1 + 5', path: 'plg', inputs: { q2: 270000, q7: 4000, q7b: null, q7c: undefined, q8: 400, q9a: 0.03, q9b: 0.375, q10: 175, q11: 62500 } },
  noemail: { blocks: '1(small) + 3 + 4', path: 'plg', inputs: { q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 0 } },
  adslider: { blocks: '1 + 4 · ad module + slider', path: 'plg', inputs: { q2: 810000, q7: 30000, q7b: 17500, q7c: 0.5, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 175000 }, adAdjustable: true },
};

export { SCENARIOS };

/**
 * Bare `?results` (and any unknown name) lands on the clean page — neither
 * conditional slot renders, so what's left is what every taker shares.
 * Named scenarios below it show one conditional case each.
 */
export default function DevResults({ scenario }) {
  const cfg = SCENARIOS[scenario] || SCENARIOS['no-blocks'];
  const result = calculate(cfg.inputs, cfg.path);
  return <ResultsPage result={result} onBack={() => {}} adAdjustable={!!cfg.adAdjustable} />;
}
