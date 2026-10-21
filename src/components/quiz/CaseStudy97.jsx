import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/q5b/index.js';

/**
 * Case study 5B — growing an email list ("low-optin" route off Q5, both
 * paths). Yemi's "Q5B Email List Card" HTML (Slack, Oct 20), run as designed
 * inside the card host; see cards/q5b/index.js for what changed for the quiz.
 * `q3` (the taker's Q3 answer id) picks which business case opens first.
 */
export default function CaseStudy97({ q3, onBack, onContinue }) {
  return (
    <CardHost
      mount={mount}
      css={css}
      label="Case studies: growing an email list"
      data={{ q3: q3 || null }}
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
