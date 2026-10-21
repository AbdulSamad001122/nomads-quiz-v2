import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/calc/index.js');
prefetchCard(load);

/**
 * Calculator intro — after the Q5 case studies, before Q6. Yemi's
 * "Calculator Intro (after Q5 case studies)" HTML (Slack, Oct 20), run as
 * designed inside the card host; see cards/calc/index.js for what changed
 * for the quiz. `track` is the taker's path ('slg' | 'plg').
 */
export default function CalculatorIntroCard({ track, onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Revenue Per Visitor Calculator"
      data={{ track }}
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
