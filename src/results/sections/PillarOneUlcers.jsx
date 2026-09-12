import { PILLAR_ONE_ULCERS } from '../copy.js';
import './PillarOneUlcers.css';

/* Simple original people pictograms — stand-ins until the designer's crowd
   icons land in the Icons folder (flagged). */
function Crowd({ color, count }) {
  const positions =
    count === 3
      ? [[10, 8], [0, 12], [20, 12]]
      : [[15, 2], [5, 5], [25, 5], [0, 11], [10, 10], [20, 10], [30, 11]];
  return (
    <svg viewBox="0 0 44 34" className="rpu__picto" aria-hidden="true">
      {positions.map(([x, y], i) => (
        <g key={i} transform={`translate(${x + 4} ${y})`} fill={color}>
          <circle cx="3" cy="3" r="3" />
          <path d="M-1 14 q0 -6 4 -6 q4 0 4 6 z" />
        </g>
      ))}
    </svg>
  );
}

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
          <Crowd color="#16273b" count={7} />
          <span className="rpu__num">{PILLAR_ONE_ULCERS.card1Num}</span>
          <span className="rpu__card-text">{PILLAR_ONE_ULCERS.card1Text}</span>
        </div>

        <div className="rpu__card">
          <Crowd color="#641d4f" count={3} />
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
