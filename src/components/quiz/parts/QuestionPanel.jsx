/**
 * Left panel (v2 design):
 * - keyline across the top with the white logo box hanging under it
 * - step-number badge, Roboto Mono label strip, question headline
 * - curve-arrows doodle pinned to the right end of the question's
 *   FIRST rendered text line (measured, re-measured on resize)
 * - footer strip: "Pick what fits best." in Moontime + double arrows,
 *   compass icon in the corner cell
 */
import { useLayoutEffect, useRef, useState } from 'react';
import SeamBadge from './SeamBadge.jsx';
import BackLink from './BackLink.jsx';

function useFirstLineEnd(deps) {
  const wrapRef = useRef(null);
  const questionRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      const q = questionRef.current;
      if (!wrap || !q) return;
      const range = document.createRange();
      range.selectNodeContents(q);
      const rects = [...range.getClientRects()].filter(
        (r) => r.width > 0 && r.height > 0
      );
      if (!rects.length) return;
      const firstTop = Math.min(...rects.map((r) => r.top));
      const firstLine = rects.filter(
        (r) => Math.abs(r.top - firstTop) < r.height * 0.6
      );
      const lineRight = Math.max(...firstLine.map((r) => r.right));
      const wrapRect = wrap.getBoundingClientRect();
      setPos({
        left: Math.min(lineRight - wrapRect.left + 8, wrapRect.width - 40),
        top: firstTop - wrapRect.top,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (questionRef.current) ro.observe(questionRef.current);
    window.addEventListener('resize', measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { wrapRef, questionRef, pos };
}

export default function QuestionPanel({ stepNumber, label, question, subline, onBack }) {
  const { wrapRef, questionRef, pos } = useFirstLineEnd([question]);

  return (
    <section className="question-panel">
      <SeamBadge />
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
          <div className="question-panel__content">
            <span className="question-panel__step" aria-hidden="true">
              {stepNumber}
            </span>
            {label ? (
              <span className="question-panel__label">{label}</span>
            ) : null}
            <div className="question-panel__question-wrap" ref={wrapRef}>
              <img
                className="question-panel__curve-arrows"
                src="/assets/curve-arrows.png"
                alt=""
                aria-hidden="true"
                style={
                  pos ? { left: `${pos.left}px`, top: `${pos.top}px` } : undefined
                }
              />
              <h1 className="question-panel__question" ref={questionRef}>
                {question}
              </h1>
            </div>
            {subline ? (
              <p className="question-panel__subline">{subline}</p>
            ) : null}
          </div>
        </div>
        <div className="question-panel__footer">
          <div className="question-panel__footer-hint" aria-hidden="true">
            <span className="question-panel__hint-text">
              Pick what fits best.
            </span>
            <img
              className="question-panel__hint-arrows"
              src="/assets/double-arrows.png"
              alt=""
            />
          </div>
          <div className="question-panel__footer-cell">
            <img src="/assets/nomads-icon.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
