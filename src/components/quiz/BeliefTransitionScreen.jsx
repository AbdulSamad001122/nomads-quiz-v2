import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './BeliefTransitionScreen.css';

/**
 * "Getting real" transition slide (before the belief/case-study slides) —
 * FULL-BLEED layout per the "TRANSITION SCREEN BEFORE BELIEF SLIDES"
 * design reference: one dark themed background spanning the whole screen,
 * keyline frame, centered 2-line headline with a highlight box, curved
 * arrow doodle pointing at the CTA. Theme-driven, slotting into the
 * blue → maroon → green rotation.
 */
export default function BeliefTransitionScreen({ theme, onBack, onContinue }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-label-bg': theme.labelBg,
    '--t-label-text': theme.labelText,
    '--t-back-text': theme.backText,
    '--t-highlight-bg': theme.mediaSelectedBg,
  };

  return (
    <div
      className={`belief-screen quiz-screen--${theme.name}`}
      style={themeVars}
    >
      <SeamBadge src="/assets/circle-doodle-2.png" />

      <div className="belief__top">
        <div className="belief__top-left">
          <div className="question-panel__logo-box">
            <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
          </div>
          <span className="belief__top-line" aria-hidden="true" />
        </div>
        <div className="belief__top-right">
          <span className="belief__top-line belief__top-line--long" aria-hidden="true" />
        </div>
      </div>

      <div className="belief__frame">
        <div className="belief__body">
          <button type="button" className="belief__back" onClick={onBack}>
            <span aria-hidden="true">&#8249;</span> Back
          </button>
          <h1 className="belief__headline">
            <span className="belief__script">Okay,</span>
            {" let's get real about what"}
            <br />
            {' it actually takes to '}
            <HighlightSweep tone={sweepToneFor(theme.name)}>
              hit 60 sales
            </HighlightSweep>
          </h1>

          <div className="belief__cta-wrap">
            <img
              className="belief__arrow"
              src="/assets/curve-white-arrow.png"
              alt=""
              aria-hidden="true"
            />
            <button
              type="button"
              className="q-btn q-btn--onDark belief__cta"
              onClick={onContinue}
            >
              Let's see it &#8594;
            </button>
          </div>
        </div>

        <div className="belief__footer">
          <div className="belief__footer-hint" />
          <div className="belief__footer-cell">
            <img src="/assets/nomads-icon.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
