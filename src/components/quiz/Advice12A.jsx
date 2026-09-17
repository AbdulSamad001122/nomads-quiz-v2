import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep from '../primitives/HighlightSweep.jsx';
import useLeftAlignOnWrap from '../primitives/useLeftAlignOnWrap.js';
import './QuizScreen.css';
import './Advice12A.css';

/**
 * Advice slide 12A ("call-heavy" answer on Q12) — built to the 12-A
 * reference: dark textured top with keyline frame + centered headline,
 * white infographic card overlapping into the ice-blue body, the
 * three advice cards (lavender / plum / navy) with their icons, the
 * closing line and Continue. Fixed palette per the reference (not
 * theme-rotated).
 */
export default function Advice12A({ onBack, onContinue }) {
  const [headRef, leftAlign, headWidth] = useLeftAlignOnWrap(4);
  const [midRef, midLeftAlign] = useLeftAlignOnWrap(3);

  return (
    <div className="a12 a12--a">
      {/* ---------- dark top ---------- */}
      <section className="a12__top">
        <SeamBadge src="/assets/circle-doodle-2.png" />
        <div className="question-panel__top">
          <div className="question-panel__logo-box">
            <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
          </div>
          <span className="question-panel__top-line" aria-hidden="true" />
        </div>

        <div className="a12__frame">
          <div className="a12__back">
            <BackLink onBack={onBack} />
          </div>
          <h1
            ref={headRef}
            className={`a12__headline${leftAlign ? ' a12__headline--left' : ''}`}
          >
            {'Put an end to attracting doubtful buyers and tire-kickers by ditching '}
            <HighlightSweep tone="iceblue">
              educating buyers on the call.
            </HighlightSweep>
          </h1>
          <div
            className={`a12__frame-cta${leftAlign ? ' a12__frame-cta--left' : ''}`}
            style={headWidth ? { maxWidth: headWidth } : undefined}
          >
            <button
              type="button"
              className="q-btn q-btn--onDark a12__frame-continue"
              onClick={onContinue}
            >
              Continue
            </button>
          </div>

          <div className="a12__info-card a12__info-card--top">
            <img
              className="a12__info-img"
              src="/assets/advice-12a-infographic.webp"
              alt="Now vs with RPV™: pre-sales journey comparison from funnel entry to the call"
            />
          </div>
        </div>
      </section>

      {/* ---------- ice-blue body ---------- */}
      <section className="a12__body">
        <div className="a12__info-card a12__info-card--body">
          <img
            className="a12__info-img"
            src="/assets/advice-12a-infographic.webp"
            alt="Now vs with RPV™: pre-sales journey comparison from funnel entry to the call"
          />
        </div>


        <h2
          ref={midRef}
          className={`a12__mid-head${midLeftAlign ? ' a12__headline--left' : ''}`}
        >
          {'If you want to bring your '}
          <HighlightSweep tone="navy">close rate up</HighlightSweep>
          {', and shrink your sales cycle:'}
        </h2>

        <div className="a12__cards">
          <div className="a12__card a12__card--lavender">
            <span className="a12__icon">
              <img src="/assets/icon-12a-board.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">Pre-educate before the call</h3>
            <p className="a12__card-text">
              On your process, differentiation, price range. Let the call be
              for the last few questions, not convince-me-you-are-not-a-knob.
            </p>
          </div>

          <div className="a12__card a12__card--plum">
            <span className="a12__icon">
              <img src="/assets/icon-12a-aim.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">
              Personalise the pre-sales experience
            </h3>
            <p className="a12__card-text">
              Alex and Adam have different use cases, different objections,
              different reasons to buy.
            </p>
            <p className="a12__card-text">
              Are you showing them relevant features, the right testimonials,
              and handling their specific objections before they ever speak
              to you?
            </p>
          </div>

          <div className="a12__card a12__card--navy">
            <span className="a12__icon">
              <img src="/assets/icon-12a-funnel.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">
              Filter misfits early without lowering your threshold
            </h3>
            <p className="a12__card-text">
              Stop hoping a call will convert someone who was never the right
              fit. There are enough qualified buyers out there.
            </p>
            <p className="a12__card-text">
              Let the tire-kickers filter themselves out naturally.
            </p>
          </div>
        </div>

      </section>

      {/* ---------- Your Turn CTA (case-study language) ---------- */}
      <section className="a12__cta">
        <img
          className="a12__turn"
          src="/assets/your-turn-doodle-navy.png"
          alt=""
          aria-hidden="true"
        />
        <div className="a12__cta-frame">
          <div className="a12__cta-card">
            <h2 className="a12__cta-head">
              {'Reserve the calls for buyers to '}
              <HighlightSweep tone="navy">
                confirm their commitment
              </HighlightSweep>
              {', not to build it from scratch.'}
            </h2>
            <img
              className="a12__cta-arrow"
              src="/assets/curve-white-arrow.png"
              alt=""
              aria-hidden="true"
            />
            <div className="a12__cta-row">
              <button type="button" className="q-btn" onClick={onContinue}>
                Continue
              </button>
            </div>
          </div>
          <div className="a12__footer" aria-hidden="true">
            <div className="a12__footer-hint" />
            <div className="a12__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
