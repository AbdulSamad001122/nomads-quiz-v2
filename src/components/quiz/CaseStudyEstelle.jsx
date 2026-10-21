import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q5es/index.js');
prefetchCard(load);

/**
 * Case study 5E (SLG) — Estelle Winsett ("call-convincing" route off Q5).
 * Yemi's "Q5E SLG Estelle Card" HTML (Slack, Oct 20), run as designed inside
 * the card host; see cards/q5es/index.js for what changed for the quiz.
 */
export default function CaseStudyEstelle({ onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Case study: Estelle Winsett"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
