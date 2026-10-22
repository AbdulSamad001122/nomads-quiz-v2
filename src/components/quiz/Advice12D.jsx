import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q12d/index.js');
prefetchCard(load);

/**
 * Constraint card after Q12 — price (PLG answer D, SLG answer E). Yemi's
 * "Q12 (PLG D, SLG E) Price Constraint" HTML (Slack, Oct 20), run as
 * designed inside the card host; see cards/q12d/index.js.
 */
export default function Advice12D({ onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Your number one constraint"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
