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
        <p className="rta__lead">{TEAM_APPROACH.lead}</p>

        <div className="rta__bars">
          {TEAM_APPROACH.bars.map((bar) => (
            <div key={bar.variant} className={`rta__bar rta__bar--${bar.variant}`}>
              <img
                className="rta__bar-icon"
                src={
                  bar.variant === 'cream'
                    ? '/assets/results-icon-nomads-plum.png'
                    : '/assets/results-icon-nomads-white.png'
                }
                alt=""
                aria-hidden="true"
              />
              {bar.text}
            </div>
          ))}
        </div>

        <p className="rta__para">{TEAM_APPROACH.para1}</p>

        <p className="rta__para">
          {TEAM_APPROACH.para2Lines[0]}
          <br /> {TEAM_APPROACH.para2Lines[1]}
        </p>

        <p className="rta__para">
          {TEAM_APPROACH.para3Lines[0]}
          <br /> {TEAM_APPROACH.para3Lines[1]}
          <br /> {TEAM_APPROACH.para3Lines[2]}
        </p>
      </div>
    </section>
  );
}
