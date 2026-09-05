import { useState } from 'react';
import { metricColour, computeAdModule } from '../../calc/calculator.js';
import { rpvMoney, money, dailyVisitors } from '../../calc/rounding.js';
import { ga } from '../../analytics/ga.js';
import './ResultsScreen.css';

/**
 * Simple, plain results page (design comes later). Shows the real calculated
 * numbers + the doc's real block copy. Order (Quiz Logics.docx · Results):
 * Metric table → Block 1 → (2 or 3) → (4|5|6|7) → Ad module.
 */
export default function ResultsScreen({ result, onBack, adAdjustable = false }) {
  const r = result;
  const pathLabel = r.path === 'plg' ? 'PLG' : 'SLG';

  const pct = (x) => `${Math.round(x * 100)}%`;
  const dollars = (x) => `$${Math.round(x)}`;

  const metricRows = [
    { key: 'optIn', name: 'Opt-in rate', cur: pct(r.current.optIn), goal: pct(r.goal.optIn), ceil: pct(r.ceilings.optIn), curVal: r.current.optIn },
    { key: 'lead', name: r.path === 'plg' ? 'Lead conversion' : 'Call booking', cur: pct(r.current.lead), goal: pct(r.goal.lead), ceil: pct(r.ceilings.lead), curVal: r.current.lead },
    { key: 'close', name: 'Close rate', cur: pct(r.current.close), goal: pct(r.goal.close), ceil: pct(r.ceilings.close), curVal: r.current.close },
    { key: 'rps', name: 'Revenue per subscriber', cur: dollars(r.current.rps), goal: dollars(r.goal.rps), ceil: '$50', curVal: r.current.rps },
  ];

  return (
    <div className="results-screen">
      <header className="results-screen__bar">
        <div className="results-screen__logo">
          <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
        </div>
        <button type="button" className="results-screen__back" onClick={onBack}>
          &#8249; Back
        </button>
      </header>

      <main className="results-screen__body">
        <p className="results-screen__eyebrow">Your RPV™ diagnostic · {pathLabel}</p>

        {/* Current → Goal RPV */}
        <section className="results-card results-hero">
          <div className="results-hero__pair">
            <div>
              <span className="results-hero__label">Current RPV™</span>
              <span className="results-hero__value">{rpvMoney(r.currentRPV)}</span>
            </div>
            <span className="results-hero__arrow">→</span>
            <div>
              <span className="results-hero__label">Potential RPV™</span>
              <span className="results-hero__value">{rpvMoney(r.goalRPV)}</span>
            </div>
          </div>
          <p className="results-hero__sub">
            By lifting your RPV™ from {rpvMoney(r.currentRPV)} to {rpvMoney(r.goalRPV)} (a{' '}
            {Math.round(r.requiredLift * 100)}% increase), you could add $1.5M/year ($125k/mo)
            from the same traffic.
          </p>
        </section>

        {/* Metric table */}
        <section className="results-card">
          <h2 className="results-card__title">Your five metrics</h2>
          <table className="results-metrics">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Now</th>
                <th>Goal</th>
                <th>Ceiling</th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row) => (
                <tr key={row.key}>
                  <td>{row.name}</td>
                  <td>
                    <span className={`results-chip results-chip--${metricColour(row.key, row.curVal, r.path)}`}>
                      {row.cur}
                    </span>
                  </td>
                  <td>{row.goal}</td>
                  <td className="results-metrics__ceil">{row.ceil}</td>
                </tr>
              ))}
              <tr>
                <td>{r.path === 'plg' ? 'Average order value' : 'Average deal size'}</td>
                <td>{dollars(r.orderValue)}</td>
                <td className="results-metrics__fixed" colSpan={2}>Fixed — not a lever</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Block 1 — revenue split */}
        {!r.block1.splitSuppressed && (
          <section className="results-card">
            <p>
              Around <strong>{r.block1.emailPercentage}%</strong> of your revenue comes through
              the five metrics that influence your RPV™. Everything else comes from: repeat
              purchases, referrals, direct traffic, social, and word of mouth. The{' '}
              {r.block1.emailPercentage}% is the part you can track, control, and systematically
              optimise. The bigger this number, the more predictable your revenue.
            </p>
          </section>
        )}

        {/* Block 3 — no email (suppresses Block 2) */}
        {r.noEmail && (
          <section className="results-card results-card--warn">
            <p>
              You're not using email to bring people back, so every visitor is mostly a one-shot
              opportunity. They either buy today or you may lose them. That means Revenue Per
              Subscriber™ is currently $0. You're leaving a major revenue lever unused: turning
              the people you already attracted into repeat revenue.
            </p>
          </section>
        )}

        {/* Block 2 — low path share */}
        {r.lowPathShare && (
          <section className="results-card results-card--warn">
            <p>
              Almost none of your revenue is coming through the five metrics used to calculate
              Revenue Per Visitor™. That usually means you're not making the most of the visitors
              you're already attracting. Too much of your revenue depends on channels and outcomes
              you can't reliably predict or control.
            </p>
          </section>
        )}

        {/* Block 4 / 5 / 6 / 7 */}
        {r.cappedBlock === 4 && (
          <section className="results-card results-card--good">
            <h2 className="results-card__title">You can reach it inside your funnel</h2>
            <p>
              You don't need to max out every metric. Hitting the goal figures in the table above
              gets you to your $1.5M/year opportunity — without adding a penny to your current
              marketing spend.
            </p>
          </section>
        )}
        {r.cappedBlock === 5 && (
          <section className="results-card results-card--warn">
            {r.capped.gapClosedByMetrics ? (
              <p>
                You've maximised every metric in the Compounding Revenue Per Visitor™ OS. Following
                the system, you could add another <strong>{money(r.capped.achievableGain)}</strong> a
                year without increasing your traffic — that alone clears your $1.5M/year goal. The
                opportunity is building this system, then compounding it with a feedback loop where
                every buyer and non-buyer makes each new visitor more valuable.
              </p>
            ) : (
              <p>
                You've maximised every metric in the Compounding Revenue Per Visitor™ OS. Following
                the system, you could add another <strong>{money(r.capped.achievableGain)}</strong> a
                year without increasing your traffic. You're still{' '}
                <strong>{money(r.capped.remainingGap)}</strong> short of $1.5M. So now, the answer
                really is more traffic: <strong>{dailyVisitors(r.capped.additionalDailyVisitors).toLocaleString()}</strong>{' '}
                more visitors a day. But before you scale, build the feedback loop. Every buyer and
                non-buyer gives you data to improve your messaging and positioning, making each new
                visitor more valuable.
              </p>
            )}
          </section>
        )}
        {r.cappedBlock === 6 && (
          <section className="results-card results-card--warn">
            <p>
              You've maximised every metric in the Compounding Revenue Per Visitor™ OS. Following
              the system, you could add another <strong>{money(r.capped.achievableGain)}</strong> a
              year without increasing your traffic. But getting all the way to $1.5M would require
              far more traffic than your business can realistically handle. So this isn't a
              conversion problem. And more traffic isn't the answer either.
            </p>
          </section>
        )}
        {r.cappedBlock === 7 && (
          <section className="results-card results-card--warn">
            <p>
              Almost none of your revenue is coming through the five metrics used to calculate
              Revenue Per Visitor™. That usually means you're not making the most of the visitors
              you're already attracting. Too much of your revenue depends on channels and outcomes
              you can't reliably predict or control.
            </p>
          </section>
        )}

        {/* Ad module */}
        {r.ad && (
          <AdModule
            result={r}
            adAdjustable={adAdjustable}
          />
        )}

        <section className="results-card results-cta">
          <p>
            Grab a pen, paper, and your team for the hands-on workshop — or bring your numbers
            straight to Your Next $125k Game Plan Call.
          </p>
          <div className="results-cta__row">
            <button
              type="button"
              className="q-btn results-cta__btn"
              onClick={() => ga.ctaClick('watch_workshop')}
            >
              Watch the workshop →
            </button>
            <button
              type="button"
              className="q-btn results-cta__btn results-cta__btn--ghost"
              onClick={() => ga.ctaClick('book_call')}
            >
              Book the call
            </button>
          </div>
        </section>

        <p className="results-screen__note">
          Simple data view — the designed results page comes in a later pass. All numbers are live
          from the calculator (verified against the build-spec test fixture).
        </p>
      </main>
    </div>
  );
}

function AdModule({ result: r, adAdjustable }) {
  const [share, setShare] = useState(r.ad.share);
  const ad = computeAdModule({
    q7: r.inputs.q7,
    q7b: r.inputs.q7b,
    share,
    currentRPV: r.currentRPV,
    goalRPV: r.goalRPV,
    additionalRPVNeeded: r.additionalRPVNeeded,
  });
  const d = ad.display;

  return (
    <section className="results-card">
      <h2 className="results-card__title">What your ad spend could be worth</h2>
      <p className="results-card__lead">
        You don't need to spend more. When each visitor becomes more valuable, the same ad traffic
        produces more revenue.
      </p>

      {adAdjustable && (
        <div className="results-slider">
          <label>
            What % of your traffic comes from ads?{' '}
            <strong>{Math.round(share * 100)}%</strong>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round(share * 100)}
            onChange={(e) => setShare(Number(e.target.value) / 100)}
          />
        </div>
      )}

      <table className="results-metrics results-metrics--ad">
        <thead>
          <tr>
            <th></th>
            <th>Today</th>
            <th>At your RPV™ goal</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Monthly ad spend</td><td>{money(ad.monthlySpend)}</td><td>{money(ad.monthlySpend)}</td></tr>
          <tr><td>Ad-generated visitors</td><td>{d.adVisitors.toLocaleString()}</td><td>{d.adVisitors.toLocaleString()}</td></tr>
          <tr><td>Revenue per visitor</td><td>{rpvMoney(r.currentRPV)}</td><td>{rpvMoney(r.goalRPV)}</td></tr>
          <tr><td>Revenue from ad traffic</td><td>{money(d.currentAdRev)}</td><td>{money(d.goalAdRev)}</td></tr>
          <tr><td>ROAS</td><td>{d.currentROAS}×</td><td>{d.goalROAS}×</td></tr>
        </tbody>
      </table>
      <p className="results-ad__punch">
        +{money(d.monthlyGain)}/month · +{money(d.annualGain)}/year — from the same ad spend.
      </p>
    </section>
  );
}
