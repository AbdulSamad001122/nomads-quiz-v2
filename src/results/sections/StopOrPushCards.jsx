import { useLayoutEffect, useRef } from 'react';
import { STOP_OR_PUSH_NEW } from '../copy.js';
import { fill } from '../resolveTokens.js';
import HighlightSweep from '../../components/primitives/HighlightSweep.jsx';
import './StopOrPushCards.css';

/* the check-circle in the green "per visitor" boxes (her design) */
function Tick() {
  return (
    <svg className="rsn__tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="12" />
      <path d="M6.8 12.4l3.4 3.4 7-7.2" />
    </svg>
  );
}

/**
 * 2.0 FINAL RP QC #4 (Alefiya, Nov 4, doc row 5 + image 04): the simpler
 * "You can stop at $1.5M. Or push all 5 metrics to their max." — two cards
 * joined by "Buuuuuut…", her words and layout, brand colours. "Keep the copy
 * and the visuals this simple. The current version feels really overwhelming
 * because there's a lot of microcopy there."
 * #5 (doc row 6, image 05): her simpler bars under the cards — "highlight
 * imp part in headline - but keep it clean and easy like this".
 *
 * DRAFT: shown under the current section so the two can be compared
 * (user, Nov 6); the old cards are removed once this one is approved. The
 * bars below the cards (#5) are not part of this change.
 */
/* bar figures: inside the bar (right-aligned) when it fits, else just past
   the bar, else on their own line under it (small phones). Measured. */
function placeBars(root) {
  root.querySelectorAll('.rsn__tr').forEach((tr) => {
    const fill = tr.querySelector('.rsn__fill');
    const val = tr.querySelector('.rsn__val');
    val.classList.remove('rsn__val--out', 'rsn__val--below');
    tr.classList.remove('rsn__tr--below');
    const trackW = tr.clientWidth;
    const fillW = fill.offsetWidth;
    const w = val.offsetWidth;
    let mode = 'in';
    if (w + 24 > fillW) mode = w + fillW + 20 <= trackW ? 'out' : 'below';
    val.classList.toggle('rsn__val--out', mode === 'out');
    val.classList.toggle('rsn__val--below', mode === 'below');
    tr.classList.toggle('rsn__tr--below', mode === 'below');
    val.style.left = mode === 'out' ? `${fillW + 14}px` : '';
    val.style.right = mode === 'in' ? `${trackW - fillW + 12}px` : '';
  });
}

export default function StopOrPushCards({ result, tokens }) {
  const c = STOP_OR_PUSH_NEW;
  const t = (s) => fill(s, tokens);
  const rightBig = t(c.rightBig);

  // #5: today / +$1.5M / max drawn to scale (same maths as the old bars)
  const today = result.currentAnnualRevenue;
  const goal = today + 1_500_000;
  const max = Math.max(result.capped.maxRevenue, goal);
  const pct = (v) => Math.max(4, Math.min(100, (v / max) * 100));
  const rows = [
    { key: 'today', label: c.rowToday, rpv: tokens.current_rpv, total: tokens.current_total, chip: null, w: pct(today) },
    { key: 'goal', label: c.rowGoal, rpv: tokens.goal_rpv, total: tokens.goal_total, chip: tokens.rpv_multiple, w: pct(goal) },
    { key: 'max', label: c.rowMax, rpv: tokens.max_rpv, total: tokens.max_total, chip: tokens.max_multiple, w: 100 },
  ];
  const barsRef = useRef(null);
  useLayoutEffect(() => {
    const el = barsRef.current;
    if (!el) return undefined;
    const place = () => placeBars(el);
    place();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(place) : null;
    ro?.observe(el);
    document.fonts?.ready?.then(place);
    return () => ro?.disconnect();
  }, [tokens]);

  return (
    <section className="rsn" aria-label={`${c.head1Before} ${c.head1Hl} ${c.head2}`}>
      <div className="rsn__inner">
        <h2 className="rsn__headline">
          <span className="rsn__line">
            {c.head1Before}{' '}
            <HighlightSweep tone="iceblue" className="rsn__hl">
              {c.head1Hl}
            </HighlightSweep>
          </span>
          <span className="rsn__line">{c.head2}</span>
        </h2>

        <div className="rsn__steps">
          <div className="rsn__card rsn__card--stop">
            <p className="rsn__say">{c.leftIntro}</p>
            <div className="rsn__pair">
              <span className="rsn__box rsn__box--now">
                <b>{tokens.current_rpv}</b>
                <small>{c.perVisitor}</small>
              </span>
              <span className="rsn__to">{c.leftTo}</span>
            </div>
            <span className="rsn__box rsn__box--goal">
              <b>
                <Tick />
                {tokens.goal_rpv}
              </b>
              <small>{c.perVisitor}</small>
            </span>
            <p className="rsn__say">{c.leftAdd}</p>
            {/* each big figure is as large as its card allows (its length) */}
            <p className="rsn__big" style={{ '--rsn-len': c.leftBig.length }}>
              {c.leftBig}
              <small>{c.perYear}</small>
            </p>
            <hr className="rsn__rule" />
            <p className="rsn__p">
              {c.leftMonthBefore} <b>{c.leftMonthBold}</b> {c.leftMonthAfter}
            </p>
            <p className="rsn__p rsn__nope">
              <mark>{c.leftNope}</mark>
            </p>
          </div>

          <div className="rsn__but">
            <svg className="rsn__arrow" viewBox="0 0 48 32" aria-hidden="true" focusable="false">
              <path d="M4 16h36M27 5l13 11-13 11" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>{c.but}</p>
          </div>

          <div className="rsn__card rsn__card--max">
            <p className="rsn__say">{c.rightIntro}</p>
            <span className="rsn__box rsn__box--goal rsn__box--max">
              <b>
                <Tick />
                {tokens.max_rpv}
              </b>
              <small>{c.perVisitor}</small>
            </span>
            <p className="rsn__say">{c.rightAdd}</p>
            <p className="rsn__big rsn__big--max" style={{ '--rsn-len': rightBig.length }}>
              {rightBig}
              <small>{c.perYear}</small>
            </p>
            <hr className="rsn__rule" />
            {/* no multiple to show (max barely above today): no empty line */}
            {tokens.max_multiple && <p className="rsn__times">{t(c.rightTimes)}</p>}
            <span className="rsn__yep">{c.yep}</span>
          </div>
        </div>

        {/* #5 (doc row 6, image 05): her bars, under the two cards */}
        <div className="rsn__bars" ref={barsRef}>
          <h3 className="rsn__bars-head">
            {c.barsHeadBefore}{' '}
            <HighlightSweep tone="iceblue" className="rsn__hl rsn__hl--bars">
              {c.barsHeadHl}
            </HighlightSweep>
            {c.barsHeadAfter}
          </h3>
          {rows.map((r) => (
            <div key={r.key} className={`rsn__row rsn__row--${r.key}`}>
              <div className="rsn__lab">
                <b>{r.label}</b>
                <small>{fill(c.rowSub, { rpv: r.rpv })}</small>
              </div>
              <div className="rsn__tr">
                <div className="rsn__fill" style={{ width: `${r.w}%` }} />
                <span className="rsn__val">
                  {fill(c.rowVal, { total: r.total })}
                  {r.chip && <i>{fill(c.rowChip, { x: r.chip })}</i>}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
