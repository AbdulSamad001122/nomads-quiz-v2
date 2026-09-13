import { THE_CATCH } from '../copy.js';
import './TheCatch.css';

/** Copy lines flow as one naturally-wrapping run (no forced breaks). */
function Lines({ lines }) {
  return lines.join(' ');
}

/**
 * Section — "Here's the catch": white left column (chip rule, headline,
 * score box, workshop scoring copy) and mint-gradient right column with the
 * down-arrows doodle and the Compounding RPV™ OS map card. The plum
 * "More On Both Below." band straddles the seam with the section above.
 */
export default function TheCatch() {
  return (
    <section className="rtc">
      <div className="rtc__band" aria-hidden="true">
        {THE_CATCH.band}
      </div>

      <div className="rtc__left">
        <div className="rtc__rule">
          <span className="rtc__chip">{THE_CATCH.chip}</span>
          <span className="rtc__rule-line" aria-hidden="true" />
          <img className="rtc__rule-icon" src="/assets/results-compass-navy.png" alt="" aria-hidden="true" width="426" height="426" />
        </div>

        <h2 className="rtc__headline">
          {THE_CATCH.headlineLines[0]}{' '}
          <span className="rtc__keep">{THE_CATCH.headlineLines[1]}</span>{' '}
          {THE_CATCH.headlineLines[2]}
        </h2>

        <p className="rtc__sub">
          <Lines lines={THE_CATCH.subLines} />
        </p>

        <p className="rtc__scorebox">{THE_CATCH.scoreBox}</p>

        <p className="rtc__para">
          <Lines lines={THE_CATCH.paraLines} />
        </p>

        <p className="rtc__para">
          <Lines lines={THE_CATCH.para2Lines} />
        </p>

        <p className="rtc__bold">
          <Lines lines={THE_CATCH.boldLines} />
        </p>
      </div>

      <div className="rtc__right">
        <img className="rtc__arrows" src="/assets/results-down-arrows.png" alt="" aria-hidden="true" />
        <div className="rtc__map-card">
          <img src="/assets/results-crpv-os-map.webp" alt="Compounding Revenue Per Visitor™ OS workshop map" />
        </div>
      </div>
    </section>
  );
}
