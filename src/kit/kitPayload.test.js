/**
 * Kit payload validation — run with:  node src/kit/kitPayload.test.js
 * Simulates a full SLG quiz and a PLG quiz and asserts the exact field
 * values that would reach Kit (decisions: backend numbers for calculator
 * questions, labels for text questions, Q4 model names, Q6 commas,
 * Q13 sentence format, computed tags).
 */
import assert from 'node:assert';
import { buildKitFields, sentenceJoin } from './kitPayload.js';
import { resolveInputs } from '../calc/backendValues.js';
import { calculate } from '../calc/calculator.js';

let passed = 0;
const eq = (actual, expected, label) => {
  assert.deepStrictEqual(actual, expected, `${label}\n  got: ${JSON.stringify(actual)}\n  want: ${JSON.stringify(expected)}`);
  passed += 1;
};

/* ---------- sentenceJoin ---------- */
eq(sentenceJoin(['a']), 'a', 'join 1');
eq(sentenceJoin(['a', 'b']), 'a and b', 'join 2');
eq(sentenceJoin(['a', 'b', 'c']), 'a, b and c', 'join 3');
eq(sentenceJoin([]), null, 'join empty');

/* ---------- SLG run (bracket answers) ---------- */
const slgAnswers = {
  q1: 'founder',
  q2a: '35k-100k',
  q3: 'agency',
  q4: 'calls',
  q5: 'cold-traffic',
  q6: ['linkedin', 'seo'],
  q7a: '10001-50000',
  q8: '1000-5000',
  q9a: '1-5',
  q9b: '25-50',
  q10: '2000-5000',
  q11: '25k-100k',
  q12: 'e',
  q13: ['paid-ads', 'other'],
};

const slgInputs = resolveInputs(slgAnswers, {}, 'slg');
const slgResult = calculate(slgInputs, 'slg');
const slg = buildKitFields({
  answers: slgAnswers,
  manualValues: {},
  otherText: 'Hired a fractional CMO',
  vocText: 'Revenue stalled for two quarters.',
  result: slgResult,
});

eq(slg.quiz_taker_revenue_tier, 810000, 'SLG revenue tier backend value');
eq(
  slg.quiz_taker_traffic_sources,
  'LinkedIn content, SEO / Google search',
  'Q6 labels comma-joined'
);
eq(slg.quiz_taker_monthly_visitors, 30000, 'SLG visitors backend value');
eq(slg.quiz_taker_new_monthly_email_subscribers, 3000, 'SLG Q8 backend value');
eq(slg.quiz_taker_subscriber_to_buying_action_within_first_14_days, 3, 'SLG Q9A → percent');
eq(slg.quiz_taker_close_rate, 37.5, 'SLG Q9B → percent');
eq(slg.quiz_taker_order_value_deal_size, 3500, 'SLG Q10 backend value');
eq(slg.quiz_taker_annual_email_revenue, 62500, 'SLG Q11 backend value');
eq(slg.quiz_taker_sales_model, 'SLG', 'Q4 calls → SLG');
eq(
  slg.quiz_taker_problem_they_are_cracking_right_now,
  'We’re losing to price wars! We’re seeing more deals go to competitors.',
  'Q12 option e label verbatim'
);
eq(
  slg.quiz_taker_solution_tried_already_for_revenue_growth.endsWith(
    'and Hired a fractional CMO'
  ),
  true,
  'Q13 other → typed text, sentence format'
);
eq(
  slg.quiz_taker_feedback_loop_what_led_you_here,
  'Revenue stalled for two quarters.',
  'Q14 free text'
);
eq(typeof slg.quiz_taker_current_rpv, 'number', 'computed current_rpv present');
eq(typeof slg.quiz_taker_goal_rpv, 'number', 'computed goal_rpv present');
eq(slg.quiz_taker_record_unverified, false, 'record_unverified false');
eq('quiz_taker_ad_spend' in slg, false, 'no ad spend on organic path');

/* ---------- PLG run (manual entries + hybrid checks) ---------- */
const plgAnswers = {
  q1: 'founder',
  q2a: '100k-250k',
  q3: 'saas',
  q4: 'self-serve',
  q5: 'low-optin',
  q6: ['paid-ads'],
  q7a: 'manual',
  q7b: '10k-25k',
  q7c: '45-55',
  q8: 'manual',
  q9a: '5-10',
  q9b: '10-25',
  q10: '100-250',
  q11: 'no-email',
  q12: 'a',
  q13: ['agency'],
};
const plgManual = { q7a: '42000', q8: '8000' };

const plgInputs = resolveInputs(plgAnswers, plgManual, 'plg');
const plgResult = calculate(plgInputs, 'plg');
const plg = buildKitFields({
  answers: plgAnswers,
  manualValues: plgManual,
  otherText: '',
  vocText: '',
  result: plgResult,
});

eq(plg.quiz_taker_sales_model, 'PLG', 'Q4 self-serve → PLG');
eq(plg.quiz_taker_monthly_visitors, 42000, 'manual visitors exact number');
eq(plg.quiz_taker_new_monthly_email_subscribers, 8000, 'manual Q8 exact number');
eq(plg.quiz_taker_ad_spend, 17500, 'Q7B backend value');
eq(plg.quiz_taker_ad_traffic_share, 50, 'Q7C 0.5 → 50%');
eq(plg.quiz_taker_annual_email_revenue, 0, 'no-email → 0');
eq('quiz_taker_feedback_loop_what_led_you_here' in plg, false, 'empty VOC dropped');

/* ---------- hybrid mapping ---------- */
const hybC = buildKitFields({ answers: { ...slgAnswers, q4: 'hybrid-call' } });
eq(hybC.quiz_taker_sales_model, 'SLG (Hybrid)', 'Q4 C → SLG (Hybrid)');
const hybD = buildKitFields({ answers: { ...slgAnswers, q4: 'hybrid-mess' } });
eq(hybD.quiz_taker_sales_model, 'SLG (Hybrid)', 'Q4 D → SLG (Hybrid)');

/* ---------- no result (missing inputs) ---------- */
const noCalc = buildKitFields({ answers: { q1: 'founder' } });
eq('quiz_taker_current_rpv' in noCalc, false, 'no computed fields without result');

console.log(`\nkitPayload: all ${passed} checks passed ✓`);
console.log('\nSample SLG payload that would reach Kit:');
console.log(JSON.stringify(slg, null, 2));
