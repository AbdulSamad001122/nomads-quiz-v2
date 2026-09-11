import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './Advice12A.css';

/**
 * Advice slide 12D ("price wars / differentiation" answer on Q12) —
 * same fixed blue-family layout as 12A–12C (shared a12__ classes).
 * Placeholders for now per instruction: the 12A infographic and icons,
 * to be swapped when the 12D assets arrive.
 */
export default function Advice12D({ onBack, onContinue }) {
  return (
    <div className="a12 a12--d">
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
          <h1 className="a12__headline">
            {'Nobody defaults to the cheapest option when one choice is '}
            <HighlightSweep tone="iceblue">dominantly clear.</HighlightSweep>
          </h1>
          <p className="a12__subline">
            But when there is no clear differentiation, price becomes the
            only thing left to compare.
          </p>
          <div className="a12__info-card a12__info-card--top">
            <img
              className="a12__info-img"
              src="/assets/advice-12d-infographic.webp"
              alt="Brands that challenged their category: Patagonia, Slack, HubSpot, Apple, Oatly"
            />
          </div>
        </div>
      </section>

      {/* ---------- ice-blue body ---------- */}
      <section className="a12__body">
        <div className="a12__info-card a12__info-card--body">
          <img
            className="a12__info-img"
            src="/assets/advice-12d-infographic.webp"
            alt="Brands that challenged their category: Patagonia, Slack, HubSpot, Apple, Oatly"
          />
        </div>


        <p className="a12__punch a12__punch--spaced">
          {"That's a positioning problem."}
        </p>

        <h2 className="a12__mid-head">
          {'To own a category, you need a '}
          <HighlightSweep tone="navy">Contrarian POV™</HighlightSweep>
          {". Here's why:"}
        </h2>

        <div className="a12__cards">
          <div className="a12__card a12__card--lavender">
            <span className="a12__icon">
              <img src="/assets/icon-12d-signpost.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">{'The "why switch"'}</h3>
            <p className="a12__card-text">
              {'Your offer is asking people to switch or start something new and nobody does that without a reason. You need a "why switch" that challenges them to reconsider their current approach.'}
            </p>
          </div>

          <div className="a12__card a12__card--plum">
            <span className="a12__icon">
              <img src="/assets/icon-12d-puzzle.svg" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">The contradiction</h3>
            <p className="a12__card-text">
              A Contrarian POV creates that contradiction it makes them
              question their old way and start seeing your way as the obvious
              solution.
            </p>
          </div>

          <div className="a12__card a12__card--navy">
            <span className="a12__icon">
              <img src="/assets/icon-12d-microphone.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">{"Your customer's words"}</h3>
            <p className="a12__card-text">
              {"Your customer's words tell you which category to own. Here are 9 reasons people buy and 7 reasons they don't. Your Contrarian POV is built on research that identifies which specific trigger is most dominant for your buyer and which hesitation is keeping them stuck. One big idea speaks to all of it simultaneously."}
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
              {'When your Contrarian POV is doing its job, the question stops being "why should I pick you over them" and starts being "why would I pick anyone else."'}
            </h2>
            <h2 className="a12__cta-head">
              {'Bring your '}
              <HighlightSweep tone="navy">
                differentiation forward
              </HighlightSweep>
              {" so buying decisions aren't left at the mercy of your competitor's pricing charts!"}
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
