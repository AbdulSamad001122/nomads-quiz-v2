import { PILLAR_ONE_SITUATIONS } from '../copy.js';
import './PillarOneSituations.css';

/**
 * Pillar one — the two "situations" as a 2×2 grid: ice copy panel + Alefiya
 * phone shot on top, laptop mockup + white copy panel below. The compass
 * stamp straddles the top edge at the column seam.
 * Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOneSituations() {
  const { one, two } = PILLAR_ONE_SITUATIONS;

  return (
    <div className="rpm">
      <img className="rpm__stamp" src="/assets/results-common-badge.png" alt="" aria-hidden="true" />

      <div className="rpm__cell rpm__cell--ice">
        <div className="rpm__body">
          <span className="rpm__chip">{one.chip}</span>
          <p className="rpm__para">{one.p1}</p>
          <p className="rpm__head">
            {one.headBefore} <span className="rpm__hl">{one.headHighlight}</span>
          </p>
          <p className="rpm__para">{one.p2}</p>
          <p className="rpm__bold">{one.bold}</p>
        </div>
      </div>

      <div className="rpm__cell rpm__cell--dark">
        <img className="rpm__phone" src="/assets/results-alefiya-phone.webp" alt="Alefiya reading on her phone" />
      </div>

      <div className="rpm__cell rpm__cell--teal">
        <img
          className="rpm__laptop"
          src="/assets/results-alefiya-laptop.webp"
          alt="Nomads landing page on a laptop — “Alex” hits your landing page, tilts his head in interest, and disappears?"
        />
      </div>

      <div className="rpm__cell rpm__cell--white">
        <div className="rpm__body">
          <span className="rpm__chip">{two.chip}</span>
          <p className="rpm__para">{two.p1}</p>
          <p className="rpm__para">{two.p2}</p>
          <p className="rpm__para">{two.p3}</p>
          <p className="rpm__bold">{two.bold}</p>
        </div>
      </div>
    </div>
  );
}
