import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/q5es/index.js';

/**
 * Case study 5E (SLG) — Estelle Winsett ("call-convincing" route off Q5).
 * Yemi's "Q5E SLG Estelle Card" HTML (Slack, Oct 20), run as designed inside
 * the card host; see cards/q5es/index.js for what changed for the quiz.
 */
export default function CaseStudyEstelle({ onBack, onContinue }) {
  return (
    <CardHost
      mount={mount}
      css={css}
      label="Case study: Estelle Winsett"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
