import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import { ACCENT, CARD, CTA_TONE } from './CaseStudyGolfbays.jsx';
import './QuizScreen.css';
import './CaseStudyGolfbays.css';
import './CaseStudyCreative.css';

/**
 * Case study 5C — Creative Delivery ("differentiation" route off Q5).
 * No mock existed for this one; the layout extends the 5A/5B system:
 *   1. split hero (trust-recession lead + Contrarian POV™ setup | Case
 *      Study phone art, keyline frame, Moontime script band)
 *   2. accent hook band — the Video Mastermind 27 → 29-of-31 line
 *   3. Before / The Contrarian POV™ / Results grid (5A's ba-grid with a
 *      Results column: tall stat card, verbatim copy)
 *   4. closing accent band — "your ownable category" (sweep highlight)
 *   5. Your Turn CTA (same as 5A/5B)
 */
export default function CaseStudyCreative({ theme, onBack, onContinue }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--cs-accent': ACCENT[theme.name] || ACCENT.maroon,
    '--cs-card': CARD[theme.name] || CARD.maroon,
    '--cs-ink': theme.name === 'maroon' ? '#391129' : '#152638',
  };

  const bulletImg = (
    <img
      className="cs5a__bullet-arrow"
      src="/assets/arrow-white.png"
      alt=""
      aria-hidden="true"
    />
  );

  return (
    <div className={`cs5a cs5c quiz-screen--${theme.name}`} style={themeVars}>
      {/* ============ 1. HERO — split ============ */}
      <section className="cs5a__hero">
        <div className="cs5a__left">
          <SeamBadge src="/assets/circle-doodle-2.png" />
          <div className="question-panel__top">
            <div className="question-panel__logo-box">
              <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
            </div>
            <span className="question-panel__top-line" aria-hidden="true" />
          </div>

          <div className="cs5a__frame">
            <div className="cs5a__left-body">
              <div className="cs5a__mobile-back">
                <BackLink onBack={onBack} />
              </div>

              <p className="cs5a__lead">
                {"We keep hearing we're in a "}
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  trust recession
                </HighlightSweep>
                {'. That buyers are more sceptical than ever.'}
              </p>

              <p className="cs5c__hero-para">
                {"But if that were true, the most trusted creators and celebrities wouldn't launch products that flop. "}
                <strong>They do. All the time.</strong>
              </p>

              <hr className="cs5a__rule" />

              <p className="cs5c__hero-para">
                {"Turns out there's something that matters more than trust: whether they can tell you apart from the other five tabs they have open. "}
                <strong>A Contrarian POV™</strong>
                {' as we call it.'}
              </p>
              <div className="cs5a__hero-cta">
                <button
                  type="button"
                  className="q-btn q-btn--onDark cs5a__continue"
                  onClick={onContinue}
                >
                  Follow along
                </button>
              </div>
            </div>

            <div className="cs5a__script-band">your traffic is worth more.</div>
          </div>
        </div>

        <div className="cs5a__right">
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
          <img
            className="cs5a__hero-img"
            src="/assets/cs-5c-louis.webp"
            alt="Louis, the Video Mastermind founder"
          />
        </div>
      </section>

      {/* ============ 2. HOOK BAND ============ */}
      <section className="cs5c__hook">
        <p className="cs5c__hook-lead">
          A Video Mastermind founder went from
        </p>
        <div className="cs5c__hook-row">
          <div className="cs5c__hook-stat">
            <span className="cs5c__hook-label">losing</span>
            <span className="cs5c__hook-num">27</span>
            <span className="cs5c__hook-label">sales calls</span>
          </div>
          <span className="cs5c__hook-arrow" aria-hidden="true">
            <img src="/assets/arrow-white.png" alt="" />
          </span>
          <div className="cs5c__hook-stat">
            <span className="cs5c__hook-label">to closing</span>
            <span className="cs5c__hook-num">29</span>
            <span className="cs5c__hook-label">of the next 31</span>
          </div>
        </div>
        <p className="cs5c__hook-close">
          {'with a '}
          <strong>Contrarian POV™</strong>
          {'.'}
        </p>
      </section>

      {/* ============ 3. BEFORE / POV / RESULTS grid ============ */}
      <section className="cs5a__ba">
        <div className="cs5a__ba-grid">
          <h2 className="cs5a__ba-head cs5a__ba-head--before">
            {'Before'}
            <span>Contrarian POV™</span>
          </h2>
          <h2 className="cs5a__ba-head cs5a__ba-head--after">
            {'The Contrarian'}
            <span>POV™</span>
          </h2>
          <h2 className="cs5a__ba-head cs5c__results-head">
            {'Results:'}
            <span>Market of One</span>
          </h2>

          <div className="cs5a__bcard cs5a__bcard--1">
            <span className="cs5a__chip">Same Category Claim</span>
            <div className="cs5a__bcard-body">
              {bulletImg}
              <p className="cs5a__btext">
                {'They promised '}
                <strong>{'"Videos that get more sales,"'}</strong>
                {' which boxed them into the same category as their competitors'}
              </p>
            </div>
          </div>

          <div className="cs5a__acard cs5a__acard--1">
            <img
              className="cs5a__check"
              src="/assets/tick-doodle.png"
              alt=""
              aria-hidden="true"
            />
            <span className="cs5a__chip cs5a__chip--light">
              Creative Delivery POV
            </span>
            <p className="cs5a__atext">
              {'We analysed a bunch of sales calls, and one word kept coming up: '}
              <strong>creativity</strong>
              {', so the contrarian POV became: Your videos don\'t need high-level production; they need '}
              <strong>{'"Creative Delivery."'}</strong>
            </p>
          </div>

          <div className="cs5c__results-card">
            <p className="cs5c__results-lead">Went from</p>
            <div className="cs5c__results-stat">
              {'$8,000 to $108,000/mo'}
            </div>
            <p className="cs5c__results-body">
              {'by increasing the close rate from '}
              <strong>3.7% to 93.5%</strong>
              {' with a Contrarian POV that created a '}
              <strong>{'"Market of One"'}</strong>
              {' for him.'}
            </p>
          </div>

          <div className="cs5a__bcard cs5a__bcard--2">
            <span className="cs5a__chip">Trust Without Sales</span>
            <div className="cs5a__bcard-body">
              {bulletImg}
              <p className="cs5a__btext">
                {'Trust was there; the founder got '}
                <strong>200-300 organic comments</strong>
                {" on his LinkedIn post, yet people thought they wouldn't buy into the same claim and drop $6000 on the mastermind"}
              </p>
            </div>
          </div>

          <div className="cs5a__acard cs5a__acard--2">
            <img
              className="cs5a__check"
              src="/assets/tick-doodle.png"
              alt=""
              aria-hidden="true"
            />
            <span className="cs5a__chip cs5a__chip--light">
              Offer Supports POV
            </span>
            <p className="cs5a__atext">
              {'All the features of the offer now support the Contrarian POV '}
              <strong>{'"Creative Delivery."'}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ============ 4. CLOSING BAND ============ */}
      <section className="cs5c__closing">
        <span className="cs5c__closing-label">Contrarian POV</span>
        <h2 className="cs5c__closing-head">
          {'Is your stand against the majority of look-alike competitors, so you can become '}
          <HighlightSweep tone={sweepToneFor(theme.name)}>
            the default choice
          </HighlightSweep>
          {' by creating your ownable category.'}
        </h2>
        <p className="cs5c__closing-sub">
          {"You're no longer competing with "}
          <span className="cs5c__strike">cheaper alternatives</span>
          {' or '}
          <span className="cs5c__strike">established brands</span>
          {'.'}
        </p>
      </section>

      {/* ============ 5. YOUR TURN CTA (5A structure) ============ */}
      <section className="cs5a__cta">
        <img
          className="cs5a__turn"
          src="/assets/your-turn-doodle.png"
          alt=""
          aria-hidden="true"
        />

        <div className="cs5a__cta-frame">
          <div className="cs5a__cta-card">
            <h2 className="cs5a__cta-head">
              {'Want to see what it would take you to add an '}
              <HighlightSweep tone={CTA_TONE[theme.name] || 'plum'}>
                extra $125,000+
              </HighlightSweep>
              {' to your MRR with the traffic you already have?'}
            </h2>

            <img
              className="cs5a__cta-arrow"
              src="/assets/curve-white-arrow.png"
              alt=""
              aria-hidden="true"
            />

            <div className="cs5a__cta-row">
              <button
                type="button"
                className="q-btn cs5a__continue"
                onClick={onContinue}
              >
                Follow along
              </button>
            </div>
          </div>

          <div className="cs5a__footer" aria-hidden="true">
            <div className="cs5a__footer-hint" />
            <div className="cs5a__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
