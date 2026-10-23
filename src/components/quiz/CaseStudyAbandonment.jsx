import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q5ep/index.js');
prefetchCard(load);

/**
 * Case study 5E (PLG) — abandoned carts (GolfBays + the B2B2C audio company;
 * "cart-abandonment" route off Q5, PLG only). Yemi's "Q5E PLG Abandonment
 * Card" HTML (Slack, Oct 20), run as designed inside the card host; see
 * cards/q5ep/index.js for what changed for the quiz.
 */
export default function CaseStudyAbandonment({ onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Case studies: abandoned carts"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
