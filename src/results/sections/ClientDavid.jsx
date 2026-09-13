import { CLIENT_DAVID } from '../copy.js';
import './ClientDavid.css';

function Lines({ lines }) {
  return lines.join(' ');
}

/**
 * Section — "Take my Client David.": dark left panel with the David
 * composition image, ice right panel with headline chip, three swoosh
 * bullets and the navy-bordered outcome box. The round "playful, yet
 * highly profitable" badge straddles the top seam at centre.
 */
export default function ClientDavid() {
  return (
    <section className="rcd">
      <span className="rcd__badge" aria-hidden="true">
        <img src="/assets/results-badge-playful.png" alt="" />
      </span>

      <div className="rcd__left">
        <img
          className="rcd__david"
          src="/assets/results-david.webp"
          alt="David Ledgerwood"
        />
      </div>

      <div className="rcd__right">
        <div className="rcd__right-inner">
        <h2 className="rcd__headline">{CLIENT_DAVID.headline}</h2>

        {CLIENT_DAVID.bullets.map((b, i) => (
          <div key={i} className="rcd__bullet">
            <img className="rcd__bullet-icon" src="/assets/nomads-icon-dark.png" alt="" aria-hidden="true" />
            <div>
              <p className="rcd__bullet-bold">{b.bold}</p>
              <p className="rcd__bullet-text">
                <Lines lines={b.lines} />
              </p>
            </div>
          </div>
        ))}

        <div className="rcd__box">
          {CLIENT_DAVID.boxParas.map((para, i) => (
            <p key={i} className="rcd__box-para">
              <Lines lines={para} />
            </p>
          ))}
          <p className="rcd__box-bold">{CLIENT_DAVID.boxBold}</p>
        </div>
        </div>
      </div>
    </section>
  );
}
