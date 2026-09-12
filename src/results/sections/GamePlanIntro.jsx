import { GAMEPLAN_INTRO } from '../copy.js';
import './GamePlanIntro.css';

function Lines({ lines }) {
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {i > 0 && ' '}
      {line}
    </span>
  ));
}

/**
 * Section — "Your Next $125k/Mo Game Plan" opener: 125k brush bg with
 * keyline frame, headline + scorecard sub, the pink/ice labelled cards,
 * down-arrows doodle and the closing lines.
 */
export default function GamePlanIntro() {
  return (
    <section className="rgi">
      <div className="rgi__keyline" aria-hidden="true" />

      <h2 className="rgi__headline">{GAMEPLAN_INTRO.headline}</h2>

      <p className="rgi__sub">
        <Lines lines={GAMEPLAN_INTRO.subLines} />
      </p>

      <div className="rgi__cards">
        {GAMEPLAN_INTRO.cards.map((card) => (
          <div key={card.variant} className={`rgi__card rgi__card--${card.variant}`}>
            <span className="rgi__card-label">{card.label}</span>
            <p className="rgi__card-text">
              <Lines lines={card.lines} />
            </p>
          </div>
        ))}
      </div>

      <img className="rgi__arrows" src="/assets/results-down-arrows.png" alt="" aria-hidden="true" />

      <p className="rgi__closing">
        <Lines lines={GAMEPLAN_INTRO.closingLines} />
      </p>
    </section>
  );
}
