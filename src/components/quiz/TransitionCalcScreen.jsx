import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import ProgressBar from './parts/ProgressBar.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './TransitionCalcScreen.css';

/**
 * Transition-to-calculator slide (after the case studies) — split-screen
 * layout per the "Copy of Quiz (8)" design reference. Theme-driven like
 * QuizScreen/BenchmarkScreen, slotting into the blue → maroon → green
 * rotation.
 *
 * Left: headline + two paragraphs + CONTINUE.
 * Right: laptop mockup image (arrow + script baked into the asset),
 * progress bar.
 */
export default function TransitionCalcScreen({
  theme,
  onBack,
  onContinue,
  progressPercent,
}) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-label-bg': theme.labelBg,
    '--t-label-text': theme.labelText,
    '--t-step-badge-bg': theme.stepBadgeBg,
    '--t-step-badge-text': theme.stepBadgeText,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--t-option-bg': theme.optionBg,
    '--t-option-text': theme.optionText,
    '--t-option-number-bg': theme.optionNumberBg,
    '--t-option-number-text': theme.optionNumberText,
    '--t-option-selected-bg': theme.optionSelectedBg,
    '--t-option-selected-text': theme.optionSelectedText,
    '--t-progress-track': theme.progressTrack,
    '--t-progress-fill': theme.progressFill,
    '--t-progress-label': theme.progressLabel,
  };

  return (
    <div
      className={`quiz-screen transition-calc-screen quiz-screen--${theme.name}`}
      style={themeVars}
    >
      <section className="question-panel">
        <SeamBadge src="/assets/circle-doodle-2.png" />
        <div className="question-panel__top">
          <div className="question-panel__logo-box">
            <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
          </div>
          <span className="question-panel__top-line" aria-hidden="true" />
        </div>
        <div className="question-panel__frame">
          <div className="question-panel__body">
            <div className="question-panel__mobile-back">
              <BackLink onBack={onBack} />
            </div>
            <div className="question-panel__content transition-calc__content">
              <h1 className="transition-calc__headline">
                {'Most businesses know how much traffic they’re getting. But very few know how much revenue '}
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  each visitor
                </HighlightSweep>
                {' brings\u00a0in.'}
              </h1>
              <p className="transition-calc__para">
                The Revenue Per Visitor™ Calculator will show you exactly which
                acquisition channels are bringing in the most revenue, and which
                are bleeding money.
              </p>
              <p className="transition-calc__para">
                So you can see where the opportunity lies to add $1.5M in annual
                revenue from the visitors you’re already attracting, without
                increasing your marketing spend.
              </p>
              <button
                type="button"
                className="q-btn q-btn--onDark transition-calc__continue"
                onClick={onContinue}
              >
                Continue
              </button>
            </div>
          </div>
          <div className="question-panel__footer">
            <div className="question-panel__footer-hint" />
            <div className="question-panel__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="answer-panel transition-calc__panel">
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

        <div className="transition-calc__stage">
          <img
            className="transition-calc__laptop"
            src="/assets/laptop-calculator.webp"
            alt="Preview of the RPV™ calculator on a laptop"
          />
        </div>

        <ProgressBar percent={progressPercent} />
        <div className="answer-panel__mobile-footer" aria-hidden="true">
          <div className="answer-panel__mobile-hint" />
          <div className="answer-panel__mobile-cell">
            <img src="/assets/nomads-icon-dark.png" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}
