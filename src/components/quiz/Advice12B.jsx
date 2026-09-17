import { useLayoutEffect, useRef, useState } from 'react';
import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep from '../primitives/HighlightSweep.jsx';
import useLeftAlignOnWrap from '../primitives/useLeftAlignOnWrap.js';
import './QuizScreen.css';
import './Advice12A.css';

/**
 * Advice slide 12B ("revenue plateau" answer on Q12) — same fixed
 * blue-family layout as 12A (shared a12__ classes). Placeholders for
 * now per instruction: the 12A infographic image and the 12A icons,
 * to be swapped when the 12B assets arrive.
 */
export default function Advice12B({ onBack, onContinue }) {
  const firstRef = useRef(null);
  const [continuous, setContinuous] = useState(false);
  const [headRef, headLeft] = useLeftAlignOnWrap(3);
  const [midRef, midLeft] = useLeftAlignOnWrap(3);

  // the CTA head keeps its forced break only while the first sentence
  // fits on one line; once it wraps, the whole heading flows continuous
  useLayoutEffect(() => {
    const el = firstRef.current;
    if (!el) return undefined;
    const measure = () => {
      const tops = [...el.getClientRects()].map((r) => r.top).sort((a, b) => a - b);
      let lines = tops.length ? 1 : 0;
      for (let i = 1; i < tops.length; i += 1) {
        if (tops[i] - tops[i - 1] > 10) lines += 1;
      }
      setContinuous(lines >= 2);
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="a12 a12--b">
      {/* ---------- dark top ---------- */}
      <section className="a12__top">
        <SeamBadge src="/assets/circle-doodle-2.png" />
        <div className="question-panel__top">
          <div className="question-panel__logo-box">
            <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
          </div>
          <span className="question-panel__top-line" aria-hidden="true" />
        </div>

        <div className="a12__frame">
          <div className="a12__back">
            <BackLink onBack={onBack} />
          </div>
          <h1
            ref={headRef}
            className={`a12__headline${headLeft ? ' a12__headline--left' : ''}`}
          >
            {'Revenue has '}
            <HighlightSweep tone="iceblue">plateaued</HighlightSweep>
            {" even though your traffic hasn't slowed down."}
          </h1>
          <p
            className={`a12__subline${headLeft ? ' a12__headline--left' : ''}`}
          >
            Revenue Plateaus → Revenue Compounds
          </p>
          <div className="a12__frame-cta">
            <button
              type="button"
              className="q-btn q-btn--onDark a12__frame-continue"
              onClick={onContinue}
            >
              Continue
            </button>
          </div>

          <div className="a12__info-card a12__info-card--top">
            <img
              className="a12__info-img"
              src="/assets/advice-12b-infographic.webp"
              alt="Customer feedback loop engine: day-10 buyers, non-buyers, and existing buyers feeding optimised sequences and offers"
            />
          </div>
        </div>
      </section>

      {/* ---------- ice-blue body ---------- */}
      <section className="a12__body">
        <div className="a12__info-card a12__info-card--body">
          <img
            className="a12__info-img"
            src="/assets/advice-12b-infographic.webp"
            alt="Customer feedback loop engine: day-10 buyers, non-buyers, and existing buyers feeding optimised sequences and offers"
          />
        </div>


        <h2
          ref={midRef}
          className={`a12__mid-head${midLeft ? ' a12__headline--left' : ''}`}
        >
          {'Three levers '}
          <HighlightSweep tone="navy">break a plateau</HighlightSweep>
          {' without adding a single new visitor:'}
        </h2>

        <div className="a12__cards">
          <div className="a12__card a12__card--lavender">
            <span className="a12__icon">
              <img src="/assets/icon-12b-hourglass.svg" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">
              Are more people buying in the first 10 days?
            </h3>
            <p className="a12__card-text">
              {"Every 100 people who are considering buying from you can give you feedback on why they bought or didn't."}
            </p>
            <p className="a12__card-text">
              Use that to scale from converting 1 in 100 to 5 in 100 by
              optimising messaging and positioning consistently.
            </p>
          </div>

          <div className="a12__card a12__card--plum">
            <span className="a12__icon">
              <img src="/assets/icon-12b-envelope.svg" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">
              Are you nurturing non-buyers differently from buyers?
            </h3>
            <p className="a12__card-text">
              Non-buyers have unresolved objections. A personalised 5-email
              objection sequence can close harder than dumping everyone on
              the same list.
            </p>
          </div>

          <div className="a12__card a12__card--navy">
            <span className="a12__icon">
              <img src="/assets/icon-12b-bag.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">
              Are you going back to your existing buyers?
            </h3>
            <p className="a12__card-text">
              {"The easiest revenue you'll ever make is from someone who already bought. Repeat purchases, upsells, cross-sells, affiliate campaigns, seasonal sales all of it becomes possible when zero-party data tells you what they actually want next instead of you guessing."}
            </p>
          </div>
        </div>

      </section>

      {/* ---------- Your Turn CTA (case-study language) ---------- */}
      <section className="a12__cta">
        <img
          className="a12__turn"
          src="/assets/your-turn-doodle-navy.png"
          alt=""
          aria-hidden="true"
        />
        <div className="a12__cta-frame">
          <div className="a12__cta-card">
            <h2 className="a12__cta-head">
              <span ref={firstRef}>
                {"Believe it or not, you don't have a "}
                <HighlightSweep tone="navy">traffic problem</HighlightSweep>
                {'.'}
              </span>
              <span className={continuous ? undefined : 'a12__cta-line'}>
                {(continuous ? ' ' : '') +
                  "You've probably filled enough of Zuckerberg's pockets already. What you need is a system that compounds revenue from the traffic you're already paying for."}
              </span>
            </h2>
            <img
              className="a12__cta-arrow"
              src="/assets/curve-white-arrow.png"
              alt=""
              aria-hidden="true"
            />
            <div className="a12__cta-row">
              <button type="button" className="q-btn" onClick={onContinue}>
                Continue
              </button>
            </div>
          </div>
          <div className="a12__footer" aria-hidden="true">
            <div className="a12__footer-hint" />
            <div className="a12__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
