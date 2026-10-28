import { RED_CALLOUT, CTA } from '../copy.js';
import { redMetricRows, fill } from '../resolveTokens.js';
import { emphasize } from '../emphasize.jsx';
import { keepTogether } from '../keepTogether.jsx';
import { ga } from '../../analytics/ga.js';
import './RedMetricsCallout.css';

/**
 * Red-metric callout — block 3 of the QC hero artifact (QC item 3), right
 * under the metric table: names how many metrics are red, shows each one's
 * today → goal, then the two CTAs, centred (QC item 7: the workshop button
 * sits right after the red metrics). ResultsPage renders it only when a
 * cell is red, the same gate as RedMetricsWorkshop below it.
 */
export default function RedMetricsCallout({ result, tokens }) {
  const c = RED_CALLOUT;
  const reds = redMetricRows(result);
  if (!reds.length) return null;

  const nameFor = (key) => {
    const n = c.names[key];
    return typeof n === 'string' ? n : n[result.path];
  };
  const subject =
    reds.length === 1 ? c.headOne : fill(c.headMany, { red_count: String(reds.length) });
  const words = c.workshopLabel.split(' ');
  const workshopLast = words.pop();
  const workshopHead = words.join(' ');

  return (
    <section className="rrc">
      <div className="rrc__inner">
        <p className="rrc__eyebrow">{c.eyebrow}</p>

        <h2 className="rrc__headline">
          {subject} {c.headMid}{' '}
          <span className="rrc__val rrc__val--current">{tokens.current_rpv}</span> {c.headInstead}{' '}
          <span className="rrc__val rrc__val--goal">{tokens.goal_rpv}</span>
          {c.headEnd}
        </h2>

        <ul className="rrc__cards">
          {reds.map((row) => (
            <li key={row.key} className="rrc__card">
              <p className="rrc__name">{nameFor(row.key)}</p>
              <p className="rrc__nums">
                <span className="rrc__val rrc__val--current">{row.current}</span>
                <span className="rrc__arrow" aria-hidden="true">
                  {' '}→{' '}
                </span>
                <span className="rrc__val rrc__val--goal">{row.goal}</span>
              </p>
            </li>
          ))}
        </ul>

        <p className="rrc__body">{emphasize(c.body, [c.bodyBold])}</p>

        <div className="rrc__ctas">
          <a
            className="rrc__btn rrc__btn--workshop"
            href={CTA.workshop.href}
            onClick={() => ga.ctaClick(CTA.workshop.id)}
          >
            {/* the arrow hugs the last word, so it never strands at the
                button's edge when the label wraps */}
            <span>
              {workshopHead}{' '}
              <span className="rrc__nowrap">
                {workshopLast}
                <span className="rrc__btn-arrow" aria-hidden="true">
                  {' '}→
                </span>
              </span>
            </span>
          </a>
          <a
            className="rrc__btn rrc__btn--book"
            href={CTA.book.href}
            target="_blank"
            rel="noopener"
            onClick={() => ga.ctaClick(CTA.book.id)}
          >
            {keepTogether(c.bookLabel, 'game-plan call')}
          </a>
        </div>

        <p className="rrc__caption">{c.caption}</p>
      </div>
    </section>
  );
}
