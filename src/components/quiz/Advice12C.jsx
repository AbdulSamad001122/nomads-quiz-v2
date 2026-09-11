import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './Advice12A.css';

/**
 * Advice slide 12C ("inconsistent months" answer on Q12) — same fixed
 * blue-family layout as 12A/12B (shared a12__ classes) plus a story
 * card for the August/Scoreapp narrative. Placeholders for now: the
 * 12A infographic and icons, to be swapped when 12C assets arrive.
 */
export default function Advice12C({ onBack, onContinue }) {
  return (
    <div className="a12 a12--c">
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
            {'Good months happen. Then they stop. '}
            <HighlightSweep tone="iceblue">
              {"And you don't know why."}
            </HighlightSweep>
          </h1>
          <div className="a12__info-card a12__info-card--top">
            <img
              className="a12__info-img"
              src="/assets/advice-12c-infographic.webp"
              alt="Teams without a feedback loop working in silos: content, ads, sales, customer service, revenue"
            />
          </div>
        </div>
      </section>

      {/* ---------- ice-blue body ---------- */}
      <section className="a12__body">
        <div className="a12__info-card a12__info-card--body">
          <img
            className="a12__info-img"
            src="/assets/advice-12c-infographic.webp"
            alt="Teams without a feedback loop working in silos: content, ads, sales, customer service, revenue"
          />
        </div>


        {/* the August story */}
        <div className="a12__story">
          <p>
            {'Last year, August was my '}
            <strong>best sales month</strong>
            {' (whereas summer is usually a slow season).'}
          </p>
          <p>
            I thought it was luck. I am a Scoreapp partner, and I had multiple
            Scoreapp inquiries.
          </p>
          <p>
            {'Later, when we interviewed our customers, the pattern revealed: it was because '}
            <strong>Daniel Priestly went on the Diary of a CEO podcast</strong>
            {'. His visibility positively influenced our sales.'}
          </p>
          <p>
            The same growth occurred when one of his YouTube videos went
            viral.
          </p>
          <p>
            {"If only I had a feedback loop built-in, I could've immediately sponsored his newsletter or proposed a content partnership."}
          </p>
          <p>
            {"That's where I could've doubled down on a "}
            <strong>GOOD MONTH</strong>
            {'.'}
          </p>
          <p>
            {"But like me, many teams don't know why a good month was good, or a bad month was bad."}
          </p>
          <p>
            Was it a positioning problem, market change, or an industry leader
            influencing their sales?
          </p>
        </div>

        <p className="a12__para-block">
          {"That's why now I've built a "}
          <strong>14-step feedback loop</strong>
          {" that helps us get behavioral data from every visitor going through a business's sales ecosystem."}
        </p>
        <p className="a12__para-block">
          So one can immediately point out why something is working, or not
          working, and act on it.
        </p>
        <p className="a12__punch">
          {"Without that loop, you're not making data-led decisions. You're making "}
          <HighlightSweep tone="navy">expensive guesses</HighlightSweep>
          {'.'}
        </p>

        <h2 className="a12__mid-head">
          {"And this is what's usually happening "}
          <HighlightSweep tone="navy">behind the inconsistency</HighlightSweep>
          {':'}
        </h2>

        <div className="a12__cards">
          <div className="a12__card a12__card--lavender">
            <span className="a12__icon">
              <img src="/assets/icon-12c-megaphone.svg" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">The content team</h3>
            <p className="a12__card-text">
              Your Head of Content is celebrating and reporting a 30% increase
              in visibility
            </p>
          </div>

          <div className="a12__card a12__card--plum">
            <span className="a12__icon">
              <img src="/assets/icon-12c-magnet.svg" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">The ads team</h3>
            <p className="a12__card-text">
              {"The ads strategist is responsible for how many calls or clicks they're producing"}
            </p>
          </div>

          <div className="a12__card a12__card--navy">
            <span className="a12__icon">
              <img src="/assets/icon-12c-stopwatch.svg" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">Sales &amp; customer service</h3>
            <p className="a12__card-text">
              But does it take the sales team 15 minutes or 3 hours to close
              the deal? Or did the ads create rage-bait, and now customer
              service has an influx of refund requests?
            </p>
            <p className="a12__card-text">
              {"Is that a metric that determines the ads' success? Or is it just tracking ROAS?"}
            </p>
          </div>
        </div>

        <p className="a12__para-block a12__para-block--spaced">
          Inconsistency in revenue happens because marketing, customer
          success, and sales are not working in sync.
        </p>
        <p className="a12__para-block">
          When your teams are tracking in isolation, your good months feel
          like luck and your slow months feel like failure.
        </p>
        <p className="a12__punch">
          <HighlightSweep tone="navy">Neither is true.</HighlightSweep>
        </p>
        <p className="a12__punch">
          {"You just don't have the number that connects everything."}
        </p>

        <p className="a12__para-block a12__para-block--spaced">
          The feedback loop + sales team tells which calls have been the best
          which messages and positioning is selling. The ad team creates
          5–8 variations of that message, the outlier gets picked by the
          content team, so now the messages are converting on socials. Each
          action is in sync and data-led.
        </p>

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
              {"That's what we're about to find. Once you know your RPV your revenue per visitor you "}
              <HighlightSweep tone="navy">stop guessing</HighlightSweep>
              {' which month is a traffic problem, an email problem, or a positioning problem. You start seeing it.'}
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
