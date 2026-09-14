import { useMemo, useState } from 'react';
import { AD_SPEND } from '../copy.js';
import { computeAdModule } from '../../calc/calculator.js';
import { money, rpvMoney } from '../../calc/rounding.js';
import { ga } from '../../analytics/ga.js';
import './AdSpendSection.css';

/** ROAS is null when the taker's ad spend is 0 — there is no ratio to show. */
const roas = (x) => (x == null ? '—' : `${x}×`);

/**
 * Conditional ad-spend module (doc: only when the taker answered the ad
 * questions). Live calculator: the slider adjusts the monthly ad spend and
 * everything recomputes through computeAdModule. Rendered only when
 * result.ad exists (QuizFlow already gates on q7b).
 */
export default function AdSpendSection({ result, adAdjustable = false }) {
  const r = result;

  // Logic Doc · 7: the slider adjusts the AD-TRAFFIC SHARE (Q7c) from 10–100%,
  // and only renders when the taker answered Q7c with "Not sure" — the spend
  // (Q7b) is what they told us and stays fixed. Driving spend instead leaves
  // adVisitors/revenue/monthlyGain inert, since adVisitors = Q7 × share.
  const [share, setShare] = useState(r.ad.share);
  const sharePct = Math.round(share * 100);

  const ad = useMemo(
    () =>
      computeAdModule({
        q7: r.inputs.q7,
        q7b: r.ad.monthlySpend,
        share,
        currentRPV: r.currentRPV,
        goalRPV: r.goalRPV,
        additionalRPVNeeded: r.additionalRPVNeeded,
      }),
    [r, share]
  );
  const d = ad.display;
  const spend = ad.monthlySpend;

  // Five rows, in the order of the copy doc's ad-module mockup (image9.png)
  // and Quiz Logics.docx 666–668. "Revenue from that spend" is the emphasised
  // row; the spend row is a plain one and appears once.
  const rows = [
    { key: 'spend', label: AD_SPEND.tableLabels.spend, today: money(spend), goal: money(spend) },
    { key: 'visitors', label: AD_SPEND.tableLabels.visitors, today: d.adVisitors.toLocaleString('en-US'), goal: d.adVisitors.toLocaleString('en-US') },
    { key: 'rpv', label: AD_SPEND.tableLabels.rpv, today: rpvMoney(r.currentRPV), goal: rpvMoney(r.goalRPV) },
    { key: 'revenue', label: AD_SPEND.tableLabels.revenue, today: money(d.currentAdRev), goal: money(d.goalAdRev), highlight: true },
    { key: 'roas', label: AD_SPEND.tableLabels.roas, today: roas(d.currentROAS), goal: roas(d.goalROAS) },
  ];

  // Ticks span 0–100 while the input runs 10–100, mirroring how the reference
  // labels a "$0" tick below the slider's real floor.
  //
  // MERGE NOTE (section/results-responsive-2): that branch relabelled these
  // ticks "$500 … $50,000" for the old ad-SPEND slider. Logic Doc · 7 makes
  // this control the ad-traffic SHARE, so the spend ticks and their sliderMax
  // no longer exist. Dropped deliberately, not lost in the merge.
  const ticks = [0, 20, 40, 60, 80, 100];
  const fmtTick = (v) => `${v}%`;
  const fillPct = ((sharePct - 10) / 90) * 100;

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
          {/* Logic Doc · 7: slider only when Q7c was answered "Not sure". */}
          {adAdjustable && (
            <>
              <div className="rad__slider">
                <div className="rad__slider-top">
                  <span className="rad__slider-label">{AD_SPEND.shareLabel}</span>
                  <span className="rad__slider-value">{sharePct}%</span>
                </div>
                <input
                  className="rad__range"
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={sharePct}
                  onChange={(e) => setShare(Number(e.target.value) / 100)}
                  style={{
                    background: `linear-gradient(to right, #ecd9c5 0%, #ecd9c5 ${fillPct}%, rgba(236, 217, 197, 0.38) ${fillPct}%, rgba(236, 217, 197, 0.38) 100%)`,
                  }}
                  aria-label={AD_SPEND.shareLabel}
                />
                <div className="rad__ticks">
                  {ticks.map((t) => (
                    <span key={t}>{fmtTick(t)}</span>
                  ))}
                </div>
              </div>

              <p className="rad__adjust">{AD_SPEND.adjustNote}</p>
            </>
          )}

          <div className="rad__table">
            <div className="rad__tablegrid">
              {/* Column heads, per the copy doc mockup — without them the two
                  money columns are unlabelled. */}
              <div className="rad__colhead rad__colhead--today">{AD_SPEND.tableHeads.today}</div>
              <div className="rad__colhead rad__colhead--goal">{AD_SPEND.tableHeads.goal}</div>
              <div className="rad__rows">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className={`rad__row${row.highlight ? ' rad__row--hl' : ''}`}
                  >
                    <span className="rad__row-label">{row.label}</span>
                    <span className="rad__row-value">{row.today}</span>
                  </div>
                ))}
              </div>
              <div className="rad__goal">
                {rows.map((row) => (
                  <div key={row.key} className="rad__goal-cell">
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
