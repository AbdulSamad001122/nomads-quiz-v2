import { RED_METRICS } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import WorkshopVideo from './WorkshopVideo.jsx';
import './RedMetricsWorkshop.css';

/**
 * Red-metrics workshop section — the Sep 19 doc's insert between the metric
 * table and the capped blocks, built to the reference design (Sep 21).
 * Rendered ONLY when the taker's table has a red cell: ResultsPage gates it
 * on anyMetricRed() (Yemi ruling 2026-09-21 — capped takers included).
 *
 * Quadrant cards reuse the landing page's FourAreas card language (white
 * card, plum keyline + 8px offset shadow, hand-drawn icon) per the user;
 * icons are the landing set copied to results-quadrant-icon-1..4.png.
 * The call option + calendar that follows the video is its own section
 * (GamePlanCta with RED_METRICS_CALL), rendered next to this in ResultsPage.
 */
export default function RedMetricsWorkshop({ tokens }) {
  const c = RED_METRICS;
  return (
    <section className="rmw">
      <div className="rmw__dark">
        <span className="rmw__badge" aria-hidden="true">
          <img src="/assets/results-badge-playful.png" alt="" />
        </span>

        <p className="rmw__lead">{c.lead}</p>

        <h2 className="rmw__headline">
          {c.headBefore} <span className="rmw__hl">{c.headHighlight}</span>{' '}
          {c.headAfter}
        </h2>


        <p className="rmw__keeping">
          {c.keepingBefore}{' '}
          <span className="rmw__val rmw__val--current">{tokens.current_rpv}</span>{' '}
          {c.keepingMid}{' '}
          <span className="rmw__val rmw__val--goal">{tokens.goal_rpv}</span>
        </p>

        <div className="rmw__panel">
          <p className="rmw__ten">{c.tenQuestions}</p>
          <span className="rmw__chip">{c.forExample}</span>

          <div className="rmw__grid">
            {c.quadrants.map((q) => (
              <div className="rmw__card" key={q.chip}>
                <img className="rmw__icon" src={q.icon} alt="" aria-hidden="true" />
                <span className="rmw__card-chip">{q.chip}</span>
                <h3 className="rmw__card-title">{q.title}</h3>
                <p className="rmw__card-q">{emphasize(q.q, [q.bold])}</p>
              </div>
            ))}
          </div>
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
