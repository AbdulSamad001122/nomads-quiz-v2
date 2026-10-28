import { METRICS } from '../copy.js';
import { metricRows } from '../resolveTokens.js';
import './MetricsSection.css';

/** The green ✓ disc on every "Your new goal" cell. */
function Tick() {
  return (
    <svg className="rmx__tick" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" />
      <path d="M5.6 10.4l2.9 2.9 5.9-6.1" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Section 2 — the five-metric table, rebuilt for the QC round (Oct 2026) to
 * the "RPV Results Hero" artifact. Today's cells keep the calculator's
 * red/yellow/green (metricColour) and add a status chip; EVERY "Your new
 * goal" cell is green with a tick, so "until they're green" reads literally
 * true (design note 2 — a design override: by the colour rules most goal
 * values would be yellow; Oct 23 default, flagged). Revenue Per Visitor
 * closes the table as the total, because the four metrics feed it.
 */
export default function MetricsSection({ result, tokens }) {
  const rows = metricRows(result);
  const total = rows.find((r) => r.key === 'rpv');
  const metrics = rows.filter((r) => r.key !== 'rpv');
  const labelFor = (key) => {
    const l = METRICS.rowLabels[key];
    return typeof l === 'string' ? l : l[result.path];
  };
  const h = METRICS.headers;

  return (
    <section className="rmx">
      <div className="rmx__inner">
        <h2 className="rmx__headline">
          {METRICS.headlineBefore}{' '}
          <span className="rmx__rpv rmx__rpv--current">{tokens.current_rpv}</span>{' '}
          <span className="rmx__rpv-arrow">→</span>{' '}
          <span className="rmx__rpv rmx__rpv--goal">{tokens.goal_rpv}</span>
          {METRICS.headlineAfter}
        </h2>
        <p className="rmx__subline">
          {METRICS.sublineBefore} <span className="rmx__green-chip">{METRICS.sublineChip}</span>
          {METRICS.sublineAfter}
        </p>

        <div className="rmx__table">
          <div className="rmx__heads">
            <div className="rmx__head rmx__head--metric">{h.metric}</div>
            <div className="rmx__head">
              {h.current}
              <span className="rmx__head-sub">{h.currentSub}</span>
            </div>
            <div className="rmx__gap" aria-hidden="true" />
            <div className="rmx__head rmx__head--goal">
              {h.goal}
              <span className="rmx__head-sub">{h.goalSub}</span>
            </div>
          </div>

          <div className="rmx__rows">
            {metrics.map((row) => (
              <div key={row.key} className="rmx__row">
                <div className="rmx__metric">{labelFor(row.key)}</div>
                <div className={`rmx__value rmx__value--${row.colour}`}>
                  <span className="rmx__num">{row.current}</span>
                  {METRICS.status[row.colour] && <span className="rmx__status">{METRICS.status[row.colour]}</span>}
                </div>
                <div className="rmx__arrow" aria-hidden="true">
                  →
                </div>
                <div className="rmx__value rmx__value--goal">
                  <Tick />
                  <span className="rmx__num">{row.goal}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rmx__divider" aria-hidden="true" />

          <div className="rmx__row rmx__row--total">
            <div className="rmx__metric rmx__metric--total">{METRICS.totalLabel}</div>
            <div className="rmx__value rmx__value--today-total">
              <span className="rmx__num">{total.current}</span>
            </div>
            <div className="rmx__arrow" aria-hidden="true">
              →
            </div>
            <div className="rmx__value rmx__value--goal">
              <Tick />
              <span className="rmx__num">{total.goal}</span>
            </div>
          </div>
        </div>

        {/* the colour key — always shown (Yemi comment #5) */}
        <ul className="rmx__legend">
          {METRICS.legend.map((k) => (
            <li key={k.colour} className={`rmx__legend-item rmx__legend-item--${k.colour}`}>
              {k.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
