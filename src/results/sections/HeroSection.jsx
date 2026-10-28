import { HERO } from '../copy.js';
import { fill } from '../resolveTokens.js';
import './HeroSection.css';

/**
 * Section 1 — score hero, rebuilt for the QC round (Oct 2026) to the "RPV
 * Results Hero" artifact: the before/after Revenue Per Visitor pair is the
 * focal point — a red TODAY card, the jump ("6.6× growth"), a green YOUR GOAL
 * card — then the one-line formula. Alefiya's circle photo stays right, at
 * its old size (her Loom: "keep my photo as big as this one").
 */
export default function HeroSection({ tokens, capped = false }) {
  // values feed the cards' fit-to-width font size (see .rhero__card-value)
  const today = fill(HERO.today.value, tokens);
  const goal = fill(HERO.goal.value, tokens);
  // one shared size for both numbers, so the pair stays balanced when the
  // values differ in length ("$9.00" vs "$25.67") — QC items 1 and 4
  const len = Math.max(today.length, goal.length);

  return (
    <section className="rhero" id="rpv-score">
      <div className="rhero__grid">
        <div className="rhero__copy">
          <p className="rhero__intro">
            {HERO.introBefore} <span className="rhero__intro-chip">{HERO.introChip}</span>{' '}
            {HERO.introAfter}
          </p>

          <h1 className="rhero__headline">{HERO.headline}</h1>

          <div className="rhero__pair">
            <div className="rhero__card rhero__card--today">
              <p className="rhero__card-label">{HERO.today.label}</p>
              <p className="rhero__card-value" style={{ '--len': len }}>
                {today}
              </p>
              <p className="rhero__card-sub">{HERO.today.sub}</p>
            </div>

            <div className="rhero__jump">
              <span className="rhero__jump-arrow" aria-hidden="true">
                →
              </span>
              {tokens.rpv_multiple && (
                <span className="rhero__jump-chip">
                  <span className="rhero__jump-x">{tokens.rpv_multiple}</span>
                  <span className="rhero__jump-word">{HERO.multipleWord}</span>
                </span>
              )}
            </div>

            <div className="rhero__card rhero__card--goal">
              <p className="rhero__card-label">{HERO.goal.label}</p>
              <p className="rhero__card-value" style={{ '--len': len }}>
                {goal}
              </p>
              <p className="rhero__card-sub">{HERO.goal.sub}</p>
            </div>
          </div>

          {capped && <p className="rhero__capped">{HERO.cappedNote}</p>}

          <p className="rhero__formula">
            <strong>{HERO.formulaLead}</strong> {HERO.formulaRest}
          </p>
        </div>

        <div className="rhero__media">
          <img
            className="rhero__alefiya"
            src="/assets/results-hero-alefiya.webp"
            alt="Alefiya — keep scrolling to learn more"
          />
        </div>
      </div>
    </section>
  );
}
