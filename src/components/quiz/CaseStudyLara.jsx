import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import { ACCENT, CARD, CTA_TONE } from './CaseStudyGolfbays.jsx';
import './QuizScreen.css';
import './CaseStudyGolfbays.css';
import './CaseStudyLara.css';

/**
 * Case study 5D — Lara Acosta ("email-close" route off Q5).
 * No mock existed; the layout extends the 5A/5B/5C system:
 *   1. split hero — subscriber-myth headline | Lara Acosta art
 *   2. strategy band (accent) — belief-shifting email strategy +
 *      70 → 500 launch stat cards (5C's boxed style)
 *   3. SDR Coach section (white) — "most profitable channel" lead,
 *      the two-list experiment, 1 sale VS 23 sales cards
 *   4. Three things — numbered cards (01/02/03, 5B card language)
 *   5. Your Turn CTA (same as 5A/5B/5C)
 */
export default function CaseStudyLara({ theme, onBack, onContinue }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--cs-accent': ACCENT[theme.name] || ACCENT.maroon,
    '--cs-card': CARD[theme.name] || CARD.maroon,
    '--cs-ink': theme.name === 'maroon' ? '#391129' : '#152638',
    /* crinkled paper texture (landing-v3) on the maroon route; the
       theme's own dark texture on the gate route */
    '--cs-paper':
      theme.name === 'maroon'
        ? 'url(/assets/maroon-paper-bg.webp)'
        : `url(${theme.leftBgImage})`,
  };

  return (
    <div className={`cs5a cs5d quiz-screen--${theme.name}`} style={themeVars}>
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
                {'There was a time when more email subscribers meant '}
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  more money
                </HighlightSweep>
                {'. That time has passed.'}
              </p>

              <p className="cs5d__hero-para">
                {'Lara Acosta, '}
                <strong>Forbes 30 Under 30</strong>
                {' and the '}
                <strong>number one female LinkedIn creator</strong>
                {', was pulling in subscribers at the speed of light, considering her '}
                <strong>180,000+ followers</strong>
                {'.'}
              </p>

              <hr className="cs5a__rule" />

              <p className="cs5d__hero-para">
                {'However, her first launch drew only '}
                <strong>30 students</strong>
                {' and a '}
                <strong>6% click-through rate</strong>
                {'.'}
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
            src="/assets/cs-5d-lara.webp"
            alt="Lara Acosta, number one creator on LinkedIn"
          />
        </div>
      </section>

      {/* ============ 2. STRATEGY BAND ============ */}
      <section className="cs5d__strategy">
        <p className="cs5d__strategy-lead">
          {'We built a full '}
          <strong>pre-launch, launch, and post-launch belief-shifting email strategy</strong>
          {', layered with affiliate collaborations, a masterclass, and behavior-triggered sequences that compounded with every launch.'}
        </p>

        <div className="cs5d__stat-row">
          <div className="cs5d__stat-card">
            <span className="cs5d__stat-label">Next launch:</span>
            <span className="cs5d__stat-num">70</span>
            <span className="cs5d__stat-label">Students</span>
          </div>
          <span className="cs5d__stat-arrow" aria-hidden="true">
            <img src="/assets/arrow-white.png" alt="" />
          </span>
          <div className="cs5d__stat-card">
            <span className="cs5d__stat-label">The launch after that:</span>
            <span className="cs5d__stat-num">500</span>
            <span className="cs5d__stat-label">
              Students and half a million dollars in revenue
            </span>
          </div>
        </div>
      </section>

      {/* ============ 3. SDR COACH — the frame experiment ============ */}
      <section className="cs5d__sdr">
        <div className="cs5d__sdr-frame">
        <h2 className="cs5d__sdr-head">
          Email is the most profitable channel in her business today.
        </h2>
        <p className="cs5d__sdr-another">
          <HighlightSweep tone="white">{"Here's another one…"}</HighlightSweep>
        </p>

        <hr className="cs5d__sdr-rule" />

        <p className="cs5d__sdr-para">
          {'The '}
          <strong>#1 SDR Sales Coach</strong>
          {' had built a list of '}
          <strong>10,000 subscribers</strong>
          {' through a '}
          <strong>{'"Comment X, Get Y"'}</strong>
          {" strategy and his emails simply weren't converting despite every effort. We ran the exact same sequence, same messaging, same timing, to two lists simultaneously:"}
        </p>

        <div className="cs5d__vs-row">
          <div className="cs5d__vs-card">
            <span className="cs5d__vs-lead">His original 10,000 subscribers</span>
            <span className="cs5d__vs-num">1</span>
            <span className="cs5d__vs-label">Sale</span>
          </div>
          <span className="cs5d__vs-badge" aria-hidden="true">
            vs
          </span>
          <div className="cs5d__vs-card cs5d__vs-card--win">
            <span className="cs5d__vs-lead">
              829 Conversion Quiz™ subscribers
            </span>
            <span className="cs5d__vs-num">23</span>
            <span className="cs5d__vs-label">Sales</span>
          </div>
        </div>

        <p className="cs5d__sdr-closer">
          {'Same audience. Same emails. '}
          <HighlightSweep tone={sweepToneFor(theme.name)}>
            The only difference was the frame they joined with.
          </HighlightSweep>
          {' The people who joined to diagnose their gaps were way more likely to buy the solution than those who just wanted a quick freebie.'}
        </p>
        </div>
      </section>

      {/* ============ 4. THREE THINGS ============ */}
      <section className="cs5d__three">
        <h2 className="cs5d__three-head">
          Three things make email your most profitable channel in your
          business.
        </h2>

        <div className="cs5d__three-cards">
          <div className="cs5d__three-card">
            <span className="cs5d__three-num" aria-hidden="true">
              01
            </span>
            <h3 className="cs5d__three-title">
              Why each person joined your list
            </h3>
            <p className="cs5d__three-text">
              Someone who joined to diagnose a real problem, and how their
              beliefs are challenged, and objections are handled during the
              diagnosis, can convert them within the first 14 days.
            </p>
          </div>

          <div className="cs5d__three-card">
            <span className="cs5d__three-num" aria-hidden="true">
              02
            </span>
            <h3 className="cs5d__three-title">
              What happens in the first 14 days
            </h3>
            <p className="cs5d__three-text">
              A subscriber is most engaged within the first 10 days of joining
              your list. Your email strategy should look very different in
              this window.
            </p>
          </div>

          <div className="cs5d__three-card">
            <span className="cs5d__three-num" aria-hidden="true">
              03
            </span>
            <h3 className="cs5d__three-title">What happens after 14 days</h3>
            <p className="cs5d__three-text">
              {"Are you dumping all non-buyers in the same newsletter pool? Or you're planning a lifecycle email strategy with behavior-triggered segmentation that informs the strategy of your affiliate campaigns, seasonal sales, upsells, and cross-sells."}
            </p>
          </div>
        </div>
      </section>

      {/* ============ 5. YOUR TURN CTA (shared structure) ============ */}
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
