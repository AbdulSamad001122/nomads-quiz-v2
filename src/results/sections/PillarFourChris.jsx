import { PILLAR_FOUR_CHRIS } from '../copy.js';
import './PillarFourChris.css';

/**
 * Pillar four — the Chris two-lists quote card on navy.
 * Lives inside the pillars accordion (PANELS['04']).
 */
export default function PillarFourChris() {
  const p = PILLAR_FOUR_CHRIS;

  return (
    <div className="rfq">
      <blockquote className="rfq__card">
        <img className="rfq__mark rfq__mark--open" src="/assets/results-quote-mark.png" alt="" aria-hidden="true" />
        <p className="rfq__headline">{p.headline}</p>
        <p className="rfq__para">{p.para1}</p>
        <p className="rfq__para">{p.para2}</p>
        <img className="rfq__mark rfq__mark--close" src="/assets/results-quote-mark.png" alt="" aria-hidden="true" />
      </blockquote>
    </div>
  );
}
