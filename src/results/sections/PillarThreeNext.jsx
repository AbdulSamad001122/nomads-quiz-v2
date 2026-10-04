import { PILLAR_THREE_DEMOS } from '../copy.js';
import './PillarThreeNext.css';

/**
 * Pillar three — "And what follows the Conversion Quiz™…", the lead into
 * demo 2 (PillarThreeDemo demo="workSkep").
 * Lives inside the pillars accordion (PANELS['03']).
 */
export default function PillarThreeNext() {
  return (
    <div className="r3n">
      <div className="r3n__inner">
        <h3 className="r3n__lead">{PILLAR_THREE_DEMOS.lead}</h3>
      </div>
    </div>
  );
}
