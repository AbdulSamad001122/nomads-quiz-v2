import { PILLAR_FOUR_CLOSING } from '../copy.js';
import './PillarFourClosing.css';

/**
 * Pillar four — closing banner on the topo/dice texture, with the
 * cream-highlighted tail phrase.
 * Lives inside the pillars accordion (PANELS['04']).
 */
export default function PillarFourClosing() {
  const p = PILLAR_FOUR_CLOSING;

  return (
    <div className="rfz">
      <p className="rfz__sub">{p.sub}</p>
      <h3 className="rfz__headline">
        {p.headBefore} <span className="rfz__hl">{p.headHighlight}</span>
      </h3>
    </div>
  );
}
