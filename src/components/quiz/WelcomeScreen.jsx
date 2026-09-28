import HighlightSweep from '../primitives/HighlightSweep.jsx';
import './WelcomeScreen.css';

/**
 * First slide of the quiz — built to the "first quiz page" design
 * reference: cream logo bar, dark textured map background, big headline
 * with the plum sweep on "expensive" and a Better Brush "g", subline,
 * landing-style CTA, "takes 5 minutes" chip, and Alefiya's photo
 * anchored bottom-right.
 */
export default function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <header className="welcome__bar">
        <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
      </header>

      <div className="welcome__stage">
        <div className="welcome__content">
          {/* copy per the hero inspo (Sep 28); lowercase brush "g" keeps
              "guessing" in the reference's casing */}
          <h1
            className="welcome__headline"
            aria-label="This is where that expensive guessing stops."
          >
            {'This is where that '}
            <HighlightSweep tone="plum">expensive</HighlightSweep>{' '}
            <span className="welcome__g" aria-hidden="true">
              g
            </span>
            <span className="welcome__g-rest">uessing stops.</span>
          </h1>

          <p className="welcome__sub">
            {'And the numbers start telling you what to optimize next to add an extra '}
            <strong>$1.5M</strong>
            {' to your ARR.'}
          </p>

          <button type="button" className="q-btn q-btn--onDark welcome__cta" onClick={onStart}>
            Start the Diagnostic
          </button>

          <div className="welcome__time">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span>
              Takes about <strong>5 minutes</strong>
            </span>
          </div>
        </div>

        <img
          className="welcome__arrow"
          src="/assets/white-curved-dashed-arrow.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="welcome__photo"
          src="/assets/first-page-alefiya.webp"
          alt=""
        />
      </div>
    </div>
  );
}
