import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/calc/index.js';

/**
 * Calculator intro — after the Q5 case studies, before Q6. Yemi's
 * "Calculator Intro (after Q5 case studies)" HTML (Slack, Oct 20), run as
 * designed inside the card host; see cards/calc/index.js for what changed
 * for the quiz. `track` is the taker's path ('slg' | 'plg').
 */
export default function CalculatorIntroCard({ track, onBack, onContinue }) {
  return (
    <CardHost
      mount={mount}
      css={css}
      label="Revenue Per Visitor Calculator"
      data={{ track }}
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
