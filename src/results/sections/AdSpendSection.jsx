import { useMemo, useState } from 'react';
import { AD_SPEND } from '../copy.js';
import { computeAdModule } from '../../calc/calculator.js';
import { money, rpvMoney } from '../../calc/rounding.js';
import { ga } from '../../analytics/ga.js';
import './AdSpendSection.css';

/**
 * Conditional ad-spend module (doc: only when the taker answered the ad
 * questions). Live calculator: the slider adjusts the monthly ad spend and
 * everything recomputes through computeAdModule. Rendered only when
 * result.ad exists (QuizFlow already gates on q7b).
 */
export default function AdSpendSection({ result }) {
  const r = result;
  const [spend, setSpend] = useState(r.ad.monthlySpend);

  const sliderMax = useMemo(() => {
    const base = Math.max(50000, r.ad.monthlySpend * 2);
    return Math.ceil(base / 10000) * 10000;
  }, [r.ad.monthlySpend]);

  const ad = useMemo(
    () =>
      computeAdModule({
        q7: r.inputs.q7,
        q7b: spend,
        share: r.ad.share,
        currentRPV: r.currentRPV,
        goalRPV: r.goalRPV,
        additionalRPVNeeded: r.additionalRPVNeeded,
      }),
    [r, spend]
  );
  const d = ad.display;

  // Row set mirrors the reference design exactly, including the bold lead
  // row that repeats "Your Monthly Spend" above the regular rows.
  const rows = [
    { key: 'spend-lead', label: AD_SPEND.tableLabels.spend, today: money(spend), goal: money(spend), lead: true },
    { key: 'spend', label: AD_SPEND.tableLabels.spend, today: money(spend), goal: money(spend) },
    { key: 'visitors', label: AD_SPEND.tableLabels.visitors, today: d.adVisitors.toLocaleString('en-US'), goal: d.adVisitors.toLocaleString('en-US') },
    { key: 'rpv', label: AD_SPEND.tableLabels.rpv, today: rpvMoney(r.currentRPV), goal: rpvMoney(r.goalRPV) },
    { key: 'revenue', label: AD_SPEND.tableLabels.revenue, today: money(d.currentAdRev), goal: money(d.goalAdRev), highlight: true },
    { key: 'roas', label: AD_SPEND.tableLabels.roas, today: `${d.currentROAS}×`, goal: `${d.goalROAS}×` },
  ];

  // Scale labels run from the $500 minimum to the slider max in full values
  // ("$500, $10,000 … $50,000") — user request, replacing the reference's
  // "$0 $10 $20…" thousands shorthand.
  const ticks = [500, ...[1, 2, 3, 4, 5].map((i) => (sliderMax / 5) * i)];
  const fmtTick = (v) => `$${Math.round(v).toLocaleString('en-US')}`;
  const fillPct = ((spend - 500) / (sliderMax - 500)) * 100;

  return (
    <section className="rad">
      <div className="rad__band" aria-hidden="true">
        {AD_SPEND.bandLines.join(' ')}
      </div>

      <span className="rad__chip">{AD_SPEND.chip}</span>

      <div className="rad__head">
        <img className="rad__doodle" src="/assets/results-spend-smarter.png" alt="" aria-hidden="true" />
        <h2 className="rad__headline">
          {AD_SPEND.headlineTop}{' '}
          <br />
          <span className="rad__hl">{AD_SPEND.headlineHighlight}</span>
        </h2>
      </div>

      <p className="rad__sub">{AD_SPEND.subLines.join(' ')}</p>

      <div className="rad__grid">
        <div className="rad__main">
          <div className="rad__slider">
            <div className="rad__slider-top">
              <span className="rad__slider-label">{AD_SPEND.sliderLabel}</span>
              {/* Reference shows the big value without a thousands comma */}
              <span className="rad__slider-value">${spend}</span>
            </div>
            <input
              className="rad__range"
              type="range"
              min={500}
              max={sliderMax}
              step={500}
              value={spend}
              onChange={(e) => setSpend(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #ecd9c5 0%, #ecd9c5 ${fillPct}%, rgba(236, 217, 197, 0.38) ${fillPct}%, rgba(236, 217, 197, 0.38) 100%)`,
              }}
              aria-label={AD_SPEND.sliderLabel}
            />
            <div className="rad__ticks">
              {ticks.map((t) => (
                <span key={t}>{fmtTick(t)}</span>
              ))}
            </div>
          </div>

          <p className="rad__adjust">{AD_SPEND.adjustNote}</p>

          <div className="rad__table">
            <div className="rad__tablegrid">
              <div className="rad__rows">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className={`rad__row${row.lead ? ' rad__row--lead' : ''}${row.highlight ? ' rad__row--hl' : ''}`}
                  >
                    <span className="rad__row-label">{row.label}</span>
                    <span className="rad__row-value">{row.today}</span>
                  </div>
                ))}
              </div>
              <div className="rad__goal">
                {rows.map((row) => (
                  <div key={row.key} className={`rad__goal-cell${row.lead ? ' rad__goal-cell--lead' : ''}`}>
                    {row.goal}
                  </div>
                ))}
              </div>
            </div>
            <p className="rad__caption">{AD_SPEND.caption}</p>
          </div>
        </div>

        <aside className="rad__panel">
          <p className="rad__panel-intro">{AD_SPEND.panelIntroLines.join(' ')}</p>
          <span className="rad__panel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4b1238" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17 10 10l4 4 7-8" />
              <path d="M15 6h6v6" />
            </svg>
          </span>
          <p className="rad__gain">{money(d.monthlyGain)}</p>
          <p className="rad__gain-sub">{AD_SPEND.panelGainSub}</p>
          <span className="rad__year-chip">{AD_SPEND.panelYearChip(money(d.annualGain))}</span>

          <h4 className="rad__nerds-title">{AD_SPEND.nerdsTitle}</h4>
          <p className="rad__nerds-p">{AD_SPEND.nerdsP1}</p>
          <p className="rad__nerds-p">{AD_SPEND.nerdsP2}</p>
          <p className="rad__nerds-p">
            {AD_SPEND.nerdsP3Plain}{' '}
            <br />
            <strong>{AD_SPEND.nerdsP3Bold}</strong>
          </p>
          {/* TODO: real RPV-by-channel URL when provided */}
          <a className="rad__channel-btn" href="#" onClick={() => ga.ctaClick('rpv_by_channel')}>
            {AD_SPEND.channelButton}
          </a>
        </aside>
      </div>
    </section>
  );
}
