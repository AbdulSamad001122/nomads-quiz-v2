import { NOT_JUST_SITE } from '../copy.js';
import './NotJustSite.css';

const brJoin = (lines) =>
  lines.map((line, i) => (
    <span key={line.slice(0, 14)}>
      {line}
      {i < lines.length - 1 ? ' ' : ''}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));

/**
 * Section — "And it's not just the site." split screen (copy doc row 10).
 * Left: cream paper panel with keyline, the eagle art with the baked
 * ALL-CAPS headline, and the plum "9 in 10 teams…" paragraph.
 * Right: navy panel — white rule with compass tip, "So what if you could
 * earn more…" heading, then the doc copy with the four chevron bullets
 * (white brush chevron recoloured plum via mask).
 */
export default function NotJustSite() {
  const c = NOT_JUST_SITE;
  return (
    <section className="rns">
      <div className="rns__left">
        <div className="rns__keyline" aria-hidden="true" />
        <div className="rns__stick">
          <img
            className="rns__eagle"
            src="/assets/results-njs-eagle.webp"
            alt={c.eagleAlt}
            width="1560"
            height="1497"
          />
          <p className="rns__sub">{brJoin(c.subLines)}</p>
        </div>
      </div>
      <div className="rns__right">
        <div className="rns__rule" aria-hidden="true">
          <span className="rns__rule-line" />
          <img src="/assets/results-njs-compass.png" alt="" width="233" height="196" />
        </div>
        <h2 className="rns__heading">{brJoin(c.headingLines)}</h2>
        <p className="rns__p">{brJoin(c.hookLines)}</p>
        <p className="rns__p rns__p--bold">{c.becauseBold}</p>
        <p className="rns__p">{brJoin(c.throwLines)}</p>
        <ul className="rns__bullets">
          {c.bullets.map((b) => (
            <li className="rns__bullet" key={b.slice(0, 14)}>
              <span className="rns__chev" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
        <p className="rns__p rns__tail">{c.bulletsTail}</p>
        <p className="rns__p rns__gap-lg">{brJoin(c.compoundingLines)}</p>
        <p className="rns__p">{brJoin(c.scaleLines)}</p>
        <p className="rns__p">{brJoin(c.goalLines)}</p>
      </div>
    </section>
  );
}
