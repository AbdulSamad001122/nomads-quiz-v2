import { PILLAR_TWO_WORKSHOP } from '../copy.js';
import './PillarTwoWorkshop.css';

/**
 * Pillar two — closing workshop banner: dark textured panel, ice-highlighted
 * tail line and the down-arrows doodle.
 * Lives inside the pillars accordion (PANELS['02']).
 */
export default function PillarTwoWorkshop() {
  const p = PILLAR_TWO_WORKSHOP;

  return (
    <div className="rqw">
      <img className="rqw__arrows" src="/assets/results-down-arrows.png" alt="" aria-hidden="true" />
      <h3 className="rqw__headline">
        {p.headBefore} <span className="rqw__hl">{p.headHighlight}</span>
      </h3>
      <p className="rqw__sub">{p.sub}</p>
    </div>
  );
}
