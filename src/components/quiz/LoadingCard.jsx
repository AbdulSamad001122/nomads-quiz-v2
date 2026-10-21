import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/loading/index.js';

/**
 * Loading screen after the Q11 One Table card — Yemi's "Loading Screen
 * (after Q11, before transition screen)" HTML (Slack, Oct 20), run as
 * designed inside the card host (see cards/loading/index.js). No button:
 * the compass searches, the teaser sharpens, and at ~3.5s it calls onDone.
 */
export default function LoadingCard({ track, onDone }) {
  return (
    <CardHost
      mount={mount}
      css={css}
      label="Calculating your Revenue Per Visitor"
      data={{ track }}
      onContinue={onDone}
    />
  );
}
