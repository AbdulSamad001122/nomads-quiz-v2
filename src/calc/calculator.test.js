/**
 * Calculator verification — run: node src/calc/calculator.test.js
 * Reproduces the doc's worked test fixture EXACTLY, then exercises edge cases
 * and invariants. Any FAIL exits non-zero.
 */
import { calculate, runImprovementLoop, metricColour, CEILINGS } from './calculator.js';
import { resolveInputs } from './backendValues.js';
import { validateManual, impossibleCheck } from './validation.js';

let pass = 0,
  fail = 0;
const results = [];
function ok(name, cond, extra = '') {
  if (cond) {
    pass++;
    results.push(`  PASS  ${name}`);
  } else {
    fail++;
    results.push(`  FAIL  ${name}${extra ? '  →  ' + extra : ''}`);
  }
}
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;

/* =========================================================
   1 · THE DOC'S WORKED TEST FIXTURE (Quiz Logics.docx)
   Q7=30,000 · Q2=$810,000 · Q7b=$17,500 · Q7c=0.65
   ========================================================= */
{
  // Full input set; the fixture pins the RPV + ad numbers (independent of
  // Q8–Q11), so the funnel inputs below are plausible fillers.
  const inputs = {
    q2: 810000,
    q7: 30000,
    q7b: 17500,
    q7c: 0.65,
    q8: 3000,
    q9a: 0.03,
    q9b: 0.375,
    q10: 3500,
    q11: 175000,
  };
  const r = calculate(inputs, 'slg');

  ok('fixture · annualVisitors = 360,000', r.annualVisitors === 360000, r.annualVisitors);
  ok('fixture · currentRPV = 2.25', near(r.currentRPV, 2.25), r.currentRPV);
  ok('fixture · additionalRPVNeeded ≈ 4.1667', near(r.additionalRPVNeeded, 4.166667, 1e-4), r.additionalRPVNeeded);
  ok('fixture · goalRPV ≈ 6.4167', near(r.goalRPV, 6.416667, 1e-4), r.goalRPV);

  const ad = r.ad.display;
  ok('fixture · ad visitors = 19,500', ad.adVisitors === 19500, ad.adVisitors);
  ok('fixture · current ad rev = $43,900', ad.currentAdRev === 43900, ad.currentAdRev);
  ok('fixture · goal ad rev = $125,100', ad.goalAdRev === 125100, ad.goalAdRev);
  ok('fixture · monthly gain = $81,200', ad.monthlyGain === 81200, ad.monthlyGain);
  ok('fixture · annual gain = $975,000', ad.annualGain === 975000, ad.annualGain);
  ok('fixture · current ROAS = 2.5×', ad.currentROAS === 2.5, ad.currentROAS);
  ok('fixture · goal ROAS = 7.2×', ad.goalROAS === 7.2, ad.goalROAS);
}

/* =========================================================
   2 · IMPROVEMENT-LOOP INVARIANTS
   ========================================================= */
{
  // Goal reached case: big traffic → max revenue ≫ target
  const inputs = { q2: 810000, q7: 150000, q7b: null, q7c: undefined, q8: 15000, q9a: 0.05, q9b: 0.4, q10: 500, q11: 300000 };
  const r = calculate(inputs, 'plg');
  ok('loop · big traffic reaches goal (Block 4)', r.goalReached && r.cappedBlock === 4);
  ok('loop · goal metrics ≥ current', r.goal.optIn >= r.current.optIn && r.goal.rps >= r.current.rps && r.goal.lead >= r.current.lead && r.goal.close >= r.current.close);
  ok('loop · goal metrics ≤ ceilings', r.goal.optIn <= CEILINGS.optIn + 1e-9 && r.goal.rps <= CEILINGS.rps + 1e-9 && r.goal.close <= CEILINGS.close + 1e-9 && r.goal.lead <= CEILINGS.leadPlg + 1e-9);
  const rev = r.annualVisitors * r.goal.optIn * r.goal.rps + r.nonListRevenue;
  ok('loop · revenue(goal) ≥ target when reached', rev >= r.targetRevenue - 1);

  // Determinism
  const r2 = calculate(inputs, 'plg');
  ok('loop · deterministic', JSON.stringify(r.goal) === JSON.stringify(r2.goal));
}

/* =========================================================
   3 · goalReached ⟺ achievableGainRaw ≥ 1.5M (consistency)
   ========================================================= */
{
  const scenarios = [
    { q7: 7500, q2: 810000, q11: 62500 }, // annualV=90k → 30*90k−62.5k=2.64M ≥1.5M → reached
    { q7: 4000, q2: 270000, q11: 62500 }, // annualV=48k → 1.44M−62.5k=1.3775M <1.5M → capped
    { q7: 30000, q2: 2100000, q11: 1750000 }, // annualV=360k → 10.8M−1.75M=9.05M ≥1.5M → reached
  ];
  for (const s of scenarios) {
    const inputs = { q2: s.q2, q7: s.q7, q7b: null, q7c: undefined, q8: s.q7 * 0.1, q9a: 0.03, q9b: 0.375, q10: 175, q11: s.q11 };
    const r = calculate(inputs, 'plg');
    const achievableRaw = r.annualVisitors * r.capped.maxRPV - r.currentAnnualRevenue;
    const expectReached = achievableRaw >= 1500000 - 1e-3;
    ok(`consistency · Q7=${s.q7} reached=${r.goalReached} matches achievableGain`, r.goalReached === expectReached, `raw=${Math.round(achievableRaw)}`);
  }
}

/* =========================================================
   4 · BLOCK SELECTION
   ========================================================= */
{
  // No email → Block 3, and (Yemi ruling 2026-09-15, Q1) RPS grows from $0 to
  // the $50 benchmark — so with this much traffic the goal is reached and the
  // old "maximised every metric next to RPS $0" contradiction is gone.
  const noEmail = calculate({ q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 0 }, 'plg');
  ok('block · no-email → noEmail flag + rps=0', noEmail.noEmail && noEmail.current.rps === 0);
  ok('yemi Q1 · no-email goal RPS = $50 benchmark', noEmail.goal.rps === 50, `goal.rps=${noEmail.goal.rps}`);
  ok('yemi Q1 · no-email with real traffic reaches goal (Block 4)', noEmail.cappedBlock === 4, `block=${noEmail.cappedBlock}`);

  // Yemi ruling Q4: any metric at 0 grows to its ceiling (0 × 1.1 stuck it
  // at 0 forever and span the loop into the safety guard).
  const zeroClose = calculate({ q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0, q10: 175, q11: 175000 }, 'plg');
  ok('yemi Q4 · close rate 0 → goal is the 75% ceiling', zeroClose.goal.close === 0.75, `goal.close=${zeroClose.goal.close}`);
  const zeroOptIn = calculate({ q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 0, q9a: 0.03, q9b: 0.375, q10: 175, q11: 0 }, 'plg');
  ok('yemi Q4 · opt-in 0 → goal is the 60% ceiling', zeroOptIn.goal.optIn === 0.6, `goal.optIn=${zeroOptIn.goal.optIn}`);

  // Block 7 → achievableGain ≤ 0 (high email rev, low traffic)
  const b7 = calculate({ q2: 2100000, q7: 4000, q7b: null, q7c: undefined, q8: 400, q9a: 0.03, q9b: 0.375, q10: 175, q11: 1750000 }, 'plg');
  // 30*48000 − 1.75M = 1.44M − 1.75M = −310k ≤ 0
  ok('block · Block 7 when achievableGain ≤ 0', b7.cappedBlock === 7, `block=${b7.cappedBlock}`);
  ok('block · Block 7 suppresses low-path (Block 2)', b7.lowPathShare === false);

  // Block 5 → small qualifying biz, gain positive, within reach
  const b5 = calculate({ q2: 270000, q7: 4000, q7b: null, q7c: undefined, q8: 400, q9a: 0.03, q9b: 0.375, q10: 175, q11: 62500 }, 'plg');
  ok('block · small biz → Block 5 (capped, within reach)', b5.cappedBlock === 5, `block=${b5.cappedBlock}`);
  ok('block · Block 5 achievableGain > 0', b5.capped.achievableGain > 0);
  ok('block · Block 5 remainingGap > 0', b5.capped.remainingGap > 0);
  ok('block · Block 5 not gap-closed', b5.capped.gapClosedByMetrics === false);
  ok('block · Block 5 daily visitors > 0', b5.capped.additionalDailyVisitors > 0);

  // No-email big traffic → gain over-clears $1.5M → remainingGap floored at 0
  const b5closed = calculate({ q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 0 }, 'plg');
  ok('block · no-email big traffic → remainingGap floored at 0', b5closed.capped.remainingGap === 0);
  ok('block · no-email → gapClosedByMetrics true', b5closed.capped.gapClosedByMetrics === true);
  ok('block · no-email → achievableGain never negative', b5closed.capped.achievableGain >= 0);
}

/* =========================================================
   5 · BLOCK 1 revenue split
   ========================================================= */
{
  const r = calculate({ q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 162000 }, 'plg');
  // email path revenue == Q11 == 162,000; % of 810,000 = 20% → round5 = 20
  ok('block1 · emailPathRevenue == Q11', near(r.block1.emailPathRevenue, 162000, 1e-3), r.block1.emailPathRevenue);
  ok('block1 · emailPercentage = 20', r.block1.emailPercentage === 20, r.block1.emailPercentage);
  ok('block1 · otherRevenue = 648,000', near(r.block1.otherRevenue, 648000, 1e-3), r.block1.otherRevenue);
  ok('block1 · not suppressed', r.block1.splitSuppressed === false);
}

/* =========================================================
   6 · METRIC COLOURS
   ========================================================= */
{
  ok('colour · opt-in 60% green', metricColour('optIn', 0.6, 'plg') === 'green');
  ok('colour · opt-in 17% red', metricColour('optIn', 0.17, 'plg') === 'red');
  ok('colour · opt-in 30% yellow', metricColour('optIn', 0.3, 'plg') === 'yellow');
  ok('colour · lead PLG 30% green', metricColour('lead', 0.3, 'plg') === 'green');
  ok('colour · lead SLG 22% green', metricColour('lead', 0.22, 'slg') === 'green');
  ok('colour · lead SLG 6% red', metricColour('lead', 0.06, 'slg') === 'red');
  ok('colour · close 75% green', metricColour('close', 0.75, 'plg') === 'green');
  ok('colour · rps $50 green', metricColour('rps', 50, 'plg') === 'green');
  ok('colour · rps $10 red', metricColour('rps', 10, 'plg') === 'red');
  ok('colour · rps $30 yellow', metricColour('rps', 30, 'plg') === 'yellow');
}

/* =========================================================
   7 · resolveInputs (answer ids → backend values)
   ========================================================= */
{
  const answers = {
    q2a: '35k-100k', q7a: '10001-50000', q8: '1000-5000',
    q9a: '1-5', q9b: '25-50', q10: '2000-5000', q11: '100k-250k',
    q6: ['paid-ads'], q7b: '10k-25k', q7c: '56-75',
  };
  const inp = resolveInputs(answers, {}, 'slg');
  ok('resolve · q2 = 810,000', inp.q2 === 810000, inp.q2);
  ok('resolve · q7 = 30,000', inp.q7 === 30000, inp.q7);
  ok('resolve · q8 = 3,000', inp.q8 === 3000, inp.q8);
  ok('resolve · q9a SLG 1-5 = 0.03', inp.q9a === 0.03, inp.q9a);
  ok('resolve · q10 SLG 2000-5000 = 3,500', inp.q10 === 3500, inp.q10);
  ok('resolve · q11 = 175,000', inp.q11 === 175000, inp.q11);
  ok('resolve · q7b = 17,500', inp.q7b === 17500, inp.q7b);
  ok('resolve · q7c = 0.65', inp.q7c === 0.65, inp.q7c);

  // SLG 15+ caps at 0.22, PLG 15+ = 0.175
  ok('resolve · q9a SLG 15+ caps 0.22', resolveInputs({ q9a: '15-plus' }, {}, 'slg').q9a === 0.22);
  ok('resolve · q9a PLG 15+ = 0.175', resolveInputs({ q9a: '15-plus' }, {}, 'plg').q9a === 0.175);

  // don't-track defaults
  ok('resolve · q7 dont-track = 10,000', resolveInputs({ q7a: 'dont-track' }, {}, 'plg').q7 === 10000);
  ok('resolve · q8 dont-track = 10% of Q7', resolveInputs({ q7a: '10001-50000', q8: 'dont-track' }, {}, 'plg').q8 === 3000);

  // manual override (percent → decimal)
  ok('resolve · q9a manual 12.5% → 0.125', near(resolveInputs({ q9a: 'manual' }, { q9a: '12.5' }, 'plg').q9a, 0.125));
  ok('resolve · q7 manual 42000', resolveInputs({ q7a: 'manual' }, { q7a: '42000' }, 'plg').q7 === 42000);

  // skipped q7c → undefined (no ad section)
  ok('resolve · q7c skipped = undefined', resolveInputs({ q6: [] }, {}, 'plg').q7c === undefined);
}

/* =========================================================
   8 · VALIDATION
   ========================================================= */
{
  ok('valid · q7 42000 ok', validateManual('q7a', '42000').ok);
  ok('valid · q7 0 rejected (min 1)', !validateManual('q7a', '0').ok);
  ok('valid · q7 12.5 rejected (integer)', !validateManual('q7a', '12.5').ok);
  ok('valid · q9a 150 rejected (max 100)', !validateManual('q9a', '150').ok);
  ok('valid · q10 0 rejected (min 0.01)', !validateManual('q10', '0').ok);
  ok('valid · q10 250.50 ok', validateManual('q10', '250.50').ok);

  ok('impossible · subs ≥ visitors trips', impossibleCheck('q8', { q7: 5000, q8: 6000 })?.id === 'subs-gt-visitors');
  ok('impossible · subs < visitors ok', impossibleCheck('q8', { q7: 5000, q8: 3000 }) === null);
  ok('impossible · email > total trips', impossibleCheck('q11', { q2: 270000, q11: 300000 })?.id === 'email-gt-total');
  ok('impossible · email ≤ total ok', impossibleCheck('q11', { q2: 810000, q11: 162000 }) === null);
}

/* =========================================================
   9 · KIT TAG SHAPE
   ========================================================= */
{
  const r = calculate({ q2: 810000, q7: 30000, q7b: 17500, q7c: 0.65, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 3500, q11: 175000 }, 'slg');
  ok('tags · current_rpv = 2.25', r.tags.current_rpv === 2.25, r.tags.current_rpv);
  ok('tags · goal_rpv = 6.42', r.tags.goal_rpv === 6.42, r.tags.goal_rpv);
  ok('tags · required_lift is whole %', Number.isInteger(r.tags.required_lift));
  ok('tags · capped_block set', [4, 5, 6, 7].includes(r.tags.capped_block));
}

/* =========================================================
   REPORT
   ========================================================= */
console.log('\n' + results.join('\n'));
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
