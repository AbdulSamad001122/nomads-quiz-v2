import { QUESTIONS, resolveQuestion, salesModel } from '../data/questions.js';
import { resolveInputs } from '../calc/backendValues.js';

/**
 * Builds the Kit custom-field payload from a finished quiz.
 *
 * Field keys = Burhan's handover doc ("Kit fields tag e.t.c.docx") — the
 * snake_case Liquid keys, e.g. {{ subscriber.quiz_taker_role }}.
 *
 * Value rules (confirmed with Yemi + Burhan):
 *  - Calculator questions (Q2, Q7A–C, Q8, Q9A/B, Q10, Q11) → the logic doc's
 *    BACKEND VALUES (exact number if the taker typed one). Percent-type
 *    values are sent as 0–100 numbers.
 *  - Text questions (Q1, Q3, Q5, Q12) → the option label verbatim.
 *  - Q4 → SLG / PLG / SLG (Hybrid).
 *  - Q6 multi-select → labels joined with commas.
 *  - Q13 multi-select → "a, b and c" sentence format (Burhan's remark);
 *    a chosen "Other" is replaced by the typed text when present.
 *  - Q14 → the free text verbatim.
 *  - Computed results → the calculator's `tags` output (logic doc's
 *    "Computed (pushed after calculation)" table). record_unverified stays
 *    false until the validation UI ships.
 */

const byId = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

/** SLG / PLG / SLG (Hybrid) per Q4 answer (logic doc Q4 routing table). */
const SALES_MODEL_FIELD = {
  calls: 'SLG',
  'self-serve': 'PLG',
  'hybrid-call': 'SLG (Hybrid)',
  'hybrid-mess': 'SLG (Hybrid)',
};

function optionLabel(qid, answers, answerId) {
  const q = resolveQuestion(byId[qid], answers);
  const opt = (q.options || []).find((o) => o.id === answerId);
  return opt ? opt.label : null;
}

/** "a" · "a and b" · "a, b and c" (Burhan's Q13 formatting remark). */
export function sentenceJoin(items) {
  const list = items.filter(Boolean);
  if (list.length <= 1) return list[0] || null;
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

const pct = (fraction) =>
  fraction == null ? null : Math.round(fraction * 1000) / 10; // 0.125 → 12.5

export function buildKitFields({
  answers,
  manualValues = {},
  otherText = '',
  vocText = '',
  result = null,
  // Question ids where the taker hit an impossible-answer check and chose
  // "Keep my answers" (Quiz Logics.docx: "…tags the record unverified").
  overrides = [],
}) {
  const path = salesModel(answers);
  const inputs = resolveInputs(answers, manualValues, path);

  // Q6 — all selected labels, comma separated
  const q6Ids = Array.isArray(answers.q6) ? answers.q6 : [];
  const trafficSources = q6Ids
    .map((id) => optionLabel('q6', answers, id))
    .filter(Boolean)
    .join(', ');

  // Q13 — sentence format; "Other" becomes the typed text when given
  const q13Ids = Array.isArray(answers.q13) ? answers.q13 : [];
  const triedLabels = q13Ids.map((id) =>
    id === 'other' && otherText.trim()
      ? otherText.trim()
      : optionLabel('q13', answers, id)
  );
  const tried = sentenceJoin(triedLabels);

  const fields = {
    quiz_taker_role: optionLabel('q1', answers, answers.q1),
    quiz_taker_revenue_tier: inputs.q2 ?? null,
    quiz_taker_business_type: optionLabel('q3', answers, answers.q3),
    quiz_taker_sales_model: SALES_MODEL_FIELD[answers.q4] || null,
    quiz_taker_biggest_problem: optionLabel('q5', answers, answers.q5),
    quiz_taker_traffic_sources: trafficSources || null,
    quiz_taker_monthly_visitors: inputs.q7 ?? null,
    quiz_taker_ad_spend: inputs.q7b ?? null,
    quiz_taker_ad_traffic_share: pct(inputs.q7c),
    quiz_taker_new_monthly_email_subscribers: inputs.q8 ?? null,
    quiz_taker_subscriber_to_buying_action_within_first_14_days: pct(inputs.q9a),
    quiz_taker_close_rate: pct(inputs.q9b),
    quiz_taker_order_value_deal_size: inputs.q10 ?? null,
    quiz_taker_annual_email_revenue: inputs.q11 ?? null,
    quiz_taker_problem_they_are_cracking_right_now: optionLabel(
      'q12',
      answers,
      answers.q12
    ),
    quiz_taker_solution_tried_already_for_revenue_growth: tried,
    quiz_taker_feedback_loop_what_led_you_here: vocText.trim() || null,
  };

  // Computed results (logic doc's computed table). The calculator outputs
  // the doc's snake_case names; Kit's custom fields carry a quiz_taker_
  // prefix (checked live against the account), so map them here.
  if (result && result.tags) {
    for (const [key, value] of Object.entries(result.tags)) {
      fields[`quiz_taker_${key}`] = value;
    }
    fields.quiz_taker_record_unverified = overrides.length > 0;
  }

  // Kit rejects nulls in the fields hash — drop empty values entirely.
  return Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== null && v !== undefined)
  );
}
