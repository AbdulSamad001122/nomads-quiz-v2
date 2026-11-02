import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/calc/index.js');
prefetchCard(load);

/**
 * Calculator intro — after Q7A (moved from after the Q5 case studies, Quiz QC
 * Oct 31). Yemi's
 * "Calculator Intro (after Q5 case studies)" HTML (Slack, Oct 20), run as
 * designed inside the card host; see cards/calc/index.js for what changed
 * for the quiz. `track` is the taker's path ('slg' | 'plg'); `upNext` is the
 * wording of the question that comes next for this taker (Q7B or Q8).
 */
export default function CalculatorIntroCard({ track, upNext, onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Revenue Per Visitor Calculator"
      data={{ track, upNext }}
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
