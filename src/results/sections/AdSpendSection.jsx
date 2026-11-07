import { useMemo, useState } from 'react';
import { AD_SPEND, CTA } from '../copy.js';
import { fill } from '../resolveTokens.js';
import { computeAdModule } from '../../calc/calculator.js';
import { money, round100, rpvMoney } from '../../calc/rounding.js';
import { ga } from '../../analytics/ga.js';
import './AdSpendSection.css';

/* "$X back for every $1" — the ROAS as money, one decimal like the old
   ROAS label, but rounding may never lift a return below 1× to "$1.00"
   (a true 0.96 reads "$0.96") or turn a real return into "$0.00". */
const cents = (v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function perDollar(raw, shown) {
  const two = Math.floor(raw * 100) / 100;
  if (raw < 1 && shown >= 1) return cents(two);
  if (raw > 0 && shown === 0) return two > 0 ? cents(two) : '<$0.01';
  return cents(shown);
}

/**
 * "About your ad budget" — 2.0 FINAL RP QC (Alefiya, 4 Nov): rebuilt to her
 * artifact "Ad Budget at Your RPV Goal" (one read, top to bottom): same
 * spend → what it brings back today vs at the goal → the difference → the
 * workshop. Every figure is the taker's own (computeAdModule).
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

  // the month is worked from the two figures as shown, so the strip always
  // matches the two cards; the year comes from the unrounded figures
  // (Logic Doc · 7 fixture: +$81,200 a month, +$975,000 a year)
  const gain = d.goalAdRev - d.currentAdRev;
  const year = round100((ad.goalAdRev - ad.currentAdRev) * 12);

  const cards = [
    { key: 'today', label: c.todayLabel, rev: d.currentAdRev, raw: ad.currentAdRev, roas: d.currentROAS },
    { key: 'goal', label: c.goalLabel, rev: d.goalAdRev, raw: ad.goalAdRev, roas: d.goalROAS },
  ];

  const fillPct = ((sharePct - 10) / 90) * 100;
  const ext = CTA.workshop.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : null;
  // the spend is the taker's own answer: shown as entered, to the dollar
  // ($30 stays $30, $7,550 stays $7,550; money() rounds to $100 — review)
  const spendMoney = (v) => `$${Math.round(v).toLocaleString('en-US')}`;
  const perMonth = (v, fmt = money) => fill(c.spendChip, { spend: fmt(v) });

  return (
    <section className="rad">
      <div className="rad__inner">
        <span className="rad__chip">{c.chip}</span>
        <h2 className="rad__headline">{c.headline}</h2>
        {hasSpend ? (
          <p className="rad__spend">
            {c.spendBefore} <b>{perMonth(spend, spendMoney)}</b>
            {c.spendAfter}
          </p>
        ) : (
          <p className="rad__spend rad__spend--plain">{c.ledeNoSpend}</p>
        )}

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

        {/* today vs the goal: what the same spend brings back each month */}
        <div className="rad__compare">
          {cards.map((k, i) => [
            i === 1 && (
              <span key="vs" className="rad__vs" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ),
            <div key={k.key} className={`rad__side rad__side--${k.key}`}>
              <span className="rad__lbl">{k.label}</span>
              <span className="rad__big">{money(k.rev)}</span>
              <span className="rad__mo">{c.backEach}</span>
              {k.roas != null && (
                <span className="rad__pill">{fill(c.perDollar, { amount: perDollar(k.raw / spend, k.roas) })}</span>
              )}
            </div>,
          ])}
        </div>

        {/* the difference */}
        <div className="rad__result">
          <div className="rad__gain">
            <span className="rad__big rad__big--gain">+{money(gain)}</span>
            <span className="rad__mo">{c.gainSub}</span>
          </div>
          <span className="rad__yr">{fill(c.year, { year: money(year) })}</span>
        </div>
      </div>

      {/* the workshop, with its thumbnail, on its own dark-blue band: light-
          blue box, dark-blue text, the page's blue button (user, Nov 7) */}
      <div className="rad__band">
        <div className="rad__ws">
          <a
            className="rad__ws-thumb"
            href={CTA.workshop.href}
            {...ext}
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => ga.ctaClick(CTA.workshop.id)}
          >
            <img src="/assets/results-workshop-thumb.webp" alt="" width="1280" height="720" loading="lazy" />
          </a>
          <div className="rad__ws-copy">
            <h3 className="rad__ws-head">{fill(c.wsHead, { goal: money(d.goalAdRev) })}</h3>
            <p className="rad__ws-p">
              {c.wsBefore} <b className="rad__r">{rpvMoney(r.currentRPV)}</b> {c.wsTo}{' '}
              <b className="rad__g">{rpvMoney(r.goalRPV)}</b>
              {hasSpend && (
                <>
                  {c.wsSame} <b>{perMonth(spend, spendMoney)}</b> {c.wsInAds} <b>{perMonth(gain)}</b>
                </>
              )}
              {c.wsAfter}
            </p>
            <a className="rad__btn" href={CTA.workshop.href} {...ext} onClick={() => ga.ctaClick(CTA.workshop.id)}>
              {c.button}
              {' '}
              {/* the artifact's arrow (system font, as it renders there) */}
              <span className="rad__arw" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
