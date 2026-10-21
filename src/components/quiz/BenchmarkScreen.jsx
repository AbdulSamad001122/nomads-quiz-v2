import { Fragment, useLayoutEffect, useRef } from 'react';
import {
  BENCHMARK_COPY,
  benchmarkFigures,
  rateText,
  toneParts,
} from '../../data/benchmarkCard.js';
import './BenchmarkScreen.css';

/* The card's MIN_ZOOM: "Text may shrink up to 15% to fit before … scrolling." */
const MIN_ZOOM = 0.85;

/* {{optimised}} → green, [[typical]] → red; "\n" → line break (the card's rich()). */
function Rich({ text }) {
  return text.split('\n').map((line, li) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={li}>
      {li > 0 && <br />}
      {toneParts(line).map((p, i) =>
        p.tone ? (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i} className={`bmc__${p.tone}`}>
            {p.t}
          </span>
        ) : (
          p.t
        ),
      )}
    </Fragment>
  ));
}

/**
 * Q4 benchmark card (after Q4, before Q5) — Yemi's "Q4 Benchmark SLG.html"
 * and "Q4 Benchmark PLG.html" (Slack, Oct 20; one card, `isSlg` picks the
 * version) ported as-is: same layout (one centred column on the navy
 * ground, LAYOUT = "single"), same copy, same colours, red = typical and
 * green = optimised. Only the file's preview chrome (grey bar, stand-in
 * header, copy editing) is dropped: the quiz's progress strip is the header.
 *
 * Behaviour kept from the card: if the column is taller than the space, it
 * shrinks to fit when that needs no more than 15%, otherwise it stays full
 * size and scrolls. The CTA moves on to Q5 (the card's "nomads:card-complete").
 * Added for the quiz: a Back control, in the card's own "← Back" style (the
 * card has one in its paced mode only).
 */
export default function BenchmarkScreen({ isSlg, onBack, onContinue }) {
  const mode = isSlg ? 'slg' : 'plg';
  const s = BENCHMARK_COPY.shared;
  const c = BENCHMARK_COPY[mode];
  const f = benchmarkFigures(mode);
  const stageRef = useRef(null);
  const colRef = useRef(null);

  // The card's layout() for "single": available = stage height − 60 (the
  // slide's 28 + 32 padding); shrink only when 85% or more still fits.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const col = colRef.current;
    if (!stage || !col) return undefined;
    const fit = () => {
      col.style.zoom = '1';
      const a = stage.clientHeight - 60;
      const n = col.scrollHeight;
      col.style.zoom = String(n > a && a / n >= MIN_ZOOM ? a / n : 1);
    };
    fit();
    // Re-fit whenever the stage changes size: window resizes, and the
    // progress strip publishing its real height after the first paint.
    const ro = new ResizeObserver(() => fit());
    ro.observe(stage);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [mode]);

  return (
    <main
      className="bmc"
      ref={stageRef}
      aria-label="Benchmark: same visitors, more revenue"
    >
      <section className="bmc__slide">
        <div className="bmc__col" ref={colRef}>
          <button type="button" className="bmc__back" onClick={onBack}>
            ← {s.back}
          </button>

          <div className="bmc__grp">
            <div className="bmc__eyebrow">
              {s.myth_lead} <s>{s.myth_struck}</s>
            </div>
            <h1 className="bmc__h1">
              {s.headline}
              <span className="bmc__pay">{s.headline_payoff}</span>
            </h1>
            <p className="bmc__context">
              <Rich text={s.context} />
            </p>
          </div>

          <div className="bmc__grp">
            <div className="bmc__panel">
              <div className="bmc__tbl" role="table" aria-label={s.table_heading}>
                <div className="bmc__tr bmc__th" role="row">
                  <span role="columnheader">{s.table_heading}</span>
                  <span role="columnheader" className="bmc__t">
                    <i className="bmc__dot" />
                    {s.label_typical}
                  </span>
                  <span role="columnheader" className="bmc__o">
                    <i className="bmc__dot" />
                    {s.label_optimised}
                  </span>
                </div>
                {c.rows.map((r, i) => (
                  <div className="bmc__tr bmc__row" role="row" key={r.label}>
                    <span className="bmc__lab" role="rowheader">
                      {r.label}
                      <small>{r.sub}</small>
                    </span>
                    <span className="bmc__v bmc__t" role="cell">
                      <span>{rateText(r.typical_rate)}%</span>
                      <small>
                        {f.counts[i].typical}
                        {r.unit ? ` ${r.unit}` : ''}
                      </small>
                    </span>
                    <span className="bmc__v bmc__o" role="cell">
                      <span>{rateText(r.optimised_rate)}%</span>
                      <small>
                        {f.counts[i].optimised}
                        {r.unit ? ` ${r.unit}` : ''}
                      </small>
                    </span>
                  </div>
                ))}
                <div className="bmc__tr bmc__row bmc__rev" role="row">
                  <span className="bmc__lab" role="rowheader">
                    {c.revenue_label}
                    <small>{c.revenue_sub}</small>
                  </span>
                  <span className="bmc__v bmc__t" role="cell">
                    <span>{f.revTypical}</span>
                  </span>
                  <span className="bmc__v bmc__o" role="cell">
                    <span>{f.revOptimised}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bmc__grp">
            <div className="bmc__gap">
              <div className="bmc__top">
                <span className="bmc__big">
                  {f.gapMonth}
                  <small>{s.gap_month_suffix}</small>
                </span>
                <span className="bmc__yr">
                  <b>{f.gapYear}</b>
                  {s.gap_year_suffix}
                </span>
              </div>
              <div className="bmc__tot">
                <span className="bmc__x">{f.multiple}</span>
                <span>
                  {s.year_sentence_a} <span className="bmc__t">{f.totalTypical}</span>{' '}
                  {s.year_sentence_b} <span className="bmc__o">{f.gapYearPlain}</span>{' '}
                  {s.year_sentence_c}
                </span>
              </div>
            </div>
            <div className="bmc__grp">
              <p className="bmc__next">{s.next}</p>
              <button type="button" className="bmc__cta" onClick={onContinue}>
                <span>{s.cta}</span>
                <span aria-hidden="true">→</span>
              </button>
              <div className="bmc__upnext">{s.up_next}</div>
              <details className="bmc__src">
                <summary>{s.source_q}</summary>
                <p>
                  <Rich text={s.source_text} />
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
