import { BEHIND_NUMBER } from '../copy.js';
import './BehindTheNumber.css';

/**
 * Section — "Behind the number": split layout. Left: dark teal nautical
 * chart with chip, script-W headline, ice-highlighted "RPV™ number:".
 * Right: ice panel, "We looked at:" rule with compass icon, five numbered
 * cards alternating white / offset navy with brush-script numerals.
 */
export default function BehindTheNumber() {
  const [l1, l2, l3] = BEHIND_NUMBER.headlineLines;
  const [beforeW, afterW] = l1.split(/w(?=hat)/);
  const [s1, s2] = splitAfter(BEHIND_NUMBER.sub, BEHIND_NUMBER.subBreakAfter);

  return (
    <section className="rbn">
      <div className="rbn__left">
        <div className="rbn__left-inner">
          <span className="rbn__chip">{BEHIND_NUMBER.chip}</span>
          <h2 className="rbn__headline">
            {beforeW}
            <span className="rbn__script-w">W</span>
            {afterW} {l2} <span className="rbn__hl">{l3}</span>
          </h2>
          <p className="rbn__sub">
            {s1} {s2}
          </p>
        </div>
      </div>

      <div className="rbn__right">
        <div className="rbn__right-inner">
        <div className="rbn__rule">
          <span className="rbn__rule-chip">{BEHIND_NUMBER.lookedAt}</span>
          <span className="rbn__rule-line" aria-hidden="true" />
          <img className="rbn__rule-icon" src="/assets/results-compass-navy.png" alt="" aria-hidden="true" width="426" height="426" />
        </div>

        <ol className="rbn__list">
          {BEHIND_NUMBER.items.map((item, i) => (
            <li key={i} className={`rbn__item${i % 2 === 1 ? ' rbn__item--navy' : ''}`}>
              <span className="rbn__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="rbn__item-text">{item}</span>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}

function splitAfter(text, marker) {
  const idx = text.indexOf(marker) + marker.length;
  return [text.slice(0, idx), text.slice(idx).trimStart()];
}
