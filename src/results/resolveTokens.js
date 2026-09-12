import { money, rpvMoney } from '../calc/rounding.js';
import { metricColour } from '../calc/calculator.js';

/**
 * Single bridge between the calculator result and the page copy: every
 * {{token}} from Result Page Copy.docx resolves here. Sections never touch
 * raw calculator fields directly.
 */
export function resolveTokens(result) {
  return {
    current_annual_revenue: money(result.inputs.q2),
    annual_visitors: (result.inputs.q7 * 12).toLocaleString('en-US'),
    current_rpv: rpvMoney(result.currentRPV),
    goal_rpv: rpvMoney(result.goalRPV),
    // "But… what if you did?" — max-benchmark gain (Logic Doc capped maths;
    // display rounds money to the nearest $100).
    achievable_gain: money(result.capped.achievableGain),
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

/** Replace every {{token}} in a copy string with its resolved value. */
export function fill(str, tokens) {
  return str.replace(/\{\{(\w+)\}\}/g, (m, key) => tokens[key] ?? m);
}
