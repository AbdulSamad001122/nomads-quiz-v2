import { money, rpvMoney, dailyVisitors } from '../calc/rounding.js';
import { metricColour } from '../calc/calculator.js';

/**
 * Single bridge between the calculator result and the page copy: every
 * {{token}} from Result Page Copy.docx resolves here. Sections never touch
 * raw calculator fields directly.
 */
export function resolveTokens(result) {
  return {
    // current_annual_revenue and annual_visitors were dropped here when the
    // Sep 19 doc rewrite removed their only two render sites (hero giant
    // number, "Total traffic:" line). Recompute from result.inputs.q2 /
    // q7*12 if a future copy round brings them back.
    current_rpv: rpvMoney(result.currentRPV),
    goal_rpv: rpvMoney(result.goalRPV),
    // Hero jump chip (QC round): goal ÷ today, worked from the two values
    // as DISPLAYED so the chip always agrees with them ($4.92 / $0.75 =
    // "6.6×"). Empty when there is no real jump — the hero hides the chip.
    rpv_multiple: rpvMultiple(result.currentRPV, result.goalRPV),
    // QC row 5 — "stop at $1.5M or push all 5 metrics to their max". The max
    // uses the calculator's 12×-capped max RPV (Added Logic.docx); totals are
    // yearly revenue at today / goal / max RPV on the taker's real traffic.
    max_rpv: rpvMoney(result.capped.maxRPV),
    max_gain: moneyShort(result.capped.achievableGain),
    max_total: moneyShort(result.capped.maxRPV * result.annualVisitors),
    max_multiple: rpvMultiple(result.currentRPV, result.capped.maxRPV),
    current_total: moneyShort(result.currentAnnualRevenue),
    goal_total: moneyShort(result.currentAnnualRevenue + 1_500_000),
    // Blocks 5/6 token — UNCHANGED original behaviour (Yemi Sep-15 Q3):
    // $1.5M+ at or above the promise, exact money below. Blocks 5/6 only
    // fire below $1.5M, so in practice they always show the exact figure.
    achievable_gain:
      result.capped.achievableGain >= 1_500_000
        ? '$1.5M+'
        : money(result.capped.achievableGain),
    // Block 1 — share of revenue running through the five metrics, already
    // rounded to the nearest 5 by the calculator.
    email_percentage: String(result.block1.emailPercentage),
    // Blocks 5–6 capped maths. Money → nearest $100; the daily visitor figure
    // uses the doc's visitor rounding, floored at 1 so a small-but-real number
    // never displays as 0.
    remaining_gap: money(result.capped.remainingGap),
    additional_daily_visitors: dailyVisitors(
      result.capped.additionalDailyVisitors
    ).toLocaleString('en-US'),
  };
}

/* "$2.97M" / "$270K" — the row-5 design's short money style: millions to 2
   decimals (no trailing ".00"), thousands to the nearest $1K */
export function moneyShort(x) {
  if (!(x >= 0)) return '$0';
  if (x >= 999_500) return `$${(x / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  return `$${Math.round(x / 1000)}K`;
}

/* "6.6×" — one decimal, no trailing .0 ("3×"); '' unless the goal is a real
   step up from a real current RPV. Worked in whole cents, so an exact half
   ($23.58 / $3.60 = 6.55) rounds up to "6.6×" instead of float-slipping to
   "6.5×". */
export function rpvMultiple(current, goal) {
  const c = Math.round(current * 100);
  const g = Math.round(goal * 100);
  if (!(c > 0) || !(g > c)) return '';
  return `${(Math.round((g * 10) / c) / 10).toFixed(1).replace(/\.0$/, '')}×`;
}

const pct = (x) => `${Math.round(x * 100)}%`;
const dollars = (x) => `$${Math.round(x)}`;

/**
 * The five metric-table rows (doc order), with the doc's colour token for the
 * "current" cell ('none' | 'red' | 'yellow' | 'green'). Wording variant
 * (PLG/SLG) is chosen by the section from result.path.
 */
export function metricRows(result) {
  const r = result;
  return [
    { key: 'rpv', current: rpvMoney(r.currentRPV), goal: rpvMoney(r.goalRPV), colour: 'none' },
    { key: 'optIn', current: pct(r.current.optIn), goal: pct(r.goal.optIn), colour: metricColour('optIn', r.current.optIn, r.path) },
    { key: 'lead', current: pct(r.current.lead), goal: pct(r.goal.lead), colour: metricColour('lead', r.current.lead, r.path) },
    { key: 'close', current: pct(r.current.close), goal: pct(r.goal.close), colour: metricColour('close', r.current.close, r.path) },
    { key: 'rps', current: dollars(r.current.rps), goal: dollars(r.goal.rps), colour: metricColour('rps', r.current.rps, r.path) },
  ];
}

/**
 * Gate for the red-metrics workshop section (Updated Result Page Copy.docx,
 * comment #6). Yemi's ruling, 2026-09-21: purely "any metric-table cell shows
 * red" — capped takers included; hide only when nothing is red. The rpv row
 * never counts (colour 'none' by spec). Section renders once its design
 * lands; the gate ships tested ahead of it.
 */
export function anyMetricRed(result) {
  return redMetricRows(result).length > 0;
}

/** The red rows only, in table order — the red-metric callout's cards. */
export function redMetricRows(result) {
  return metricRows(result).filter((row) => row.colour === 'red');
}

/** Replace every {{token}} in a copy string with its resolved value. */
export function fill(str, tokens) {
  return str.replace(/\{\{(\w+)\}\}/g, (m, key) => tokens[key] ?? m);
}
