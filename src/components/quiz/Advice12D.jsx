import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/q12d/index.js';

/**
 * Constraint card after Q12 — price (PLG answer D, SLG answer E). Yemi's
 * "Q12 (PLG D, SLG E) Price Constraint" HTML (Slack, Oct 20), run as
 * designed inside the card host; see cards/q12d/index.js.
 */
export default function Advice12D({ onBack, onContinue }) {
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
