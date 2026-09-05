import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './OptinScreen.css';

/**
 * Opt-in slide — fancy design per the reference: split screen on the
 * QuizScreen shell, slotting into the blue → maroon → green rotation.
 *
 * Left: arrows doodle, "Your RPV is calculated" (sweep highlight), the
 * two numbered promises, script footer line.
 * Right: "Where should / we send them?" (brush script), email + first
 * name inputs, Continue.
 */
export default function OptinScreen({ theme, onBack, onSubmit }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-step-badge-bg': theme.stepBadgeBg,
    '--t-step-badge-text': theme.stepBadgeText,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--t-option-text': theme.optionText,
  };

  return (
    <div
      className={`quiz-screen optin-screen quiz-screen--${theme.name}`}
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
            <div className="question-panel__content optin__content">
              <img
                className="optin__arrows"
                src="/assets/double-arrows.png"
                alt=""
                aria-hidden="true"
              />
              <h1 className="optin__headline">
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  Your RPV is calculated
                </HighlightSweep>
              </h1>
              <p className="optin__sub">
                Two things are waiting on the other side of this:
              </p>
              <ol className="optin__points">
                <li>
                  <span className="optin__num" aria-hidden="true">
                    01
                  </span>
                  <span className="optin__point-text">
                    Your current and potential revenue per visitor, aka how
                    much money you&rsquo;re making per visitor.
                  </span>
                </li>
                <li>
                  <span className="optin__num" aria-hidden="true">
                    02
                  </span>
                  <span className="optin__point-text">
                    And an on-demand workshop that lets you and your team map
                    out your next steps to add $1.5M/year based on your new
                    RPV&trade;&nbsp;.
                  </span>
                </li>
              </ol>
            </div>
          </div>
          <div className="question-panel__footer optin__footer">
            <div className="question-panel__footer-hint optin__footer-hint">
              <span className="question-panel__hint-text">
                Now let&rsquo;s turn that number into your next move.
              </span>
            </div>
            <div className="question-panel__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="answer-panel optin__right">
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

        <div className="optin__form-wrap">
          <h1 className="optin__title">
            {'Where should'}
            <br />
            <span className="optin__script">we send them?</span>
          </h1>
          <form
            className="optin__form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              onSubmit?.({
                firstName: (data.get('firstName') || '').trim(),
                email: (data.get('email') || '').trim(),
              });
            }}
          >
            <input
              className="optin__input"
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />
            <input
              className="optin__input"
              type="text"
              name="firstName"
              placeholder="Your First Name"
              required
            />
            <button type="submit" className="q-btn optin__cta">
              Continue
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
