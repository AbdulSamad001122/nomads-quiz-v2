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

  // Computed results — Kit custom-field keys VERBATIM from the updated
  // handover doc ("updated new one kithandover doc.docx", Sep 23). Note the
  // doc's naming split: the RPV/lift fields are quiz_taker_ (singular) and
  // every computed field Burhan added in this round is quiz_takers_
  // (plural). capped_state is deliberately ABSENT: per the doc it is a TAG
  // ("Quiz Taker Capped State", applied only when capped), not a field —
  // see buildKitTags below.
  const TAG_FIELD_KEYS = {
    current_rpv: 'quiz_taker_current_rpv',
    goal_rpv: 'quiz_taker_goal_rpv',
    required_lift: 'quiz_taker_required_lift', // doc: "Required Lift in %"
    required_lift_amount: 'quiz_taker_required_lift_amount', // "…in $$"
    capped_block: 'quiz_takers_capped_block',
    achievable_gain: 'quiz_takers_achievable_gain',
    remaining_gap: 'quiz_takers_remaining_gap',
    additional_daily_visitors: 'quiz_takers_additional_daily_visitors',
    split_suppressed: 'quiz_takers_split_suppressed',
  };
  if (result && result.tags) {
    for (const [key, value] of Object.entries(result.tags)) {
      const fieldKey = TAG_FIELD_KEYS[key];
      // booleans go as 'true'/'false' STRINGS — Kit's API coerces a raw
      // boolean false to an empty field (seen live, Sep 23), which made
      // "false" indistinguishable from "never sent".
      if (fieldKey) fields[fieldKey] = typeof value === 'boolean' ? String(value) : value;
    }
    fields.quiz_takers_record_unverified = String(overrides.length > 0);
  }

  // Kit rejects nulls in the fields hash — drop empty values entirely.
  return Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== null && v !== undefined)
  );
}

/**
 * Kit TAGS (not fields) for a finished quiz. Handover doc, Sep 23:
 * capped_state → tag "Quiz Taker Capped State" — applied when the taker is
 * capped (Blocks 5–7), absent otherwise ("If the state is capped, tag them
 * this. If not, don’t tag them.").
 */
export function buildKitTags({ result = null } = {}) {
  return result && result.cappedState ? ['Quiz Taker Capped State'] : [];
}
