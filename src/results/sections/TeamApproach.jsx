import { TEAM_APPROACH } from '../copy.js';
import './TeamApproach.css';

/**
 * Section — team approach: left half is the supplied compass image (full
 * bleed), right half is paper-texture cream with the four-heads lead,
 * three coloured bars and closing paragraphs.
 */
export default function TeamApproach() {
  return (
    <section className="rta">
      <div className="rta__left">
        <img
          src="/assets/results-team-compass.webp"
          alt="Team approach — and here's why I recommend doing it with your team. One team. One view. One shared goal."
        />
      </div>

      <div className="rta__right">
        <div className="rta__right-inner">
        <p className="rta__lead">{TEAM_APPROACH.lead}</p>

        <div className="rta__bars">
          {TEAM_APPROACH.bars.map((bar) => (
            <div key={bar.variant} className={`rta__bar rta__bar--${bar.variant}`}>
              <span className="rta__bar-icon" aria-hidden="true" />
              {bar.text}
            </div>
          ))}
        </div>

        <p className="rta__para">{TEAM_APPROACH.para1}</p>

        <p className="rta__para">{TEAM_APPROACH.para2Lines.join(' ')}</p>

        <p className="rta__para">{TEAM_APPROACH.para3Lines.join(' ')}</p>
        </div>
      </div>
    </section>
  );
}
