import { BOUNCE_RATES } from '../copy.js';
import './BounceRates.css';

const brJoin = (lines) =>
  lines.map((line, i) => (
    <span key={line.slice(0, 14)}>
      {line}
      {i < lines.length - 1 ? ' ' : ''}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));

/**
 * Section — "That's where most teams stop." bounce-rate proof (copy doc
 * row 10, between the in-common card and the eagle split). Keyline-framed
 * white section: dark teal nautical band with the audit copy and white
 * chip, then the three baked Similarweb laptop cards (Groups 841–843).
 */
export default function BounceRates() {
  return (
    <section className="rbr">
      <div className="rbr__band">
        <div className="rbr__copy">
          <p className="rbr__p">{brJoin(BOUNCE_RATES.p1Lines)}</p>
          <p className="rbr__chip">{BOUNCE_RATES.chip}</p>
          <p className="rbr__p">{brJoin(BOUNCE_RATES.p2Lines)}</p>
        </div>
      </div>
      <div className="rbr__lower">
        <ul className="rbr__cards">
          {BOUNCE_RATES.cards.map((c) => (
            <li className="rbr__card" key={c.src}>
              <img src={c.src} alt={c.alt} width="854" height="790" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
