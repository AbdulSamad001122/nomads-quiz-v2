/**
 * Fuzz / robustness sweep — run: node src/calc/calculator.fuzz.js
 * Runs calculate() across a broad sample of real answer combinations and
 * asserts every output is finite and well-formed (no NaN, no crash, blocks
 * and metrics in range). Also probes hostile manual-entry edges.
 */
import { calculate, CEILINGS } from './calculator.js';
import { resolveInputs, Q2, Q7, Q7B, Q7C, Q8, Q9A, Q9B, Q10, Q11 } from './backendValues.js';

const paths = ['plg', 'slg'];
const q2Ids = Object.keys(Q2);
const q7Ids = Object.keys(Q7).filter((k) => Q7[k] !== null).concat('dont-track');
const q8Ids = Object.keys(Q8).concat('dont-track');
const q9aIds = Object.keys(Q9A.plg);
const q9bIds = Object.keys(Q9B);
const q11Ids = Object.keys(Q11);
const q7bIds = Object.keys(Q7B);
const q7cIds = Object.keys(Q7C);

const pick = (arr, i) => arr[i % arr.length];

let checked = 0,
  bad = 0;
const problems = [];

function assertResult(r, label) {
  const finiteFields = [
    r.annualVisitors, r.currentRPV, r.goalRPV, r.additionalRPVNeeded,
    r.requiredLift, r.nonListRevenue, r.block1.emailPercentage,
    r.capped.maxRPV, r.capped.achievableGain, r.capped.remainingGap,
    r.capped.additionalDailyVisitors,
    r.goal.optIn, r.goal.lead, r.goal.close, r.goal.rps,
  ];
  for (const v of finiteFields) {
    if (!Number.isFinite(v)) {
      bad++; problems.push(`${label}: non-finite (${v})`); return;
    }
  }
  if (![4, 5, 6, 7].includes(r.cappedBlock)) { bad++; problems.push(`${label}: bad cappedBlock ${r.cappedBlock}`); return; }
  const leadCeil = r.path === 'plg' ? CEILINGS.leadPlg : CEILINGS.leadSlg;
  // Goal is always ≥ current and ≤ max(ceiling, current) — a metric already
  // above its ceiling holds at current (clamp rule), so it may exceed ceiling.
  const capOK = (goal, cur, ceiling) =>
    goal >= cur - 1e-9 && goal <= Math.max(ceiling, cur) + 1e-9;
  const inRange =
    capOK(r.goal.optIn, r.current.optIn, CEILINGS.optIn) &&
    capOK(r.goal.rps, r.current.rps, CEILINGS.rps) &&
    capOK(r.goal.close, r.current.close, CEILINGS.close) &&
    capOK(r.goal.lead, r.current.lead, leadCeil);
  if (!inRange) { bad++; problems.push(`${label}: goal metric out of [current, max(ceiling,current)]`); return; }
  // Kit tags well-formed
  if (typeof r.tags.current_rpv !== 'number' || typeof r.tags.capped_state !== 'boolean') {
    bad++; problems.push(`${label}: malformed tags`); return;
  }
  checked++;
}

// Deterministic broad sweep (no RNG — index-driven so it's reproducible)
let n = 0;
for (const path of paths) {
  const q10Ids = Object.keys(Q10[path]);
  const q9aPath = Object.keys(Q9A[path]);
  for (let a = 0; a < q2Ids.length; a++)
    for (let b = 0; b < q7Ids.length; b++)
      for (let c = 0; c < q8Ids.length; c++)
        for (let d = 0; d < q11Ids.length; d++) {
          n++;
          const answers = {
            q2a: q2Ids[a],
            q7a: q7Ids[b],
            q8: q8Ids[c],
            q9a: pick(q9aPath, n),
            q9b: pick(q9bIds, n),
            q10: pick(q10Ids, n),
            q11: q11Ids[d],
            q6: n % 2 ? ['paid-ads'] : [],
            q7b: pick(q7bIds, n),
            q7c: n % 3 === 0 ? undefined && null : pick(q7cIds, n),
          };
          // half skip q7c
          if (n % 2) answers.q7c = pick(q7cIds, n);
          else delete answers.q7c;
          const inp = resolveInputs(answers, {}, path);
          if (inp.q7 == null || inp.q2 == null) continue; // disqualified / unanswered
          const r = calculate(inp, path);
          assertResult(r, `${path} [${q2Ids[a]},${q7Ids[b]},${q8Ids[c]},${q11Ids[d]}]`);
        }
}

// Hostile manual-entry edges
const edges = [
  { label: 'q8=0 (no subs)', answers: { q2a: '35k-100k', q7a: 'manual', q8: 'manual', q9a: '1-5', q9b: '25-50', q10: '100-250', q11: 'under-25k', q6: [] }, manual: { q7a: '5000', q8: '0' } },
  { label: 'tiny q7=1', answers: { q2a: 'under-10k', q7a: 'manual', q8: 'under-1000', q9a: 'under-1', q9b: 'under-10', q10: 'under-50', q11: 'no-email', q6: [] }, manual: { q7a: '1' } },
  { label: 'huge q11', answers: { q2a: '250k-500k', q7a: '3000-5000', q8: 'under-1000', q9a: '15-plus', q9b: '75-plus', q10: '2000-plus', q11: 'manual', q6: [] }, manual: { q11: '999999999' } },
  { label: 'q7c=not-sure ad', answers: { q2a: '35k-100k', q7a: '10001-50000', q8: '1000-5000', q9a: '1-5', q9b: '25-50', q10: '100-250', q11: '100k-250k', q6: ['paid-ads'], q7b: '10k-25k', q7c: 'not-sure' }, manual: {} },
];
for (const e of edges) {
  const path = 'plg';
  const inp = resolveInputs(e.answers, e.manual, path);
  if (inp.q7 == null) { problems.push(`edge ${e.label}: q7 null`); bad++; continue; }
  const r = calculate(inp, path);
  assertResult(r, `edge ${e.label}`);
}

console.log(`\nfuzz swept ${n} combos · ${checked} well-formed · ${bad} problems`);
if (problems.length) console.log(problems.slice(0, 20).join('\n'));
console.log(bad === 0 ? '\nALL WELL-FORMED ✓\n' : '\nPROBLEMS FOUND ✗\n');
process.exit(bad === 0 ? 0 : 1);
