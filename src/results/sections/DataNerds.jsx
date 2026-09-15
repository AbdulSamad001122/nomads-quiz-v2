import { DATA_NERDS } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import './DataNerds.css';

/**
 * "For the data nerds" — white card on the topo/dice texture with the
 * playful-compass badge straddling the top seam (design reference,
 * 2026-09-15). Unconditional: the copy doc gives this its own Heading3
 * outside the ad module's blue box, so EVERY taker gets it — it used to be
 * nested inside the ad module's purple panel and vanished for
 * non-advertisers.
 */
export default function DataNerds() {
  const c = DATA_NERDS;

  return (
    <section className="rdn">
      <img
        className="rdn__badge"
        src="/assets/results-badge-playful-2x.png"
        alt=""
        aria-hidden="true"
        width="804"
        height="805"
      />

      <div className="rdn__ring">
        <div className="rdn__card">
          <h2 className="rdn__title">{c.title}</h2>

          <p className="rdn__p">{c.p1}</p>
          <p className="rdn__p">{c.p2}</p>

          <ul className="rdn__channels">
            {c.channels.map((ch) => (
              <li className="rdn__channel" key={ch}>
                <span className="rdn__swoosh" aria-hidden="true" />
                {ch}
              </li>
            ))}
          </ul>

          <p className="rdn__chip">{c.chip}</p>

          {/* TODO: real RPV-by-channel URL when provided */}
          <a className="q-btn rdn__btn" href="#" onClick={() => ga.ctaClick('rpv_by_channel')}>
            {c.button}
          </a>
        </div>
      </div>
    </section>
  );
}
