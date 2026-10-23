import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q12a/index.js');
prefetchCard(load);

/**
 * Constraint card after Q12, answer A — Yemi's "Q12A SLG Calls Constraint"
 * (SLG) and "Q12A PLG Buyers Constraint" (PLG) HTML cards (Slack, Oct 20),
 * one card with each path's copy. Run as designed inside the card host; see
 * cards/q12a/index.js. `track` is the taker's path ('slg' | 'plg').
 */
export default function Advice12A({ track, onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Your number one constraint"
      data={{ track }}
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
