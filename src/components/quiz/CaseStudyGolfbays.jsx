import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './CaseStudyGolfbays.css';

/**
 * Case study 5A — GolfBays ("cold-traffic" route off Q5), built to the
 * "Quiz Case Studies [ 5A - Golfsbay ]" reference. Three stacked sections:
 *   1. split hero — dark textured panel (headline + proof paragraph +
 *      script band) | light panel (Case Study script + phone mockup asset,
 *      THIS WAY doodle)
 *   2. BEFORE / AFTER comparison grid on white
 *   3. dark "Your Turn" CTA card + keyline footer
 * Theme-aware like the other designed slides (maroon on the main route,
 * green on the gate route).
 */

/* Dark accent for filled chips/cards + light card fill, per theme
   (shared with the other designed case-study screens) */
export const ACCENT = { maroon: '#5d1b4e', green: '#152638', blue: '#152638' };
export const CARD = { maroon: '#f2e5f6', green: '#e4fbff', blue: '#e4fbff' };
/* Sweep tone for the dark chip on the light CTA card */
export const CTA_TONE = { maroon: 'plum', green: 'navy', blue: 'navy' };

export default function CaseStudyGolfbays({ theme, onBack, onContinue }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--cs-accent': ACCENT[theme.name] || ACCENT.maroon,
    '--cs-card': CARD[theme.name] || CARD.maroon,
    '--cs-ink': theme.name === 'maroon' ? '#391129' : '#152638',
  };

  return (
    <div className={`cs5a quiz-screen--${theme.name}`} style={themeVars}>
      {/* ============ 1. HERO — split ============ */}
      <section className="cs5a__hero">
        <div className="cs5a__left">
          <SeamBadge src="/assets/circle-doodle-2.png" />
          <div className="question-panel__top">
            <div className="question-panel__logo-box">
              <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
            </div>
            <span className="question-panel__top-line" aria-hidden="true" />
          </div>

          <div className="cs5a__frame">
            <div className="cs5a__left-body">
              <div className="cs5a__mobile-back">
                <BackLink onBack={onBack} />
              </div>
            <p className="cs5a__lead">
              {"Strange thing about ROAS: if you're spending "}
              <HighlightSweep tone={sweepToneFor(theme.name)}>
                $10k+/mo on ads
              </HighlightSweep>
              {', ROAS shows you the handful who bought and ignores the potential buyers who clicked, browsed, and bounced'}
            </p>

            <p className="cs5a__paren">(and you paid for every one of them)</p>

            <hr className="cs5a__rule" />

            <p className="cs5a__para">
              {'GolfBays went from having a discount opt-in to a quiz opt-in that landed them an additional 530 demos a month and £97,000+ in direct site revenue from the same Shopify traffic they were already paying for.'}
            </p>
            </div>

            <div className="cs5a__script-band">your traffic is worth more.</div>
          </div>
        </div>

        <div className="cs5a__right">
          <div className="answer-panel__topbar">
            <BackLink onBack={onBack} />
            <span className="answer-panel__topbar-line" aria-hidden="true" />
            <img
              className="answer-panel__topbar-icon"
              src="/assets/small-nomads-icon.png"
              alt=""
              aria-hidden="true"
            />
          </div>
          <img
            className="cs5a__hero-img"
            src="/assets/cs-5a-golfbays.webp"
            alt="GolfBays website on a phone under the Case Study script"
          />
        </div>
      </section>

      {/* ============ 2. BEFORE / AFTER ============ */}
      <section className="cs5a__ba">
        <div className="cs5a__ba-grid">
          <h2 className="cs5a__ba-head cs5a__ba-head--before">
            BEFORE
            <span>Compounding RPV™ OS</span>
          </h2>
          <h2 className="cs5a__ba-head cs5a__ba-head--after">
            AFTER
            <span>Compounding RPV™ OS</span>
          </h2>

          <div className="cs5a__bcard cs5a__bcard--1">
            <span className="cs5a__chip">Low Demo Conversion</span>
            <div className="cs5a__bcard-body">
              <img
                className="cs5a__bullet-arrow"
                src="/assets/arrow-white.png"
                alt=""
                aria-hidden="true"
              />
              <p className="cs5a__btext">
                <strong>440,000</strong>
                {' Shopify sessions with 1 demo booked for every '}
                <strong>2,500 visitors</strong>
                {' (a 0.04% visitor-to-demo conversion rate) underneath it'}
              </p>
            </div>
          </div>

          <div className="cs5a__acard cs5a__acard--1">
            <img
              className="cs5a__check"
              src="/assets/tick-doodle.png"
              alt=""
              aria-hidden="true"
            />
            <span className="cs5a__chip cs5a__chip--light">
              Personalised Recommendations
            </span>
            <p className="cs5a__atext">
              {'We reverse-engineered hundreds of their best demos into a personalised product recommendation engine'}
            </p>
            <div className="cs5a__abullets">
              <div className="cs5a__abullet">
                <img src="/assets/arrow-white.png" alt="" aria-hidden="true" />
                <p>{'Coupled with emotional messaging around the real payoff,'}</p>
              </div>
              <div className="cs5a__abullet">
                <img src="/assets/arrow-white.png" alt="" aria-hidden="true" />
                <p>{'Such as bonding over Christmas holidays in the room that was of no use before installing a GolfBay'}</p>
              </div>
            </div>
          </div>

          <div className="cs5a__scard cs5a__scard--1">
            <div className="cs5a__stat">14%</div>
            <p className="cs5a__stat-sub">of quiz takers bought directly</p>
            <span className="cs5a__chip cs5a__chip--light">without a demo</span>
          </div>

          <div className="cs5a__bcard cs5a__bcard--2">
            <span className="cs5a__chip">Product Overload</span>
            <div className="cs5a__bcard-body">
              <img
                className="cs5a__bullet-arrow"
                src="/assets/arrow-white.png"
                alt=""
                aria-hidden="true"
              />
              <p className="cs5a__btext">
                {'Buyers knew they wanted to purchase, but '}
                <strong>400+ products</strong>
                {' created enough decision fatigue that they stalled, and the demos that did get booked were spent on product education instead of closing'}
              </p>
            </div>
          </div>

          <div className="cs5a__acard cs5a__acard--2">
            <img
              className="cs5a__check"
              src="/assets/tick-doodle.png"
              alt=""
              aria-hidden="true"
            />
            <span className="cs5a__chip cs5a__chip--light">Revenue &amp; Demos</span>
            <p className="cs5a__atext">
              {'14 out of every 100 quiz takers bought directly without a demo, and the '}
              <strong>£97,000+</strong>
              {" doesn't include a single pound from "}
              <strong>530+ additional</strong>
              {' demos booked through the quiz or quiz takers who then visited the physical store'}
            </p>
          </div>

          <div className="cs5a__scard cs5a__scard--2">
            <div className="cs5a__stat">£97,000+</div>
            <p className="cs5a__stat-sub">
              <strong>530+ additional</strong>
              {' demos'}
            </p>
          </div>
        </div>
      </section>

      {/* ============ 3. YOUR TURN CTA ============ */}
      <section className="cs5a__cta">
        <img
          className="cs5a__turn"
          src="/assets/your-turn-doodle.png"
          alt=""
          aria-hidden="true"
        />

        <div className="cs5a__cta-frame">
        <div className="cs5a__cta-card">
          <p className="cs5a__cta-small">
            {"When you build a pre-sales experience that mimics your best sales conversations, the one who wasn't"}
            <br />
            {' thinking about buying starts thinking about it, and the one who was, feels certain enough to purchase'}
          </p>

          <h2 className="cs5a__cta-head">
            {'Want to see what it would take you to add an '}
            <HighlightSweep tone={CTA_TONE[theme.name] || 'plum'}>
              extra $125,000+
            </HighlightSweep>
            {' to your MRR with the traffic you already have?'}
          </h2>

          <img
            className="cs5a__cta-arrow"
            src="/assets/curve-white-arrow.png"
            alt=""
            aria-hidden="true"
          />

          <div className="cs5a__cta-row">
            <button type="button" className="q-btn cs5a__continue" onClick={onContinue}>
              Follow along
            </button>
          </div>
        </div>

        <div className="cs5a__footer" aria-hidden="true">
          <div className="cs5a__footer-hint" />
          <div className="cs5a__footer-cell">
            <img src="/assets/nomads-icon.png" alt="" />
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
