import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import ProgressBar from './parts/ProgressBar.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './BenchmarkScreen.css';

/**
 * Benchmark slide (before Q5) — split-screen layout per the
 * "Blue theme - FOR SLG" design reference. Theme-driven like QuizScreen,
 * so it slots into the blue → maroon → green rotation.
 *
 * Left: headline, subhead, arrow-doodle bullet points, CONTINUE.
 * Right: intro copy, model label + AOV, funnel benchmark table, outro,
 * progress bar.
 */
export default function BenchmarkScreen({
  theme,
  isSlg,
  onBack,
  onContinue,
  progressPercent,
}) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-label-bg': theme.labelBg,
    '--t-label-text': theme.labelText,
    '--t-step-badge-bg': theme.stepBadgeBg,
    '--t-step-badge-text': theme.stepBadgeText,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--t-option-bg': theme.optionBg,
    '--t-option-text': theme.optionText,
    '--t-option-number-bg': theme.optionNumberBg,
    '--t-option-number-text': theme.optionNumberText,
    '--t-option-selected-bg': theme.optionSelectedBg,
    '--t-option-selected-text': theme.optionSelectedText,
    '--t-progress-track': theme.progressTrack,
    '--t-progress-fill': theme.progressFill,
    '--t-progress-label': theme.progressLabel,
  };

  const points = [
    'Convert a minimum of ~35% of your 5,000 visitors into subscribers',
    "That's equivalent to 1,750 subscribers entering your brand ecosystem",
    isSlg
      ? 'Ideally, roughly 3% of them should convert into 50-60 sales conversations'
      : 'Ideally, roughly 3% of them should convert into 50-60 sales',
  ];

  // Verbatim from the table images embedded in Quiz Questions.docx
  // (word/media/image5.png = SLG, image4.png = PLG — copies live in
  // "Design Refrence/benchmark-table-*.png").
  const table = isSlg
    ? {
        model: 'Sales-Led Growth (SLG)',
        sub: 'Average Deal Size: $5,000',
        rows: [
          ['Visitors', '1,000', '1,000'],
          ['Email/SMS Subscribers', '200 (20%)', '400 (40%)'],
          ['Book Sales Calls', '2–4 (1–2% of subscribers)', '20 (5%)'],
          ['Sales Call → Client', '20–25%', '60%'],
          ['Revenue', '$10,000–$20,000', '$60,000'],
        ],
      }
    : {
        model: 'PLG (Product-Led Growth)',
        sub: 'Average Order Value: $100',
        rows: [
          ['Visitors', '1,000', '1,000'],
          ['Email/SMS Subscribers', '200 (20%)', '400 (40%)'],
          ['Paying Customers', '10 (5% of subscribers)', '40 (10% of subscribers)'],
          ['Revenue', '$1,000', '$4,000'],
        ],
      };

  return (
    <div
      className={`quiz-screen benchmark-screen quiz-screen--${theme.name}`}
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
            <div className="question-panel__content benchmark__content">
              <h1 className="benchmark__headline">
                {'If 5,000 more qualified'}
                <br />
                {' visitors landed on your'}
                <br />
                {' business tomorrow, what'}
                <br />{' '}
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  would actually happen?
                </HighlightSweep>
              </h1>
              <p className="benchmark__subhead">
                {'If your funnel is working the way'}
                <br />
                {' it should, you’d expect to'}
              </p>
              <ul className="benchmark__points">
                {points.map((text) => (
                  <li key={text}>
                    <img src="/assets/arrow-white.png" alt="" aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="q-btn q-btn--onDark benchmark__continue"
                onClick={onContinue}
              >
                Continue
              </button>
            </div>
          </div>
          <div className="question-panel__footer">
            <div className="question-panel__footer-hint" />
            <div className="question-panel__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="answer-panel benchmark__panel">
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

        <div className="benchmark__panel-body">
          <p className="benchmark__intro">
            These numbers come from high-performing funnels with the highest
            Revenue Per Visitor™. We'll compare them with yours to find your
            biggest opportunity.
          </p>
          <p className="benchmark__model">{table.model}</p>
          <p className="benchmark__aov">{table.sub}</p>

          <table className="benchmark-table">
            <thead>
              <tr>
                <th>Funnel Stage</th>
                <th>Typical Industry</th>
                <th>RPV™ Optimized</th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((cells) => (
                <tr key={cells[0]}>
                  {cells.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="benchmark__outro">
            In the next few questions, you will get visibility into your sales
            and marketing system. You'll also find out what needs optimization
            to stack $125k MRR ($1.5M/year) on top of your existing monthly
            revenue.
          </p>
        </div>

        <ProgressBar percent={progressPercent} />
        <div className="answer-panel__mobile-footer" aria-hidden="true">
          <div className="answer-panel__mobile-hint" />
          <div className="answer-panel__mobile-cell">
            <img src="/assets/nomads-icon-dark.png" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}
