import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import './QuizScreen.css';
import './FeedbackLoopScreen.css';

/**
 * Q14 — the "feedback loop" free-text question, fancy design per the
 * reference: split screen (theme-driven, slots into the rotation like every
 * question). Left: Alefiya photo anchored bottom-left, spilling past the
 * keyline frame so the frame overlaps her (the handwritten "Take a moment…"
 * script is baked into the photo). Right: brush "Haaaa!", label strip, the
 * question, a textarea and Continue.
 */
export default function FeedbackLoopScreen({
  theme,
  value,
  onChange,
  onBack,
  onContinue,
  continueDisabled,
}) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--t-option-bg': theme.optionBg,
    '--t-option-text': theme.optionText,
    '--t-option-number-bg': theme.optionNumberBg,
    '--t-option-selected-bg': theme.optionSelectedBg,
    '--t-option-selected-text': theme.optionSelectedText,
  };

  return (
    <div
      className={`quiz-screen fl-screen quiz-screen--${theme.name}`}
      style={themeVars}
    >
      <section className="question-panel fl__left">
        <SeamBadge src="/assets/circle-doodle-2.png" />
        <div className="question-panel__top">
          <div className="question-panel__logo-box">
            <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
          </div>
          <span className="question-panel__top-line" aria-hidden="true" />
        </div>
        <div className="question-panel__frame fl__frame">
          <div className="question-panel__mobile-back">
            <BackLink onBack={onBack} />
          </div>
          <img
            className="fl__photo"
            src="/assets/alefiya-loop.webp"
            alt=""
            aria-hidden="true"
          />
          <div className="fl__footer" aria-hidden="true">
            <div className="fl__footer-hint" />
            <div className="fl__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="answer-panel fl__right">
        {/* mobile-only: white logo bar + back (the dark photo panel moves
            below the content on small screens) */}
        <div className="fl__mobile-bar">
          <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
        </div>
        <div className="fl__mobile-back">
          <BackLink onBack={onBack} />
        </div>

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

        <div className="fl__content">
          <div className="fl__haaaa">Haaaa!</div>
          <span className="fl__label">The ride is over. One last Q</span>
          <h1 className="fl__question">
            What was going on in your life and business that led you to take
            this diagnostic today?
          </h1>
          <textarea
            className="fl__textarea"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Type your answer...."
            rows={5}
          />
          <button
            type="button"
            className="q-btn fl__continue"
            onClick={onContinue}
            disabled={continueDisabled}
          >
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}
