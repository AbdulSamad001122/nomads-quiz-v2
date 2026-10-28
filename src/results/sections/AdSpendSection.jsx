import { useMemo, useState } from 'react';
import { AD_SPEND, CTA } from '../copy.js';
import { fill } from '../resolveTokens.js';
import { computeAdModule } from '../../calc/calculator.js';
import { money, rpvMoney } from '../../calc/rounding.js';
import { ga } from '../../analytics/ga.js';
import './AdSpendSection.css';

/* a round scale top with 4 equal steps ($80K for a $73,800 bar) */
function niceMax(v) {
  if (!(v > 0)) return 1;
  const raw = v / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw);
  return step * 4;
}
/* axis labels: $0 · $20K · $1.2M */
function short(v) {
  if (v === 0) return '$0';
  if (v >= 1e6) return `$${(v / 1e6).toFixed(v % 1e6 ? 1 : 0)}M`;
  if (v >= 1e3) return `$${+(v / 1e3).toFixed(1)}K`;
  return `$${v}`;
}

/**
 * "About your ad budget" — QC item 5 (Oct 2026), rebuilt to Alefiya's "RPV Ad
 * Budget Section" design: spend and visitors as two "stays the same" chips,
 * the month's revenue from that spend as two bars on one scale with a dashed
 * line at the ad spend (ROAS as a small label by each bar), and the extra
 * revenue card with its working and a workshop button. Brand colours.
 *
 * Shown only when the taker answered the ad questions (result.ad). "Not
 * sure" takers (adAdjustable) also get the Logic Doc's ad-traffic share
 * slider; everything recomputes through computeAdModule.
 */
export default function AdSpendSection({ result, adAdjustable = false }) {
  const r = result;
  const c = AD_SPEND;
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
  const hasSpend = Number.isFinite(spend) && spend > 0;

  // the gain is worked from the two figures as shown, so the card's working
  // line always adds up; the year is 12 × that month
  const gain = d.goalAdRev - d.currentAdRev;
  const top = niceMax(Math.max(d.goalAdRev, d.currentAdRev, hasSpend ? spend : 0));
  const pct = (v) => Math.max(0, Math.min(100, (v / top) * 100));
  const spendPct = hasSpend ? pct(spend) : null;

  const bars = [
    { key: 'today', label: c.todayLabel, rpv: r.currentRPV, rev: d.currentAdRev, roas: d.currentROAS },
    { key: 'goal', label: c.goalLabel, rpv: r.goalRPV, rev: d.goalAdRev, roas: d.goalROAS },
  ].map((b) => {
    const w = pct(b.rev);
    const good = b.roas != null && b.roas >= 1;
    // label inside a long bar; otherwise just past the bar (or past the
    // dashed line when the bar stops short of it), as in the design
    const after = Math.max(w, spendPct ?? 0);
    const inside = w >= 30 || after > 78;
    return { ...b, w, good, inside, outLeft: after };
  });
  const verdict = (b) =>
    b.roas == null
      ? null
      : b.good
        ? fill(c.back, { amount: `$${b.roas.toFixed(2)}` })
        : fill(c.short, { amount: money(spend - b.rev) });

  const fillPct = ((sharePct - 10) / 90) * 100;
  const ext = CTA.workshop.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : null;

  return (
    <section className="rad">
      <div className="rad__inner">
        <span className="rad__chip">{c.chip}</span>
        <h2 className="rad__headline">{c.headline}</h2>
        <p className="rad__lede">{c.lede}</p>

        <div className="rad__same">
          <div>
            {c.spendChip} <b>{money(spend || 0)}</b>
            <em>{c.stays}</em>
          </div>
          <div>
            {c.visitorsChip} <b>{d.adVisitors.toLocaleString('en-US')}</b>
            <em>{c.stays}</em>
          </div>
        </div>

        {/* Logic Doc · 7: the share slider, "Not sure" takers only */}
        {adAdjustable && (
          <div className="rad__slider">
            <div className="rad__slider-top">
              <span className="rad__slider-label">{c.shareLabel}</span>
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
                background: `linear-gradient(to right, #5d1b4e 0%, #5d1b4e ${fillPct}%, #e6d9cc ${fillPct}%, #e6d9cc 100%)`,
              }}
              aria-label={c.shareLabel}
            />
            <p className="rad__adjust">{c.adjustNote}</p>
          </div>
        )}

        <div className="rad__grid">
          <div className="rad__chart">
            <h3 className="rad__chart-head">{c.chartHead}</h3>
            {hasSpend && (
              <div className="rad__key">
                <i aria-hidden="true" />
                {fill(c.spendKey, { spend: money(spend) })}
              </div>
            )}
            <div className="rad__rows">
              {bars.map((b) => (
                <div key={b.key} className={`rad__row rad__row--${b.key}`}>
                  <div className="rad__who">
                    <span>
                      {b.label}
                      {b.roas != null && (
                        <span className={`rad__roas${b.good ? ' rad__roas--good' : ''}`}>
                          {fill(c.roas, { x: String(b.roas) })}
                        </span>
                      )}
                    </span>
                    <small>{fill(c.perVisitor, { rpv: rpvMoney(b.rpv) })}</small>
                  </div>
                  <div className="rad__track">
                    <div className="rad__bar" style={{ width: `${Math.max(b.w, b.rev > 0 ? 1.5 : 0)}%` }}>
                      {b.inside && money(b.rev)}
                    </div>
                    {spendPct != null && <i className="rad__line" style={{ left: `${spendPct}%` }} aria-hidden="true" />}
                    {!b.inside && (
                      <span className="rad__out" style={{ left: `calc(${b.outLeft}% + 10px)` }}>
                        {money(b.rev)}
                      </span>
                    )}
                  </div>
                  {verdict(b) && <p className={`rad__verdict${b.good ? ' rad__verdict--good' : ''}`}>{verdict(b)}</p>}
                </div>
              ))}
            </div>
            <div className="rad__axis" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i}>{short((top / 4) * i)}</span>
              ))}
            </div>
            <p className="rad__foot">{c.foot}</p>
          </div>

          <aside className="rad__pay">
            <span className="rad__pay-intro">{c.payIntro}</span>
            <span className="rad__pay-n">
              +{money(gain)}
              <small>{c.payGainSub}</small>
            </span>
            <span className="rad__pay-year">{fill(c.payYear, { year: money(gain * 12) })}</span>
            <span className="rad__pay-math">
              {fill(c.payMath, { goal: money(d.goalAdRev), today: money(d.currentAdRev), gain: money(gain) })}
            </span>
            <a className="rad__btn" href={CTA.workshop.href} {...ext} onClick={() => ga.ctaClick(CTA.workshop.id)}>
              {`${c.button} →`}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
