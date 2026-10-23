import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q12b/index.js');
prefetchCard(load);

/**
 * Constraint card after Q12, answer B (both paths): revenue has plateaued.
 * Yemi's "Q12 (PLG B, SLG B) Plateau Constraint" HTML (Slack, Oct 20), run
 * as designed inside the card host; see cards/q12b/index.js.
 */
export default function Advice12B({ onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Your number one constraint"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
