import { WALK_AWAY } from '../copy.js';
import './WalkAwayWith.css';

function Lines({ lines }) {
  return lines.join(' ');
}

/**
 * Section — "So here's what you walk away with." Cream speckle bg: left rule
 * + compass, EB headline with the big plum brush-script line (vertically
 * centred on the cards); right: the two stat cards (45% email / 14% demo) and
 * the maroon comparison band. "This way" doodle peeks in from the top-right.
 */
export default function WalkAwayWith() {
  return (
    <section className="rwa">
      <img className="rwa__doodle" src="/assets/results-this-way.png" alt="" aria-hidden="true" />

      <div className="rwa__left">
        <div className="rwa__rule" aria-hidden="true">
          <span className="rwa__rule-line" />
          <img className="rwa__rule-icon" src="/assets/results-compass-plum.png" alt="" />
        </div>
        <div className="rwa__intro">
          <h2 className="rwa__headline">
            {WALK_AWAY.headlinePlain}
            <br />
            <span className="rwa__script">{WALK_AWAY.headlineScript}</span>
          </h2>
          <p className="rwa__sub">
            <Lines lines={WALK_AWAY.subLines} />
          </p>
        </div>
      </div>

      <div className="rwa__right">
        <div className="rwa__cards">
          {WALK_AWAY.cards.map((card) => (
            <div key={card.variant} className={`rwa__card rwa__card--${card.variant}`}>
              <span className="rwa__card-circle">
                <img src={card.icon} alt="" aria-hidden="true" />
              </span>
              <p className="rwa__stat">{card.stat}</p>
              <span className="rwa__chip">{card.chip}</span>
              {card.paras.map((para, i) => (
                <p key={i} className="rwa__card-text">
                  <Lines lines={para} />
                </p>
              ))}
            </div>
          ))}
        </div>
        <p className="rwa__band">{WALK_AWAY.band}</p>
      </div>
    </section>
  );
}
