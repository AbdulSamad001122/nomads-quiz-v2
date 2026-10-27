import { RED_METRICS, METRICS } from '../copy.js';
import { redMetricRows } from '../resolveTokens.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import WorkshopVideo from './WorkshopVideo.jsx';
import './RedMetricsWorkshop.css';

const pad2 = (n) => String(n).padStart(2, '0');
const dollars = (x) => `$${Math.round(x)}`;

/**
 * Progress-bar scale for a red-metric card (V2 design): percentages run
 * 0%–100%; Revenue Per Subscriber™ runs $0 to goal × 1.25 (the design's
 * $8 goal → $10 end). The goal's own scale label is dropped when it would
 * collide with an end label — the green goal chip above already shows it.
 */
function barScale(key, current, goal) {
  const max = key === 'rps' ? goal * 1.25 : 1;
  const pos = (v) => Math.max(0, Math.min(100, (v / max) * 100));
  const mark = pos(goal);
  return {
    fill: pos(current),
    mark,
    start: key === 'rps' ? '$0' : '0%',
    end: key === 'rps' ? dollars(max) : '100%',
    showGoalLabel: mark >= 14 && mark <= 86,
  };
}

/**
 * Red-metrics workshop section. QC row 2 (Oct 2026): the top half is rebuilt
 * to Alefiya's "Workshop Quadrants V2" design — Midnight Blue ground, the
 * red-metric line as a white box (the loudest thing), one card per RED
 * metric (number, goal, progress bar, the quadrants that move it), and four
 * tinted quadrant tiles; a tile that moves a red metric gets a red outline
 * and that metric's number. The white close (answer line, workshop button,
 * video) is unchanged — the video moves to the workshop page in QC item 8.
 * Rendered ONLY when the taker's table has a red cell (ResultsPage gate,
 * Yemi 2026-09-21 — capped takers included).
 */
export default function RedMetricsWorkshop({ result, tokens }) {
  const c = RED_METRICS;
  const reds = redMetricRows(result);
  const labelFor = (key) => {
    const l = METRICS.rowLabels[key];
    return typeof l === 'string' ? l : l[result.path];
  };
  // the red rows each quadrant moves (drives its red outline + chips)
  const redsFor = (quadrant) => reds.filter((r) => c.metricQuadrants[r.key]?.includes(quadrant));

  return (
    <section className="rmw">
      <div className="rmw__dark">
        <span className="rmw__badge" aria-hidden="true">
          <img src="/assets/results-badge-playful.png" alt="" />
        </span>

        <p className="rmw__lead">{emphasize(c.lead, c.leadBold)}</p>

        <h2 className="rmw__headline">
          {c.headBefore} <span className="rmw__hl">{c.headHighlight}</span> {c.headAfter}
        </h2>

        {/* the red-metric line: white box, red border, pulsing red dot */}
        <p className="rmw__redbox">
          <span className="rmw__redbox-lab">
            <span className="rmw__dot" aria-hidden="true" />
            {c.keepingBefore}
          </span>{' '}
          {/* "$X instead of $Y" moves as one unit when the box wraps */}
          <span className="rmw__redbox-vals">
            <span className="rmw__n rmw__n--now">{tokens.current_rpv}</span>{' '}
            <span className="rmw__of">{c.keepingMid}</span>{' '}
            <span className="rmw__n rmw__n--goal">{tokens.goal_rpv}</span>
          </span>
        </p>

        <ul className="rmw__reds">
          {reds.map((row) => {
            const s = barScale(row.key, result.current[row.key], result.goal[row.key]);
            const isRps = row.key === 'rps';
            return (
              <li key={row.key} className="rmw__rm">
                <div className="rmw__rtop">
                  <span className="rmw__st">{c.redChip}</span>
                  <span className="rmw__links" aria-label={`Quadrants ${c.metricQuadrants[row.key].join(' and ')}`}>
                    {c.metricQuadrants[row.key].map((q) => (
                      <b key={q}>{pad2(q)}</b>
                    ))}
                  </span>
                </div>
                <span className="rmw__t">{labelFor(row.key)}</span>
                <div className="rmw__big">
                  <span className="rmw__now">{row.current}</span>
                  <span className="rmw__wt">{isRps ? c.whereasRps : c.whereasPct}</span>
                  <span className="rmw__goal">{row.goal}</span>
                  {isRps && <span className="rmw__wt">{c.rpsTail}</span>}
                </div>
                <div className="rmw__gt" role="img" aria-label={`${row.current} today, ${row.goal} goal`}>
                  <i className="rmw__fill" style={{ width: `${s.fill}%` }} />
                  <i className="rmw__mark" style={{ left: `${s.mark}%` }} />
                </div>
                <div className="rmw__gx" aria-hidden="true">
                  <span>{s.start}</span>
                  {s.showGoalLabel && (
                    <span className="rmw__gl" style={{ left: `${s.mark}%` }}>
                      {row.goal}
                    </span>
                  )}
                  <span>{s.end}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="rmw__ten">{emphasize(c.tenQuestions, c.tenBold)}</p>
        <p className="rmw__tap">{c.forExample}</p>

        <div className="rmw__quads">
          {c.quadrants.map((q, i) => {
            const linked = redsFor(i + 1);
            return (
              <div key={q.chip} className={`rmw__q rmw__q--${i + 1}${linked.length ? ' rmw__q--linked' : ''}`}>
                <div className="rmw__qtop">
                  <span className="rmw__qn">{q.chip}</span>
                  {linked.length > 0 && (
                    <span className="rmw__rcs">
                      {linked.map((r) => (
                        <span key={r.key} className="rmw__rc">
                          {r.current}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                <h3 className="rmw__qt">{q.title}</h3>
                <p className="rmw__qq">{emphasize(q.q, [q.bold])}</p>
              </div>
            );
          })}
        </div>

        <img
          className="rmw__down"
          src="/assets/results-down-arrows.png"
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="rmw__light">
        <div className="rmw__light-inner">
          <p className="rmw__answer">
            {c.answerBefore}{' '}
            <span className="rmw__val rmw__val--goal">{tokens.goal_rpv}</span>{' '}
            {c.answerAfter}
          </p>

          {/* TODO: real workshop URL when provided (same as NAV). */}
          <a
            className="q-btn rmw__btn"
            href="#"
            onClick={() => ga.ctaClick('watch_workshop')}
          >
            {c.ctaWorkshop}
          </a>
        </div>

        {/* the workshop video, autoplaying (muted) once it's in view */}
        <WorkshopVideo
          className="rmw__thumb"
          posterAlt="Diagnostic video — Alefiya scoring the four pillars on the board"
        />
      </div>
    </section>
  );
}
