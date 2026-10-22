import CardHost, { prefetchCard } from './cards/CardHost.jsx';

const load = () => import('./cards/q5a/index.js');
prefetchCard(load);

/* Dark accent for filled chips/cards + light card fill, per theme, and the
   sweep tone for the dark chip on the light CTA card. Shared with the other
   case-study screens (CaseStudy97/Creative/Lara/Estelle), which still use
   them until their own HTML cards replace them. */
export const ACCENT = { maroon: '#5d1b4e', green: '#152638', blue: '#152638' };
export const CARD = { maroon: '#f2e5f6', green: '#e4fbff', blue: '#e4fbff' };
export const CTA_TONE = { maroon: 'plum', green: 'navy', blue: 'navy' };

/**
 * Case study 5A — GolfBays ("cold-traffic" route off Q5, both paths).
 * Yemi's "Q5A GolfBays Card" HTML (Slack, Oct 20), run as designed inside
 * the card host; see cards/q5a/index.js for what changed for the quiz.
 */
export default function CaseStudyGolfbays({ onBack, onContinue }) {
  return (
    <CardHost
      load={load}
      label="Case study: GolfBays"
      onBack={onBack}
      onContinue={onContinue}
    />
  );
}
