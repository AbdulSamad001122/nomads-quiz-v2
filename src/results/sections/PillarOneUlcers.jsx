import { PILLAR_ONE_ULCERS } from '../copy.js';
import './PillarOneUlcers.css';

/**
 * Pillar one — ulcer example: bear panel with the market pie left (3 / 7 /
 * 30 / 30 / 30, Yemi's Sep 29 redesign), cream linen right with the lead,
 * one stat card per doc bullet, the story paragraph and the "Even though
 * they do." band. Lives inside the pillars accordion.
 */
export default function PillarOneUlcers() {
  const p = PILLAR_ONE_ULCERS;

  return (
    <div className="rpu">
      <div className="rpu__left">
        <img
          className="rpu__pie"
          src="/assets/results-pillar1-pie-market.webp"
          alt={p.pieAlt}
          width="1000"
          height="1000"
        />
      </div>

      <div className="rpu__right">
        <p className="rpu__lead">{p.lead}</p>

        {p.cards.map((c) => (
          <div className="rpu__card" key={c.text}>
            {/* a small group for the few who are ready/open, a crowd for the 30s */}
            <img
              className="rpu__picto"
              src={Number(c.num) < 10 ? '/assets/results-people-three.png' : '/assets/results-people-many.png'}
              alt=""
              aria-hidden="true"
            />
            <span className="rpu__num">{c.num}</span>
            <span className="rpu__card-text">{c.text}</span>
          </div>
        ))}

        <p className="rpu__para">{p.para}</p>

        <p className="rpu__band">{p.band}</p>

        <p className="rpu__para">{p.closing}</p>
      </div>
    </div>
  );
}
