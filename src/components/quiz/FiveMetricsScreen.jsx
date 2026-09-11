import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep from '../primitives/HighlightSweep.jsx';
import useLeftAlignOnWrap from '../primitives/useLeftAlignOnWrap.js';
import './QuizScreen.css';
import './Advice12A.css';
import './FiveMetrics.css';

/**
 * Five-metrics slide ("Why this works") — shown after the loading
 * screen. Fixed blue-family design in the advice-slide language
 * (shared a12__ shell): dark problem statement up top, the RPV™ OS
 * diagram bridging into the ice-blue solution half, quote bar,
 * punch line and the 50-seconds handoff.
 */
export default function FiveMetricsScreen({ onBack, onContinue }) {
  const [headRef, headLeft] = useLeftAlignOnWrap(3);
  const [paraRef, paraLeft] = useLeftAlignOnWrap(3);
  const [punchRef, punchLeft] = useLeftAlignOnWrap(3);

  return (
    <div className="a12 fm">
      {/* ---------- dark top: the problem ---------- */}
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

          <span className="fm__eyebrow">Why this works</span>

          <h1
            ref={headRef}
            className={`a12__headline fm__headline${headLeft ? ' a12__headline--left' : ''}`}
          >
            {'Most businesses '}
            <HighlightSweep tone="iceblue">{"can't tell"}</HighlightSweep>
            {' if a slow month is a traffic problem, an email problem, or a positioning problem.'}
          </h1>

          <p className="fm__dark-para">
            <strong>{"Because they're tracking data in isolation."}</strong>
            {' You might be clocking '}
            <strong>40,000 TikTok views</strong>
            {' and celebrating, without knowing how many of those views became subscribers, or how many subscribers bought within the '}
            <strong>first 14 days</strong>
            {'.'}
          </p>

          <p className="fm__dark-para">
            {'And when revenue dips, you start doing more of something or less of something '}
            <strong>without knowing what has a direct impact on sales.</strong>
          </p>

          <div className="a12__info-card a12__info-card--top">
            <img
              className="a12__info-img"
              src="/assets/five-metrics-infographic.webp"
              alt="RPV™ OS five-metrics diagram — traffic, subscribers, revenue per subscriber, calls closing and early buyers feeding the RPV number"
            />
          </div>
        </div>
      </section>

      {/* ---------- ice-blue body: the system ---------- */}
      <section className="a12__body">
        <div className="a12__info-card a12__info-card--body">
          <img
            className="a12__info-img"
            src="/assets/five-metrics-infographic.webp"
            alt="RPV™ OS five-metrics diagram — traffic, subscribers, revenue per subscriber, calls closing and early buyers feeding the RPV number"
          />
        </div>

        <p
          ref={paraRef}
          className={`a12__para-block a12__para-block--spaced${paraLeft ? ' a12__headline--left' : ''}`}
        >
          {'The Revenue Per Visitor™ OS tracks '}
          <strong>five metrics</strong>
          {', paired with '}
          <strong>action-triggered surveys and behavior analysis</strong>
          {'. So instead of guessing, you have a clear, '}
          <strong>reverse-engineered goal</strong>
          {' sitting in front of you.'}
        </p>

        <p className="fm__quote">
          {'Like “Let’s increase email opt-ins by '}
          <strong>20%</strong>
          {' this month, and that alone adds '}
          <strong>$70,000 to MRR</strong>
          {'.”'}
        </p>

        <p
          ref={punchRef}
          className={`a12__punch${punchLeft ? ' a12__headline--left' : ''}`}
        >
          So instead of experimenting, every action you take is tied to a
          revenue outcome you can see coming.
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
              {'In 50 seconds, your results will reveal the average revenue you earn per visitor, and exactly which metrics to focus on to add '}
              <HighlightSweep tone="navy">$125k to your MRR</HighlightSweep>
              {'.'}
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
