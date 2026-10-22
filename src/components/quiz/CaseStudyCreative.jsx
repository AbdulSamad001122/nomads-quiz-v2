import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q5c/index.js');
prefetchCard(load);

/**
 * Case study 5C — Contrarian POV ("differentiation" route off Q5, both
 * paths). Yemi's "Q5C Contrarian POV Card" HTML (Slack, Oct 20), run as
 * designed inside the card host; see cards/q5c/index.js for what changed for
 * the quiz.
 */
export default function CaseStudyCreative({ onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Case study: Contrarian POV"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
