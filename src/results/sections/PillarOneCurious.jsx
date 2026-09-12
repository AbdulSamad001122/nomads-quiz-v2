import { PILLAR_ONE_CURIOUS } from '../copy.js';
import './PillarOneCurious.css';

/**
 * Pillar one — "pull the other 60% in" banner on the topo/dice texture.
 * Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOneCurious() {
  return (
    <div className="rpc">
      <p className="rpc__para">{PILLAR_ONE_CURIOUS.para}</p>
      <h3 className="rpc__headline">
        {PILLAR_ONE_CURIOUS.headBefore}{' '}
        <span className="rpc__hl">{PILLAR_ONE_CURIOUS.headHighlight}</span>
      </h3>
    </div>
  );
}
