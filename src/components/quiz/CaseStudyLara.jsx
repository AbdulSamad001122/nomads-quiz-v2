import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q5d/index.js');
prefetchCard(load);

/**
 * Case study 5D — email (SDR Sales Coach + Lara Acosta; "email-close" route
 * off Q5, both paths). Yemi's "Q5D Email Case Card" HTML (Slack, Oct 20), run
 * as designed inside the card host; see cards/q5d/index.js for what changed
 * for the quiz.
 */
export default function CaseStudyLara({ onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Case studies: email"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
