import { PILLAR_THREE_HYPOTHESIS } from '../copy.js';
import './PillarThreeHypothesis.css';

/**
 * Pillar three — the hypothesis banner on the topo texture, ending on
 * "Enter the Conversion Quiz™." — demo 1 follows as its own section
 * (PillarThreeDemo demo="quiz").
 * Lives inside the pillars accordion (PANELS['03']).
 */
export default function PillarThreeHypothesis() {
  const p = PILLAR_THREE_HYPOTHESIS;

  return (
    <div className="r3h">
      <p className="r3h__para">{p.para}</p>
      <p className="r3h__line">
        <span className="r3h__chip">{p.chip}</span>
      </p>
      <h3 className="r3h__headline">
        {p.headBefore} <span className="r3h__hl">{p.headHighlight}</span>
      </h3>
    </div>
  );
}
