/**
 * GA4 — day-one launch events only.
 *
 * Base tag (auto pageviews/sessions) + the custom events we agreed are
 * launch-critical:
 *   quiz_start · question_view · question_answer · disqualified ·
 *   quiz_complete · results_view · lead_submit · cta_click
 * (workshop_progress helper is included, ready to fire from the video player
 *  once the real workshop video is added.)
 *
 * The Measurement ID is public (it ships in the client bundle), so once you
 * have it, paste it into GA_ID below (or set VITE_GA_ID). Until then every
 * track() call safely no-ops, so the wiring can ship now and light up later.
 */
const GA_ID = import.meta.env.VITE_GA_ID || 'G-HP0WTDLWJ7'; // public — committed like Clarity
// Production always tracks. Dev is OFF by default (keeps prod reports clean) —
// set VITE_GA_DEV=true in .env to fire dev events into GA4 DebugView for testing.
const ENABLE_DEV = import.meta.env.VITE_GA_DEV === 'true';
const ENABLED =
  /^G-[A-Z0-9]+$/i.test(GA_ID) && (import.meta.env.PROD || ENABLE_DEV);
const DEBUG = !import.meta.env.PROD; // dev events land in GA4 DebugView

export function initGA() {
  if (!ENABLED || typeof window === 'undefined' || window.gtag) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // In dev, tag traffic as "internal" so a GA4 Internal-Traffic data filter
  // (Active + Exclude) keeps local testing out of production reports.
  const config = { debug_mode: DEBUG };
  if (DEBUG) config.traffic_type = 'internal';
  window.gtag('config', GA_ID, config);
}

/** Low-level event send — safe no-op until GA is configured. */
export function track(event, params = {}) {
  if (!ENABLED || typeof window === 'undefined' || !window.gtag) return;
  // strip undefined/null params so GA reports stay clean
  const clean = {};
  for (const k in params) if (params[k] != null) clean[k] = params[k];
  // dev events carry traffic_type=internal → excluded by the GA4 filter
  if (DEBUG) clean.traffic_type = 'internal';
  window.gtag('event', event, clean);
}

/** Named day-one events. */
export const ga = {
  quizStart: () => track('quiz_start'),

  questionView: (q, salesModel) =>
    track('question_view', {
      question_id: q.id,
      question_number: q.stepNumber,
      question_label: q.label,
      variant: q.variant,
      sales_model: salesModel,
    }),

  questionAnswer: (q, answerId, answerLabel, salesModel) =>
    track('question_answer', {
      question_id: q.id,
      answer_id: answerId,
      answer_label: answerLabel,
      sales_model: salesModel,
    }),

  disqualified: (reason) => track('disqualified', { reason }),

  quizComplete: (result) =>
    track('quiz_complete', {
      sales_model: result.path,
      capped_block: result.cappedBlock,
    }),

  resultsView: (result) =>
    track('results_view', {
      current_rpv: result.tags.current_rpv,
      goal_rpv: result.tags.goal_rpv,
      required_lift: result.tags.required_lift,
      capped_block: result.cappedBlock,
      no_email: result.noEmail,
      sales_model: result.path,
    }),

  leadSubmit: (salesModel) => track('lead_submit', { sales_model: salesModel }),

  ctaClick: (cta) => track('cta_click', { cta }),

  // Ready for the workshop video player (fire at 25/50/75/100):
  workshopProgress: (percent) => track('workshop_progress', { percent }),
};
