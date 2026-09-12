import { PILLAR_ONE_ULCERS } from '../copy.js';
import './PillarOneUlcers.css';

/**
 * Pillar one — ulcer example: bear panel with the pie chart image left,
 * cream linen right with the 100/03 stat cards, story paragraphs and the
 * "Even though they do." band. Lives inside the pillars accordion.
 */
export default function PillarOneUlcers() {
  return (
    <div className="rpu">
      <div className="rpu__left">
        <img
          className="rpu__pie"
          src="/assets/results-pillar1-pie.webp"
          alt="Pie chart — 67% have stomach pain but don't know ulcers cause it, 30% aren't interested, 3% know they have ulcers"
        />
      </div>

      <div className="rpu__right">
        <p className="rpu__lead">{PILLAR_ONE_ULCERS.lead}</p>

        <div className="rpu__card">
          <img className="rpu__picto" src="/assets/results-people-many.png" alt="" aria-hidden="true" />
          <span className="rpu__num">{PILLAR_ONE_ULCERS.card1Num}</span>
          <span className="rpu__card-text">{PILLAR_ONE_ULCERS.card1Text}</span>
        </div>

        <div className="rpu__card">
          <img className="rpu__picto" src="/assets/results-people-three.png" alt="" aria-hidden="true" />
          <span className="rpu__num">{PILLAR_ONE_ULCERS.card2Num}</span>
          <span className="rpu__card-text">{PILLAR_ONE_ULCERS.card2Text}</span>
        </div>

        <p className="rpu__para">{PILLAR_ONE_ULCERS.para1}</p>
        <p className="rpu__para">{PILLAR_ONE_ULCERS.para2}</p>

        <p className="rpu__band">{PILLAR_ONE_ULCERS.band}</p>

        <p className="rpu__para">{PILLAR_ONE_ULCERS.closing}</p>
      </div>
    </div>
  );
}
