import { PILLAR_TWO_BLENDING } from '../copy.js';
import './PillarTwoBlending.css';

/**
 * Pillar two — "the quiet cost of blending in": the lost-in-category vs
 * clear-differentiation cards on cream, with the Apple/LEAPS copy beside
 * them. Lives inside the pillars accordion (PANELS['02']).
 */
export default function PillarTwoBlending() {
  const p = PILLAR_TWO_BLENDING;

  return (
    <div className="rqc">
      <div className="rqc__media">
        <img
          src="/assets/results-p2-cards.webp"
          alt="Two cards — “Lost in the Category” with generic brand marks, and “Clear Differentiation” with Apple"
        />
      </div>

      <div className="rqc__body">
        <h3 className="rqc__headline">{p.headline}</h3>
        <p className="rqc__para">{p.para}</p>
        <span className="rqc__chip">{p.chip}</span>
        <p className="rqc__question">{p.question}</p>
        <p className="rqc__para">{p.leaps}</p>
        <p className="rqc__para">{p.closing}</p>
      </div>
    </div>
  );
}
