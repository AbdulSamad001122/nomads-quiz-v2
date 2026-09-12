import { PILLAR_ONE_PYRAMID } from '../copy.js';
import './PillarOnePyramid.css';

/**
 * Pillar one — awareness pyramid: the whole infographic is a supplied image
 * (pyramid + speech doodles + compass stamp), with the Schwartz caption
 * below it. Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOnePyramid() {
  return (
    <div className="rpp">
      <img
        className="rpp__img"
        src="/assets/results-pillar1-pyramid.webp"
        alt="Pyramid of Awareness — Symptom Aware, Problem Aware, Solution & Product Aware. Most marketing meets people at the top and ignores the base."
      />
      <p className="rpp__caption">
        <span className="rpp__arrow" aria-hidden="true">↑</span> {PILLAR_ONE_PYRAMID.caption}
      </p>
    </div>
  );
}
