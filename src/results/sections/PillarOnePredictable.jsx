import { PILLAR_ONE_PREDICTABLE } from '../copy.js';
import './PillarOnePredictable.css';

/**
 * Pillar one — closing "get predictable revenue" banner on the dark compass
 * chart, with a white keyline frame.
 * Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOnePredictable() {
  return (
    <div className="rpd">
      <div className="rpd__keyline" aria-hidden="true" />
      <div className="rpd__inner">
        <h3 className="rpd__headline">{PILLAR_ONE_PREDICTABLE.headline}</h3>
        <p className="rpd__sub">{PILLAR_ONE_PREDICTABLE.sub}</p>
      </div>
    </div>
  );
}
