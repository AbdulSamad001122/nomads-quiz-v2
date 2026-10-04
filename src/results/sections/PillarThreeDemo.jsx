import { Component, lazy, Suspense } from 'react';
import './PillarThreeDemo.css';

// the CRPV demos (and their CSS + fonts) load only once Pillar 3 is opened;
// both demos share the one chunk
const CrpvEmbed = lazy(() => import('../crpv/CrpvEmbed.jsx'));

/* This is the app's only lazily loaded chunk. If it can't be fetched (a
   deploy swapped the chunk names while the results page was open, or the
   connection dropped), React would otherwise unmount the whole app — and the
   quiz result only lives in memory. Contain the failure to the demo slot. */
class DemoBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Pillar three — a CRPV features demo as its own full-width section, exactly
 * as designed (Yemi, Oct 1). Full width so the demo gets the room it was
 * designed for — inside a padded band its viewport-sized headings wrap
 * twice as often.
 * demo="quiz"     → the Conversion Quiz™ tab
 * demo="workSkep" → the Diagnostic Workshop + Skepticism Sequence tabs
 * Lives inside the pillars accordion (PANELS['03']).
 */
export default function PillarThreeDemo({ demo }) {
  return (
    <DemoBoundary>
      <div className="r3x">
        <Suspense fallback={<div className="r3x__wait" />}>
          <CrpvEmbed demo={demo} />
        </Suspense>
      </div>
    </DemoBoundary>
  );
}
