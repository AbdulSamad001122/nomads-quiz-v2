import SeamBadge from './parts/SeamBadge.jsx';
import './QuizScreen.css';
import './DisqualifiedScreen.css';

/**
 * Disqualification screen — fancy design per the DQ reference: ALWAYS the
 * blue theme (it's a dead-end slide, so it sits outside the colour
 * rotation). Split background — dark blue texture on top, light blue
 * texture below — with the two exit cards straddling the seam.
 *
 * "Watch the workshop" has no destination yet (workshop link pending);
 * "Explore the website" opens the main Nomads site.
 */
export default function DisqualifiedScreen({ onBack, onWorkshop, onWebsite }) {
  return (
    <div className="dq-screen">
      <SeamBadge src="/assets/circle-doodle-2.png" />

      <div className="dq__top">
        <div className="dq__top-left">
          <div className="question-panel__logo-box">
            <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
          </div>
          <span className="dq__line" aria-hidden="true" />
        </div>
        <div className="dq__top-right">
          <span className="dq__line dq__line--long" aria-hidden="true" />
        </div>
      </div>

      <div className="dq__frame">
        <div className="dq__body">
          <button type="button" className="dq__back" onClick={onBack}>
            <span aria-hidden="true">&#8249;</span> Back
          </button>

          <h1 className="dq__headline">
            {"You'll need more "}
            <span className="dq__v" aria-hidden="true">
              V
            </span>
            <span className="dq__v-rest">isitors</span>
            {' to reach $1.5M'}
          </h1>
          <p className="dq__sub">
            {'But before you scale, build a system that'}
            <br />
            {' makes every visitor worth more.'}
          </p>

          <div className="dq__cards">
            <div className="dq__card">
              <p className="dq__card-text">
                {'See how to make an extra $4,000'}
                <br />
                {' a day from the same system.'}
              </p>
              <img
                className="dq__laptop"
                src="/assets/dq-laptop.webp"
                alt="Preview of the workshop on a laptop"
                loading="lazy"
              />
              <button type="button" className="q-btn dq__cta" onClick={onWorkshop}>
                Watch the workshop
              </button>
            </div>

            <div className="dq__card">
              <p className="dq__card-text">
                {'See how the Compounding'}
                <br />
                {' Revenue Per Visitor™ OS works.'}
              </p>
              <img
                className="dq__laptop"
                src="/assets/dq-laptop.webp"
                alt="Preview of the Nomads website on a laptop"
                loading="lazy"
              />
              <button type="button" className="q-btn dq__cta" onClick={onWebsite}>
                Explore the website
              </button>
            </div>
          </div>
        </div>

        <div className="dq__footer">
          <div className="dq__footer-hint" />
          <div className="dq__footer-cell">
            <img src="/assets/nomads-icon-dark.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
