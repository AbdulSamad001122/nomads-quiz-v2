import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/q12c/index.js';

/**
 * Constraint card after Q12 — inconsistent revenue (PLG answer C, SLG
 * answers C and D). Yemi's "Q12 (PLG C, SLG C + D) Inconsistent Revenue
 * Constraint" HTML (Slack, Oct 20), run as designed inside the card host;
 * see cards/q12c/index.js.
 */
export default function Advice12C({ onBack, onContinue }) {
  return (
    <CardHost
      mount={mount}
      css={css}
      label="Your number one constraint"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
