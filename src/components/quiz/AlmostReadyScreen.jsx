import SeamBadge from './parts/SeamBadge.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './BeliefTransitionScreen.css';

/**
 * "Your RPV is almost ready." transition (before Q12) — full-bleed themed
 * statement slide in the belief-screen layout family: dark themed
 * background, keyline frame, centered label + headline + line + CTA.
 * Slots into the blue → maroon → green rotation.
 */
export default function AlmostReadyScreen({ theme, onBack, onContinue }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-label-bg': theme.labelBg,
    '--t-label-text': theme.labelText,
    '--t-back-text': theme.backText,
  };

  return (
    <div
      className={`belief-screen almost-ready-screen quiz-screen--${theme.name}`}
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
          <span className="question-panel__label almost-ready__label">
            Nearly there
          </span>
          <h1 className="belief__headline">
            {'Your RPV is '}
            <HighlightSweep tone={sweepToneFor(theme.name)}>
              almost ready.
            </HighlightSweep>
          </h1>
          <p className="belief__line">Before we show you the numbers…</p>

          <div className="belief__cta-wrap">
            <button
              type="button"
              className="q-btn q-btn--onDark belief__cta"
              onClick={onContinue}
            >
              Continue &#8594;
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
