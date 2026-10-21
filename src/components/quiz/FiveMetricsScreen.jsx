import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q11/index.js');
prefetchCard(load);

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
      load={load}
      label="Separate rooms versus one table"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
