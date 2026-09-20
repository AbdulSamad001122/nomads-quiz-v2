import { HERO } from '../copy.js';
import { fill } from '../resolveTokens.js';
import './HeroSection.css';

/**
 * Section 1 — score hero. Dark gradient bg, left copy column with the live
 * annual-revenue number + RPV formula card, Alefiya circle right, angled
 * stone strip along the bottom cut.
 */
export default function HeroSection({ tokens }) {
  return (
    <section className="rhero" id="rpv-score">
      <div className="rhero__grid">
        <div className="rhero__copy">
          <p className="rhero__intro">
            {HERO.introBefore} <span className="rhero__intro-chip">{HERO.introChip}</span> {HERO.introAfter}
          </p>

          <p className="rhero__based">{HERO.basedOn}</p>

          <h1 className="rhero__headline">{HERO.headline}</h1>

          <div className="rhero__number-row">
            <span className="rhero__number">{fill(HERO.rpvFrom, tokens)}</span>
            <span className="rhero__number-arrow" aria-hidden="true">
              {HERO.rpvArrow}
            </span>
            <span className="rhero__number rhero__number--goal">
              {fill(HERO.rpvTo, tokens)}
            </span>
          </div>

          <p className="rhero__calc-line">{HERO.calcLine}</p>

          <div className="rhero__formula">
            <p className="rhero__formula-lead">{HERO.formula.lead}</p>
            <p className="rhero__formula-top">{HERO.formula.numerator}</p>
            <p className="rhero__formula-bottom">{HERO.formula.denominator}</p>
          </div>
        </div>

        <div className="rhero__media">
          <img
            className="rhero__alefiya"
            src="/assets/results-hero-alefiya.webp"
            alt="Alefiya — keep scrolling to learn more"
          />
        </div>
      </div>

      <div className="rhero__strip">
        <span>{fill(HERO.strip.left, tokens)}</span>
        <span className="rhero__strip-divider">{HERO.strip.divider}</span>
        <span>{HERO.strip.right}</span>
      </div>
    </section>
  );
}
