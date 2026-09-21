import { useLayoutEffect, useRef } from 'react';
import { METRICS } from '../copy.js';
import { metricRows, fill } from '../resolveTokens.js';
import './MetricsSection.css';

/**
 * Section 2 — the metric table on a tilted cream paper sheet over dark navy.
 * Rows adapt wording to the taker's path (PLG/SLG); the "current" cells carry
 * the calculator's red/yellow/green colour per the Logic Doc.
 */
export default function MetricsSection({ result, tokens }) {
  const rows = metricRows(result);
  const sectionRef = useRef(null);

  // Pin the navy rectangle's top edge to the vertical middle of the
  // second-to-last table row at every screen size (drives --rmx-navy-top,
  // which the sheet's clip-path uses).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const update = () => {
      const rowEls = section.querySelectorAll('.rmx__row');
      if (rowEls.length < 2) return;
      const target = rowEls[rowEls.length - 2];
      const mid =
        target.getBoundingClientRect().top +
        target.getBoundingClientRect().height / 2 -
        section.getBoundingClientRect().top;
      section.style.setProperty('--rmx-navy-top', `${Math.round(mid)}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(section);
    return () => ro.disconnect();
  }, []);
  const labelFor = (key) => {
    const l = METRICS.rowLabels[key];
    return typeof l === 'string' ? l : l[result.path];
  };

  return (
    <section className="rmx" ref={sectionRef}>
      <div className="rmx__sheet" aria-hidden="true">
        <svg className="rmx__keyline" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points="1.4,2.6 98.6,2.6 98.6,98 1.4,98"
            fill="none"
            stroke="#4a1a3d"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />
        </svg>
      </div>

      <div className="rmx__inner">
        {/* Sep 19 doc rewrite: single-sentence headline with live RPV tokens
            (the old three-line headline + "Total traffic:" line are gone). */}
        <h2 className="rmx__headline">{fill(METRICS.headline, tokens)}</h2>

        <div className="rmx__table">
          <div className="rmx__head rmx__head--metric">{METRICS.headers.metric}</div>
          <div className="rmx__head">
            {METRICS.headers.current}
            <span className="rmx__head-sub">{METRICS.headers.currentSub}</span>
          </div>
          <div className="rmx__head">
            {METRICS.headers.goal}
            <span className="rmx__head-sub">{METRICS.headers.goalSub}</span>
          </div>

          {rows.map((row) => (
            <div key={row.key} className="rmx__row">
              <div className="rmx__metric">{labelFor(row.key)}</div>
              <div className={`rmx__value rmx__value--current rmx__value--${row.colour}`}>
                <span className="rmx__mini">{METRICS.headers.current}</span>
                {row.current}
              </div>
              <div className="rmx__value rmx__value--goal">
                <span className="rmx__mini">{METRICS.headers.goal}</span>
                {row.goal}
              </div>
            </div>
          ))}
        </div>

        {/* 🔴🟡🟢 key — always shown (Yemi comment #5; the "only if red"
            gate in comment #6 starts on the section BELOW this key). */}
        <ul className="rmx__key">
          {METRICS.key.map((k) => (
            <li key={k.state}>
              <span
                className={`rmx__key-dot rmx__key-dot--${k.state}`}
                aria-hidden="true"
              />
              {k.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
