import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import { ACCENT, CARD, CTA_TONE } from './CaseStudyGolfbays.jsx';
import './QuizScreen.css';
import './CaseStudyGolfbays.css';
import './CaseStudyEstelle.css';

/**
 * Case study 5E — Estelle Winsett ("call-convincing" route off Q5).
 * No mock existed; the layout extends the 5A–5D system:
 *   1. split hero — the "isn't a flex" quote headline | Case Study art
 *   2. Before / After columns (5A card language; the LinkedIn
 *      testimonial screenshot sits at its doc position between the
 *      After bullets)
 *   3. The Results — dark paper band with keyline frame (5D pattern):
 *      two stat cards + the funnel proof screenshot + sweep closer
 *   4. Your Turn CTA (shared)
 */
export default function CaseStudyEstelle({ theme, onBack, onContinue }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--cs-accent': ACCENT[theme.name] || ACCENT.maroon,
    '--cs-card': CARD[theme.name] || CARD.maroon,
    '--cs-ink': theme.name === 'maroon' ? '#391129' : '#152638',
    '--cs-paper':
      theme.name === 'maroon'
        ? 'url(/assets/maroon-paper-bg.webp)'
        : `url(${theme.leftBgImage})`,
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
    <div className={`cs5a cs5e quiz-screen--${theme.name}`} style={themeVars}>
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

              <h1 className="cs5a__headline cs5e__headline">
                {'"IF WE GET THEM ON A CALL, WE\'LL CLOSE THEM" '}
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  {"ISN'T A FLEX."}
                </HighlightSweep>
              </h1>

              <p className="cs5a__subhead">
                {"It's booking you fewer calls and hurting your close rate."}
              </p>

              <p className="cs5e__hero-para">
                {'Estelle Winsett is a '}
                <strong>former attorney</strong>
                {' who styles high-performing lawyers '}
                <strong>from court to cocktails</strong>
                {'.'}
              </p>

              <hr className="cs5a__rule" />

              <p className="cs5e__hero-para">
                {'She had built an engaged audience of '}
                <strong>9000+ women</strong>
                {' hungry for better presence and positioning through their style.'}
              </p>
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
            src="/assets/cs-5a-golfbays.webp"
            alt="Website preview on a phone under the Case Study script"
          />
          <img
            className="cs5a__thisway"
            src="/assets/this-way-arrow.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ============ 2. BEFORE / AFTER columns ============ */}
      <section className="cs5e__ba">
        <div className="cs5e__ba-grid">
          <div className="cs5e__col">
            <h2 className="cs5a__ba-head">
              {'Before'}
              <span>Compounding RPV OS:</span>
            </h2>

            <div className="cs5a__bcard">
              <span className="cs5a__chip">Manual DM Nurturing</span>
              <div className="cs5a__bcard-body">
                {bulletImg}
                <p className="cs5a__btext">
                  {'She spent '}
                  <strong>hours in LinkedIn DMs</strong>
                  {' nurturing lawyers to book a call with her even if she was writing content daily.'}
                </p>
              </div>
            </div>

            <div className="cs5a__bcard">
              <span className="cs5a__chip">DM-Dependent Growth</span>
              <div className="cs5a__bcard-body">
                {bulletImg}
                <p className="cs5a__btext">
                  {'The manual back-and-forth conversations made growth '}
                  <strong>slow, and nonexistent</strong>
                  {" on days when she wasn't active in the DMs."}
                </p>
              </div>
            </div>

            <div className="cs5a__bcard">
              <span className="cs5a__chip">Price Revealed Late</span>
              <div className="cs5a__bcard-body">
                {bulletImg}
                <p className="cs5a__btext">
                  {'Her buyers only saw the '}
                  <strong>$5000 price</strong>
                  {", Estelle's deep process, and her clients' transformations on the call."}
                </p>
              </div>
            </div>
          </div>

          <div className="cs5e__col">
            <h2 className="cs5a__ba-head">
              {'After'}
              <span>Compounding RPV OS:</span>
            </h2>

            <div className="cs5a__acard">
              <img
                className="cs5a__check"
                src="/assets/tick-doodle.png"
                alt=""
                aria-hidden="true"
              />
              <span className="cs5a__chip cs5a__chip--light">
                Always-On Quiz
              </span>
              <p className="cs5a__atext">
                {"The Conversion Quiz sits on her profile, under each post, and in a QR when she's delivering talks, so it brings in "}
                <strong>consistent quiz takers without her being in the DMs</strong>
              </p>
            </div>

            <div className="cs5a__acard">
              <img
                className="cs5a__check"
                src="/assets/tick-doodle.png"
                alt=""
                aria-hidden="true"
              />
              <span className="cs5a__chip cs5a__chip--light">
                Contrarian POV™
              </span>
              <p className="cs5a__atext">
                <strong>{'"It\'s not your body, it\'s your clothes"'}</strong>
                {" contrarian POV™ that etched Estelle's take in her audience's mind."}
              </p>
              <div className="cs5e__testi">
                <div className="cs5e__testi-head">
                  <img
                    className="cs5e__testi-avatar"
                    src="/assets/testi-molly.webp"
                    alt=""
                    aria-hidden="true"
                  />
                  <div>
                    <p className="cs5e__testi-name">Molly Kremer</p>
                    <p className="cs5e__testi-role">The Billing Coach</p>
                  </div>
                </div>
                <p className="cs5e__testi-quote">
                  {'I so love how you help give us all \u{1F4AF} permission to dress for who we are and where we are right now Estelle Winsett, JD \u{1F64F} my now version of my body thanks you \u{1F642}'}
                </p>
              </div>
            </div>

            <div className="cs5a__acard">
              <img
                className="cs5a__check"
                src="/assets/tick-doodle.png"
                alt=""
                aria-hidden="true"
              />
              <span className="cs5a__chip cs5a__chip--light">
                Easy Call Transitions
              </span>
              <p className="cs5a__atext">
                {'In the DMs, instead of back and forth, she points them to the Quiz, and that '}
                <strong>easily transitions the conversation to a sales call</strong>
              </p>
            </div>

            <div className="cs5a__acard">
              <img
                className="cs5a__check"
                src="/assets/tick-doodle.png"
                alt=""
                aria-hidden="true"
              />
              <span className="cs5a__chip cs5a__chip--light">
                Pre-Sold Buyers
              </span>
              <p className="cs5a__atext">
                {'They see the $5000 offer, her detailed process, and her Contrarian take from other stylists '}
                <strong>before</strong>
                {' they hop on a call with her'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. THE RESULTS — dark paper band ============ */}
      <section className="cs5e__results">
        <div className="cs5e__results-frame">
          <h2 className="cs5e__results-head">The Results:</h2>

          <div className="cs5e__stat-row">
            <div className="cs5e__stat-card">
              <span className="cs5e__stat-num">5</span>
              <span className="cs5e__stat-label">
                Five out of every 100 quiz takers book a call with her in the
                first 10 days of taking the quiz
              </span>
            </div>

            <div className="cs5e__stat-card">
              <span className="cs5e__stat-num">75%</span>
              <span className="cs5e__stat-label">
                {'She went from '}
                <strong>3 sales calls per month</strong>
                {' to '}
                <strong>3 per week</strong>
                {', while closing '}
                <strong>75% of them</strong>
                {", since the convincing doesn't happen on a call."}
              </span>
            </div>
          </div>

          <img
            className="cs5e__proof"
            src="/assets/doc/cs-estelle-results.webp"
            alt="Funnel stats — quiz takers convert 62.8% vs 27.2% for non-quiz takers; 5.2% leads-to-sales"
          />

          <p className="cs5e__results-closer">
            {"Because the moment someone books a call still unconvinced, you've already added "}
            <HighlightSweep tone={sweepToneFor(theme.name)}>
              45 minutes of convincing
            </HighlightSweep>
            {' to your calendar, and '}
            <strong>weeks of follow-ups</strong>
            {' to your sales cycle.'}
          </p>
        </div>
      </section>

      {/* ============ 4. YOUR TURN CTA (shared structure) ============ */}
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
              {'Want to see what it would take you'}
              <br />
              {' to add an '}
              <HighlightSweep tone={CTA_TONE[theme.name] || 'plum'}>
                extra $125,000+
              </HighlightSweep>
              {' to your MRR'}
              <br />
              {' with the traffic you already have?'}
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
