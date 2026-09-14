import { PILLAR_TWO_LOOPS } from '../copy.js';
import './PillarTwoLoops.css';

/**
 * Pillar two — feedback loops: white copy panel with the five swoosh
 * bullets and the behavioral/qualitative chips, teal gradient panel with
 * the four-quadrant loop diagram.
 * Lives inside the pillars accordion (PANELS['02']).
 */
export default function PillarTwoLoops() {
  const p = PILLAR_TWO_LOOPS;

  return (
    <div className="rqf">
      <div className="rqf__left">
        <div className="rqf__body">
          <h3 className="rqf__headline">{p.headline}</h3>
          <p className="rqf__para">{p.intro}</p>

          <ul className="rqf__bullets">
            {p.bullets.map((b) => (
              <li className="rqf__bullet" key={b}>
                <img src="/assets/results-swoosh-navy.png" alt="" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="rqf__para">
            {p.captureBefore} <strong>{p.captureBold}</strong> {p.captureAfter}
          </p>

          <span className="rqf__chip">{p.behavioralChip}</span>
          <p className="rqf__para rqf__para--tight">{p.behavioral}</p>

          <span className="rqf__chip">{p.qualitativeChip}</span>
          <p className="rqf__para rqf__para--tight">{p.qualitative}</p>

          <p className="rqf__para">{p.closing1}</p>
          <p className="rqf__para">{p.closing2}</p>
        </div>
      </div>

      <div className="rqf__right">
        <img
          className="rqf__loop"
          src="/assets/results-p2-loop.webp"
          alt="Feedback loop — Visitors (messaging) → Funnel (messaging) → Sales Calls (buyer conversations) → Insights (sharper messaging)"
        />
      </div>
    </div>
  );
}
