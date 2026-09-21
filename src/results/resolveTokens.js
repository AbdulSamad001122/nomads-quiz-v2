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
    // "But… what if you did?" — max-benchmark gain (Logic Doc capped maths;
    // display rounds money to the nearest $100).
    // Yemi ruling (2026-09-15, Q3): the DISPLAYED figure caps at the page's
    // own $1.5M promise — 77% of takers landed above it, half above 10× their
    // own revenue. Raw maths and the Kit tag stay untouched. Blocks 5/6 only
    // fire below $1.5M, so the capped form only ever renders in the
    // "what if you did" headline.
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
  return metricRows(result).some((row) => row.colour === 'red');
}

/** Replace every {{token}} in a copy string with its resolved value. */
export function fill(str, tokens) {
  return str.replace(/\{\{(\w+)\}\}/g, (m, key) => tokens[key] ?? m);
}
