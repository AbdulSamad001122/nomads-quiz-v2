import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/q5c/index.js';

/**
 * Case study 5C — Contrarian POV ("differentiation" route off Q5, both
 * paths). Yemi's "Q5C Contrarian POV Card" HTML (Slack, Oct 20), run as
 * designed inside the card host; see cards/q5c/index.js for what changed for
 * the quiz.
 */
export default function CaseStudyCreative({ onBack, onContinue }) {
  return (
    <CardHost
      mount={mount}
      css={css}
      label="Case study: Contrarian POV"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
