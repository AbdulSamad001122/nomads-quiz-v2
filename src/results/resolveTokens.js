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
    // Max-benchmark gain (Logic Doc capped maths). Two display forms:
    //
    // Blocks 5/6 (fire only below $1.5M) need the real figure — their copy
    // continues "You're still {{remaining_gap}} short of $1.5M" — so this
    // token stays the exact money, rounded to the nearest $100 per the doc.
    achievable_gain: money(result.capped.achievableGain),
    // "But… what if you did?" headline — the Logic Doc's "Display Rule for
    // Achievable Gain" (Yemi, Sep 26; re-confirmed to Samad on Slack Sep 29;
    // REVERSES the Sep-15 Q3 cap): above $1.5M shows the exact number in the
    // promise's own M-style (the rule's example: "$2.3M/year"), at or under
    // shows "$1.5M+". Raw maths and the Kit tag stay untouched.
    achievable_gain_headline:
      result.capped.achievableGain > 1_500_000
        ? gainM(result.capped.achievableGain)
        : '$1.5M+',
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

/* the promise's own "$1.5M" style: one decimal, no trailing .0 ("$2.3M",
   "$14.8M", "$2M") — the format of the display rule's example */
const gainM = (x) => `$${(Math.round(x / 100_000) / 10).toFixed(1).replace(/\.0$/, '')}M`;

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
