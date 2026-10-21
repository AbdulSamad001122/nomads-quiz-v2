import { useLayoutEffect, useRef } from 'react';
import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import {
  BENCHMARK_COPY,
  benchmarkFigures,
  rateText,
  toneParts,
  sourceLines,
} from '../../data/benchmarkCard.js';
import './QuizScreen.css';
import './BenchmarkScreen.css';

/* Same breakpoint as the QuizScreen shell's stacked layout. */
const STACKED_QUERY = '(max-width: 900px), (max-width: 1160px) and (orientation: portrait)';
/* Yemi's card: "Text may shrink up to 15% to fit before … scrolling." */
const MIN_ZOOM = 0.85;

function Toned({ text }) {
  return toneParts(text).map((p, i) =>
    p.tone ? (
      // eslint-disable-next-line react/no-array-index-key
      <span key={i} className={`bm__tone bm__tone--${p.tone}`}>
        {p.t}
      </span>
    ) : (
      p.t
    ),
  );
}

/**
 * Q4 benchmark card (after Q4, before Q5) — Yemi's "Q4 Benchmark" HTML card
 * (Slack, Oct 20) set in the quiz's split-screen shell. Content order is the
 * card's: claim (left) → table → gap card → next line → CTA → up next →
 * sources (right). Stacked on phones, that is the card's single column.
 *
 * Behaviour kept from the card: one screen, text shrinks up to 15% to fit,
 * then the page scrolls; the sources note opens/closes; the CTA moves on.
 */
export default function BenchmarkScreen({ theme, isSlg, onBack, onContinue }) {
  const mode = isSlg ? 'slg' : 'plg';
  const s = BENCHMARK_COPY.shared;
  const c = BENCHMARK_COPY[mode];
  const f = benchmarkFigures(mode);
  const stackRef = useRef(null);

  // Fit-to-screen (desktop only): measure at full size, then shrink the
  // right-hand stack just enough to remove the page scroll, never past 85%.
  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el) return undefined;
    const stacked = window.matchMedia(STACKED_QUERY);
    const fit = () => {
      el.style.zoom = '';
      if (stacked.matches) return;
      const over = document.documentElement.scrollHeight - window.innerHeight;
      if (over <= 0) return;
      const h = el.offsetHeight;
      el.style.zoom = String(Math.max(MIN_ZOOM, (h - over) / h));
    };
    fit();
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(fit, 120);
    };
    window.addEventListener('resize', onResize);
    stacked.addEventListener?.('change', fit);
    document.fonts?.ready.then(fit);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
      stacked.removeEventListener?.('change', fit);
    };
  }, [mode]);

  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-label-bg': theme.labelBg,
    '--t-label-text': theme.labelText,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--t-option-text': theme.optionText,
    '--t-option-selected-bg': theme.optionSelectedBg,
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
            <div className="question-panel__content bm__claim">
              <p className="question-panel__label bm__eyebrow">
                {s.myth_lead} <s>{s.myth_struck}</s>
              </p>
              <h1 className="bm__headline">
                {s.headline}
                <span className="bm__payoff">
                  <HighlightSweep tone={sweepToneFor(theme.name)}>
                    {s.headline_payoff}
                  </HighlightSweep>
                </span>
              </h1>
              <p className="bm__context">
                <Toned text={s.context} />
              </p>
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

      <section className="answer-panel bm__panel">
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

        <div className="bm__body">
          <div className="bm__stack" ref={stackRef}>
            <div className="bm__table" role="table" aria-label={s.table_heading}>
              <div className="bm__tr bm__th" role="row">
                <span role="columnheader">{s.table_heading}</span>
                <span role="columnheader" className="bm__col bm__col--t">
                  <i className="bm__dot" aria-hidden="true" />
                  {s.label_typical}
                </span>
                <span role="columnheader" className="bm__col bm__col--o">
                  <i className="bm__dot" aria-hidden="true" />
                  {s.label_optimised}
                </span>
              </div>
              {c.rows.map((r, i) => (
                <div className="bm__tr bm__row" role="row" key={r.label}>
                  <span className="bm__lab" role="rowheader">
                    {r.label}
                    <small>{r.sub}</small>
                  </span>
                  <span className="bm__v bm__v--t" role="cell">
                    <span>{rateText(r.typical_rate)}%</span>
                    <small>
                      {f.counts[i].typical}
                      {r.unit ? ` ${r.unit}` : ''}
                    </small>
                  </span>
                  <span className="bm__v bm__v--o" role="cell">
                    <span>{rateText(r.optimised_rate)}%</span>
                    <small>
                      {f.counts[i].optimised}
                      {r.unit ? ` ${r.unit}` : ''}
                    </small>
                  </span>
                </div>
              ))}
              <div className="bm__tr bm__row bm__rev" role="row">
                <span className="bm__lab" role="rowheader">
                  {c.revenue_label}
                  <small>{c.revenue_sub}</small>
                </span>
                <span className="bm__v bm__v--t" role="cell">
                  <span>{f.revTypical}</span>
                </span>
                <span className="bm__v bm__v--o" role="cell">
                  <span>{f.revOptimised}</span>
                </span>
              </div>
            </div>

            <div className="bm__gap">
              <div className="bm__gap-top">
                <span className="bm__big">
                  {f.gapMonth}
                  <small>{s.gap_month_suffix}</small>
                </span>
                <span className="bm__yr">
                  <b>{f.gapYear}</b>
                  {s.gap_year_suffix}
                </span>
              </div>
              <div className="bm__tot">
                <span className="bm__x">{f.multiple}</span>
                <span>
                  {s.year_sentence_a}{' '}
                  <span className="bm__tone bm__tone--t">{f.totalTypical}</span>{' '}
                  {s.year_sentence_b}{' '}
                  <span className="bm__tone bm__tone--o">{f.gapYearPlain}</span>{' '}
                  {s.year_sentence_c}
                </span>
              </div>
            </div>

            <p className="bm__next">{s.next}</p>
            <button type="button" className="q-btn bm__cta" onClick={onContinue}>
              <span>{s.cta}</span>
              <span aria-hidden="true">→</span>
            </button>
            <p className="bm__upnext">{s.up_next}</p>
            <details className="bm__src">
              <summary>{s.source_q}</summary>
              {sourceLines().map((line) => (
                <p key={line}>
                  <Toned text={line} />
                </p>
              ))}
            </details>
          </div>
        </div>

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
