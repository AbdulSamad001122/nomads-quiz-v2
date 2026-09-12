import { CRPS_INTRO } from '../copy.js';
import './CompoundingIntro.css';

/**
 * Section — "This is where Compounding Revenue Per Subscriber™ comes in."
 * Dark navy textured bg: headline, two white RPV/RPS cards, then the
 * keyline-framed potential row (label + $1.5M/year → "It can become" card
 * + plum plus badge + ice compounding card).
 */
export default function CompoundingIntro() {
  return (
    <section className="rcx">
      <h2 className="rcx__headline">
        {CRPS_INTRO.headlineLines[0]}
        <br /> {CRPS_INTRO.headlineLines[1]}
      </h2>

      <div className="rcx__cards">
        {CRPS_INTRO.cards.map((card, i) => (
          <div key={i} className="rcx__card">
            <img className="rcx__card-icon" src={card.icon} alt="" aria-hidden="true" />
            <p className="rcx__card-text">
              {card.lines.map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {j > 0 && ' '}
                  {line}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <div className="rcx__potential">
        <div className="rcx__left">
          <p className="rcx__left-label">{CRPS_INTRO.potentialLabel}</p>
          <p className="rcx__left-big">{CRPS_INTRO.potentialBig}</p>
          <p className="rcx__left-sub">{CRPS_INTRO.potentialSub}</p>
        </div>

        <img className="rcx__arrow" src="/assets/curve-white-arrow.png" alt="" aria-hidden="true" />

        <div className="rcx__becard">
          <span className="rcx__chip">{CRPS_INTRO.becomeChip}</span>
          <div className="rcx__becard-row">
            <span className="rcx__bicon">
              <img src="/assets/results-icon-graphbar.png" alt="" aria-hidden="true" />
            </span>
            <div>
              <p className="rcx__benum">{CRPS_INTRO.becomeBig}</p>
              <p className="rcx__besub">{CRPS_INTRO.becomeSub}</p>
            </div>
          </div>
        </div>

        <span className="rcx__vdiv" aria-hidden="true" />
        <span className="rcx__plus" aria-hidden="true">
          +
        </span>

        <div className="rcx__icecard">
          <span className="rcx__icecircle">
            <img src="/assets/results-icon-coins.png" alt="" aria-hidden="true" />
          </span>
          <p className="rcx__icetext">{CRPS_INTRO.iceText}</p>
        </div>
      </div>
    </section>
  );
}
