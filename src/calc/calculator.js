/**
 * The RPV™ calculator (Quiz Logics.docx · The calculator + Results-page logic).
 *
 * Runs silently on the quiz answers and produces every number the results
 * page and Kit push need. Pure functions, deterministic — same inputs always
 * give the same output. No rounding happens in here except where the doc
 * explicitly says "display only" (those live on the `display` sub-object).
 */

import { round100, round5, rpv2, roas1, dailyVisitors } from './rounding.js';

export const CEILINGS = {
  optIn: 0.6,
  leadPlg: 0.3,
  leadSlg: 0.22,
  close: 0.75,
  rps: 50,
};

const TARGET_EXTRA = 1_500_000;

/**
 * @param inputs { q2, q7, q7b, q7c, q8, q9a, q9b, q10, q11 } numeric backend values
 * @param path   'plg' | 'slg'
 */
export function calculate(inputs, path) {
  const { q2, q7, q8, q9a, q9b, q10, q11, q7b, q7c } = inputs;

  const leadCeiling = path === 'plg' ? CEILINGS.leadPlg : CEILINGS.leadSlg;

  /* ---------- 2 · Current numbers ---------- */
  const annualVisitors = q7 * 12;
  const currentAnnualRevenue = q2; // already annual — no ×12
  const currentRPV = currentAnnualRevenue / annualVisitors;

  const optInRate = q8 / q7;
  const annualSubscribers = annualVisitors * optInRate; // = q8 * 12
  const leadRate = q9a;
  const closeRate = q9b;
  const orderValue = q10;
  const rps = annualSubscribers > 0 ? q11 / annualSubscribers : 0;

  const current = { optIn: optInRate, lead: leadRate, close: closeRate, rps };

  /* ---------- 3 · The goal ---------- */
  const targetRevenue = currentAnnualRevenue + TARGET_EXTRA;
  const additionalRPVNeeded = TARGET_EXTRA / annualVisitors;
  const goalRPV = currentRPV + additionalRPVNeeded;

  /* ---------- 5 · The improvement loop ---------- */
  // Only opt-in × RPS drive revenue; lead & close are improved for display.
  const currentListRevenue = annualSubscribers * rps; // == q11
  const nonListRevenue = currentAnnualRevenue - currentListRevenue;

  const ceil = { optIn: CEILINGS.optIn, lead: leadCeiling, close: CEILINGS.close, rps: CEILINGS.rps };
  const loop = runImprovementLoop(current, ceil, targetRevenue, annualVisitors, nonListRevenue);
  const goal = loop.metrics;
  const goalReached = loop.reached;

  /* ---------- Results-page logic ---------- */
  // Block 1 — revenue split
  const emailPathRevenue = annualSubscribers * rps; // == q11
  const otherRevenue = currentAnnualRevenue - emailPathRevenue;
  const splitSuppressed = otherRevenue < 0;
  const emailPercentage = round5((emailPathRevenue / currentAnnualRevenue) * 100);

  // Capped-state maths (Blocks 5–7) — always computed; used only when !goalReached
  const maxRPV =
    (annualVisitors * CEILINGS.optIn * CEILINGS.rps + nonListRevenue) / annualVisitors;
  const achievableGainRaw = annualVisitors * maxRPV - currentAnnualRevenue;
  const achievableGain = Math.max(0, achievableGainRaw);
  // Guard: the achievable gain can already exceed $1.5M (e.g. a business with
  // no email at all — building it to benchmark over-clears the goal), so floor
  // the remaining gap at 0 rather than letting it go negative.
  const remainingGap = Math.max(0, TARGET_EXTRA - achievableGain);
  const gapClosedByMetrics = remainingGap === 0; // maxing the funnel already clears $1.5M
  const additionalAnnualVisitors = remainingGap > 0 ? remainingGap / maxRPV : 0;
  const additionalDailyVisitors = additionalAnnualVisitors / 365;
  const trafficWithinReach = additionalAnnualVisitors <= 20 * annualVisitors;

  // Which block fires for the 4/5/6/7 slot
  let cappedBlock;
  if (goalReached) cappedBlock = 4;
  else if (achievableGainRaw <= 0) cappedBlock = 7;
  else if (trafficWithinReach) cappedBlock = 5;
  else cappedBlock = 6;

  const cappedState = cappedBlock >= 5;

  // Block 2/3
  const noEmail = rps === 0;
  const lowPathShare = emailPercentage < 5 && !noEmail && cappedBlock !== 7;

  /* ---------- 7 · Ad-spend module (only if Q7c answered) ---------- */
  const ad =
    q7c != null && q7b != null
      ? computeAdModule({ q7, q7b, share: q7c, currentRPV, goalRPV, additionalRPVNeeded })
      : null;

  /* ---------- Required lift ---------- */
  const requiredLift = (goalRPV - currentRPV) / currentRPV; // == additionalRPV / currentRPV

  return {
    path,
    inputs,
    annualVisitors,
    annualSubscribers,
    currentAnnualRevenue,
    currentRPV,
    goalRPV,
    additionalRPVNeeded,
    requiredLift,
    targetRevenue,
    nonListRevenue,
    orderValue,
    ceilings: ceil,
    current,
    goal,
    goalReached,

    // results blocks
    block1: { emailPathRevenue, otherRevenue, emailPercentage, splitSuppressed },
    noEmail,
    lowPathShare,
    cappedState,
    cappedBlock,
    capped: {
      maxRPV,
      achievableGain,
      remainingGap,
      additionalDailyVisitors,
      trafficWithinReach,
      gapClosedByMetrics,
    },
    ad,

    // Kit-ready computed tags
    tags: {
      current_rpv: rpv2(currentRPV),
      goal_rpv: rpv2(goalRPV),
      required_lift: Math.round(requiredLift * 100), // whole %
      // Kit handover doc (Sep 23): "Required Lift in $$" — the same lift as
      // a per-visitor dollar amount (goalRPV − currentRPV), the doc's
      // "$4.17 more per visitor" figure. Separate field per Nomads' ruling
      // so the % field stays untouched for any existing automations.
      required_lift_amount: rpv2(goalRPV - currentRPV),
      capped_state: cappedState,
      capped_block: cappedBlock,
      achievable_gain: cappedState ? round100(achievableGain) : null,
      remaining_gap: cappedState ? round100(remainingGap) : null,
      additional_daily_visitors: cappedState ? dailyVisitors(additionalDailyVisitors) : null,
      split_suppressed: splitSuppressed,
    },
  };
}

/**
 * Ad-spend module maths (Quiz Logics.docx · 7). Reusable so the "Not sure"
 * results slider can recompute live as the ad-traffic share changes.
 */
export function computeAdModule({ q7, q7b, share, currentRPV, goalRPV, additionalRPVNeeded }) {
  const adVisitors = q7 * share; // monthly
  const currentAdRev = adVisitors * currentRPV;
  const goalAdRev = adVisitors * goalRPV;
  const currentAdRevD = round100(currentAdRev);
  const goalAdRevD = round100(goalAdRev);
  // ROAS divides by spend. Every Q7b bracket is positive, but manual entry can
  // still land on 0 — without this guard both cells render "Infinity×".
  // null means "no ROAS to show"; the section renders an em dash.
  const spendOk = Number.isFinite(q7b) && q7b > 0;
  return {
    monthlySpend: q7b,
    share,
    adVisitors,
    currentAdRev,
    goalAdRev,
    display: {
      adVisitors: Math.round(adVisitors),
      currentAdRev: currentAdRevD,
      goalAdRev: goalAdRevD,
      monthlyGain: goalAdRevD - currentAdRevD,
      annualGain: round100(adVisitors * additionalRPVNeeded * 12),
      currentROAS: spendOk ? roas1(currentAdRev / q7b) : null,
      goalROAS: spendOk ? roas1(goalAdRev / q7b) : null,
    },
  };
}

/**
 * Round-robin improvement loop (Quiz Logics.docx · 5). Raises one metric at a
 * time (×1.1) in fixed order until revenue reaches the target or every metric
 * is capped. Deterministic. Only opt-in × RPS change revenue; lead & close are
 * raised for the goal display.
 */
export function runImprovementLoop(current, ceil, targetRevenue, annualVisitors, nonListRevenue) {
  const m = { optIn: current.optIn, lead: current.lead, close: current.close, rps: current.rps };
  const frozen = { optIn: false, lead: false, close: false, rps: false };

  // Before the loop: cap-and-freeze anything already at/above its ceiling.
  // The loop models improvement toward the benchmark ceilings, so revenue is
  // judged against the capped values (keeps "goal reached" consistent with the
  // capped-state maths). The DISPLAYED goal is clamped back up to current
  // below (clampGoal), honouring "a goal is never returned below current".
  for (const k of ['optIn', 'lead', 'close', 'rps']) {
    if (m[k] >= ceil[k]) {
      m[k] = ceil[k];
      frozen[k] = true;
    }
  }
  const revenue = () => annualVisitors * m.optIn * m.rps + nonListRevenue;

  const clampGoal = () => {
    const g = { ...m };
    for (const k of ['optIn', 'lead', 'close', 'rps']) g[k] = Math.max(g[k], current[k]);
    return g;
  };

  if (revenue() >= targetRevenue) return { metrics: clampGoal(), reached: true };

  const order = ['close', 'lead', 'optIn', 'rps'];
  const allFrozen = () => order.every((k) => frozen[k]);

  let guard = 0;
  while (!allFrozen()) {
    if (++guard > 100000) break; // safety — never expected to trip
    for (const k of order) {
      if (frozen[k]) continue;
      // Yemi ruling (2026-09-15, Q1 + Q4): a metric at 0 grows to its
      // benchmark ceiling — "if they were doing it, they could earn the
      // benchmark". ×1.1 can't grow 0, so the first pass jumps straight to
      // the ceiling. (This replaced the old RPS-freeze-at-0, which produced
      // "you've maximised every metric" beside "your RPS is $0".)
      const candidate = m[k] === 0 ? ceil[k] : m[k] * 1.1; // multiplicative: a tenth of current
      if (candidate >= ceil[k]) {
        m[k] = ceil[k];
        frozen[k] = true;
      } else {
        m[k] = candidate;
      }
      if (revenue() >= targetRevenue) return { metrics: clampGoal(), reached: true };
    }
  }

  return { metrics: clampGoal(), reached: revenue() >= targetRevenue };
}

/** Metric-table cell colour (Quiz Logics.docx · Results 1). */
export function metricColour(kind, value, path) {
  const rules = {
    optIn: { red: 0.18, green: 0.6 },
    lead: path === 'plg' ? { red: 0.09, green: 0.3 } : { red: 0.07, green: 0.22 },
    close: { red: 0.23, green: 0.75 },
    rps: { red: 15, green: 50 },
  }[kind];
  if (!rules) return 'none';
  if (value >= rules.green) return 'green';
  if (value < rules.red) return 'red';
  return 'yellow';
}
