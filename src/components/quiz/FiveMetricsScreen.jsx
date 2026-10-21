import CardHost from './cards/CardHost.jsx';
import { mount, css } from './cards/q11/index.js';

/**
 * The slide after Q11 — Yemi's "Q11 One Table" HTML (Slack, Oct 20): the
 * departments in separate rooms vs everyone at one table around Revenue Per
 * Visitor™, with the team chat and the five metrics. It replaces the old
 * five-metrics slide in this slot (screen id kept as 'five-metrics') and now
 * comes before the loading screen, as the card's notes set out. Run as
 * designed inside the card host; see cards/q11/index.js.
 */
export default function FiveMetricsScreen({ onBack, onContinue }) {
  return (
    <CardHost
      mount={mount}
      css={css}
      label="Separate rooms versus one table"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
