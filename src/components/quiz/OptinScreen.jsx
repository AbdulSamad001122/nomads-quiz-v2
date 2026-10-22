import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './OptinScreen.css';

/**
 * Email capture — shown right after Q2A / Q2B (Oct 21 copy doc), on the
 * QuizScreen split-screen shell, slotting into the blue → maroon → green
 * rotation.
 *
 * Left: arrows doodle, "You're a few questions away…" (sweep highlight) and
 * the result + workshop promise. Right: "Where should we send / your result?"
 * (script kept to the two-word accent), first name + email inputs, Continue.
 *
 * `defaultValues` refills the inputs when the taker comes Back to this screen.
 */
export default function OptinScreen({ theme, onBack, onSubmit, defaultValues = null }) {
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
              <p className="optin__headline">
                {'You’re '}
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  a few questions away
                </HighlightSweep>
                {' from your Revenue Per Visitor™, aka how much money you’re making per visitor.'}
              </p>
              <p className="optin__sub">
                Add your email, and we&rsquo;ll send your result along with an
                on-demand workshop that lets you and your team map out your next
                steps to add $1.5M/year based on your new Revenue Per
                Visitor&trade;.
              </p>
            </div>
          </div>
          <div className="question-panel__footer optin__footer">
            <div className="question-panel__footer-hint optin__footer-hint" />
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
            {'Where should we send'}
            <br />
            <span className="optin__script">your result?</span>
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
              type="text"
              name="firstName"
              placeholder="Your First Name"
              autoComplete="given-name"
              defaultValue={defaultValues?.firstName || ''}
              required
            />
            <input
              className="optin__input"
              type="email"
              name="email"
              placeholder="Your Email"
              autoComplete="email"
              defaultValue={defaultValues?.email || ''}
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
