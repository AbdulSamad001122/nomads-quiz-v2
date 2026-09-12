import { PILLAR_ONE_ISOLATION } from '../copy.js';
import './PillarOneIsolation.css';

/**
 * Pillar one — "goals in isolation": peach band with the three goal-quote
 * cards, then the dark panel with the slow-month headline. The plum
 * "Because of that…" band straddles the seam between them.
 * Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOneIsolation() {
  return (
    <div className="rpi">
      <div className="rpi__top">
        <p className="rpi__lead">{PILLAR_ONE_ISOLATION.lead}</p>
        <h3 className="rpi__headline">
          {PILLAR_ONE_ISOLATION.headBefore}{' '}
          <span className="rpi__hl">{PILLAR_ONE_ISOLATION.headHighlight}</span>
        </h3>
        <div className="rpi__cards">
          {PILLAR_ONE_ISOLATION.quotes.map((q) => (
            <p className="rpi__card" key={q}>
              {q}
            </p>
          ))}
        </div>
      </div>

      <div className="rpi__bottom">
        <span className="rpi__band">{PILLAR_ONE_ISOLATION.band}</span>
        <h3 className="rpi__headline2">
          {PILLAR_ONE_ISOLATION.head2Before}{' '}
          <span className="rpi__hl2">{PILLAR_ONE_ISOLATION.head2Highlight}</span>
        </h3>
        <p className="rpi__sub">{PILLAR_ONE_ISOLATION.sub}</p>
      </div>
    </div>
  );
}
