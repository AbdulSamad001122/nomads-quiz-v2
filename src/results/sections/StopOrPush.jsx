import { useEffect, useLayoutEffect, useState } from 'react';
import { STOP_OR_PUSH, CTA } from '../copy.js';
import { fill } from '../resolveTokens.js';
import HighlightSweep from '../../components/primitives/HighlightSweep.jsx';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import useInView from '../../hooks/useInView.js';
import './StopOrPush.css';

/* Grow-in timing (ms): each bar fills over GROW, the next starts STAGGER
   later; the big max figure counts over MEGA. */
const GROW = 1100;
const STAGGER = 250;
const MEGA = 1300;
// ease-out cubic, the same curve as the bars' CSS cubic-bezier(0.33, 1, 0.68, 1)
const easeOut = (k) => 1 - (1 - k) ** 3;
const NUM = /\d[\d,]*(?:\.\d+)?/;

function countText(text, m, k) {
  const raw = m[0];
  const dec = (raw.split('.')[1] || '').length;
  const v = parseFloat(raw.replace(/,/g, '')) * easeOut(k);
  const s = raw.includes(',')
    ? v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
    : v.toFixed(dec);
  return text.slice(0, m.index) + s + text.slice(m.index + raw.length);
}

/* Counts the first number in `text` up from 0 once `run` turns true, with
   the same prefix, suffix and decimals all the way ("~$0.00M/year" →
   "~$1.77M/year"). The finished text stays in the flow (transparent, still
   read by screen readers) so the width never moves and placeLabels always
   measures the final label; the counting copy sits on top of it. */
function CountUp({ text, animate, run, delay = 0, duration }) {
  const m = NUM.exec(text);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!animate || !run || !m) return undefined;
    let raf;
    let start;
    const tick = (now) => {
      start ??= now;
      const next = Math.min(1, Math.max(0, (now - start - delay) / duration));
      setK(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, run, text, delay, duration]);
  if (!animate || !m || k >= 1) return text;
  return (
    <span className="rso__count">
      <span className="rso__count-end">{text}</span>
      <span className="rso__count-run" aria-hidden="true">
        {countText(text, m, k)}
      </span>
    </span>
  );
}

/* the check-circle in the green "per visitor" boxes (her design) */
function Tick() {
  return (
    <svg className="rso__tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="12" />
      <path d="M6.8 12.4l3.4 3.4 7-7.2" />
    </svg>
  );
}

/* Ladder value labels: measured, not guessed. Each label sits just past
   its bar when there is room, else inside the bar (dark, right-aligned);
   only if neither fits does it drop its "× today" chip. Re-runs on resize
   and once fonts load. Pure presentation, so it works on the DOM. */
function placeLabels(ladder) {
  ladder.querySelectorAll('.rso__tr').forEach((tr) => {
    const fill = tr.querySelector('.rso__fill');
    const val = tr.querySelector('.rso__val');
    const chip = val.querySelector('i');
    val.classList.remove('rso__val--inside', 'rso__val--nochip', 'rso__val--below');
    tr.classList.remove('rso__tr--below');
    const trackW = tr.clientWidth;
    const fillW = fill.offsetWidth;
    const labelW = val.offsetWidth;
    const chipW = chip ? chip.offsetWidth + 10 : 0;
    const outSpace = trackW - fillW - 16;
    const inSpace = fillW - 24;
    let inside = false;
    let nochip = false;
    let below = false;
    if (labelW <= outSpace) inside = false;
    else if (labelW <= inSpace) inside = true;
    else if (labelW - chipW <= outSpace) nochip = true;
    else if (labelW - chipW <= inSpace) {
      inside = true;
      nochip = true;
    } else below = true; // fits nowhere on the bar (small phones): its own line under it
    val.classList.toggle('rso__val--inside', inside);
    val.classList.toggle('rso__val--nochip', nochip);
    val.classList.toggle('rso__val--below', below);
    tr.classList.toggle('rso__tr--below', below);
    val.style.left = inside || below ? '' : `${fillW + 10}px`;
    // inside: right-aligned to the end of ITS fill (the CSS right: 12px
    // alone would pin it to the end of the track, off a short fill)
    val.style.right = inside && !below ? `${trackW - fillW + 12}px` : '';
  });
}

/**
 * "You can stop at $1.5M. Or push all 5 metrics to their max." — QC row 5
 * (Oct 2026), rebuilt to Alefiya's "RPV Max Upside Section" design: one
 * navy section with one message (design note 1). The smaller "stop here"
 * card (+$1.5M) and the big "go all the way" card (the max — the lower of
 * the revenue band's multiple and the metric max, Cap Logic Nov 4,
 * calculator.js), joined by "But… what if you did?"; today / goal / max
 * drawn to scale as bars; the scepticism block (only when the max is beyond
 * 3× today); the workshop note + button. The old "But… what if you did?"
 * section's headline moved in here; its GolfBays card stays in
 * WhatIfYouDid (QC row 6). Motion (user, Oct 30; not in the design): the
 * bars grow in and their figures count up once seen, and so does the big
 * max figure.
 *
 * ResultsPage renders this only for non-capped takers: capped takers
 * (Blocks 5–7, which include a max that isn't above the goal) read their
 * capped card instead — Cap Logic step 7: "hide this section and show
 * blocks 5, 6, and 7 instead".
 */

export default function StopOrPush({ result, tokens }) {
  const c = STOP_OR_PUSH;
  const t = (s) => fill(s, tokens);
  const btnWords = c.button.split(' ');
  const btnLast = btnWords.pop();
  const btnHead = btnWords.join(' ');

  // Bars grow in and figures count up once seen, unless the device asks
  // for reduced motion (then everything is simply there, as before).
  const [motion] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  const [ladderRef, ladderIn] = useInView({ threshold: 0.35 });
  const [maxRef, maxIn] = useInView({ threshold: 0.5 });
  useLayoutEffect(() => {
    const el = ladderRef.current;
    if (!el) return undefined;
    const place = () => placeLabels(el);
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    document.fonts?.ready?.then(place);
    return () => ro.disconnect();
  }, [tokens]);

  const today = result.currentAnnualRevenue;
  const goal = today + 1_500_000;
  const max = Math.max(result.capped.maxRevenue, goal);
  const pct = (v) => Math.max(1.5, Math.min(100, (v / max) * 100));
  const rows = [
    { key: 'today', label: c.rowToday, sub: t(c.rowTodaySub), val: t(c.rowTodayVal), chip: null, w: pct(today) },
    { key: 'goal', label: c.rowGoal, sub: t(c.rowGoalSub), val: t(c.rowGoalVal), chip: tokens.rpv_multiple ? t(c.rowGoalChip) : null, w: pct(goal) },
    {
      key: 'max',
      label: c.rowMax,
      sub: t(c.rowMaxSub),
      val: t(c.rowMaxVal),
      chip: tokens.max_multiple ? t(c.rowMaxChip) : null,
      w: 100,
    },
  ];

  return (
    <section className="rso">
      <div className="rso__inner">
        <h2 className="rso__headline">
          <span className="rso__line">
            {c.head1Before}{' '}
            {/* the full stop sits inside the highlight too (user, Oct 30) */}
            <HighlightSweep tone="iceblue" className="rso__hl-stop">
              {c.head1Hl}
              {c.head1After}
            </HighlightSweep>
          </span>
          <span className="rso__line">
            {c.head2Before} <span className="rso__hl-max">{c.head2Hl}</span>
            {c.head2After}
          </span>
        </h2>

        {/* 2.0 FINAL RP QC: her new two-card design (image 04) */}
        <div className="rso__steps">
          <div className="rso__card rso__card--stop">
            <p className="rso__say">{c.leftIntro}</p>
            <div className="rso__pair">
              <span className="rso__rpvbox rso__rpvbox--now">
                <b>{tokens.current_rpv}</b>
                <small>{c.perVisitor}</small>
              </span>
              <span className="rso__to-word">{c.leftTo}</span>
            </div>
            <span className="rso__rpvbox rso__rpvbox--goal">
              <b>
                <Tick />
                {tokens.goal_rpv}
              </b>
              <small>{c.perVisitor}</small>
            </span>
            <p className="rso__say">{c.leftAdd}</p>
            <p className="rso__big">
              {c.stopBig}
              <small>{c.stopBigSub}</small>
            </p>
            <hr className="rso__rule" />
            <p className="rso__p">
              {c.leftMonthBefore} <b>{c.leftMonthBold}</b> {c.leftMonthAfter}
            </p>
            <p className="rso__p rso__nope">
              <mark>{c.stopNope}</mark>
            </p>
          </div>

          <div className="rso__but">
            <b aria-hidden="true">→</b>
            <p>{c.but}</p>
          </div>

          <div className="rso__card rso__card--max" ref={maxRef}>
            <p className="rso__say">{c.rightIntro}</p>
            <span className="rso__rpvbox rso__rpvbox--goal rso__rpvbox--max">
              <b>
                <Tick />
                {tokens.max_rpv}
              </b>
              <small>{c.perVisitor}</small>
            </span>
            <p className="rso__say">{c.rightAdd}</p>
            <p className="rso__mega">
              <CountUp text={t(c.maxMega)} animate={motion} run={maxIn} duration={MEGA} />
              <small>{c.maxMegaSub}</small>
            </p>
            <hr className="rso__rule" />
            <p className="rso__times">{t(c.maxTimes)}</p>
            <span className="rso__yep">{c.maxYep}</span>
          </div>
        </div>

        {/* her new bars block (image 05) */}
        <div
          className={`rso__ladder${motion ? ' rso__ladder--anim' : ''}${ladderIn ? ' rso__ladder--in' : ''}`}
          style={{ '--rso-grow': `${GROW}ms` }}
          ref={ladderRef}
        >
          <h3 className="rso__ladder-head">
            {c.barsHeadBefore} <mark>{c.barsHeadHl}</mark>
            {c.barsHeadAfter}
          </h3>
          {rows.map((r, i) => (
            <div key={r.key} className={`rso__lr rso__lr--${r.key}`} style={{ '--rso-delay': `${i * STAGGER}ms` }}>
              <div className="rso__l">
                {r.label}
                <small>{r.sub}</small>
              </div>
              <div className="rso__tr">
                <div className="rso__fill" style={{ width: `${r.w}%` }} />
                <span className="rso__val">
                  <CountUp text={r.val} animate={motion} run={ladderIn} delay={i * STAGGER} duration={GROW} />
                  {r.chip && <i>{r.chip}</i>}
                </span>
              </div>
            </div>
          ))}
        </div>

        {result.capped.showStretch && (
          <div className="rso__real">
            <div>
              <div className="rso__who">
                <img src="/assets/results-alefiya-headshot.webp" alt={c.whoName} width="192" height="192" />
                <div>
                  <b>{c.whoName}</b>
                  <small>{c.whoRole}</small>
                </div>
              </div>
              <span className="rso__eyebrow rso__eyebrow--chip">{c.realEyebrow}</span>
              <h3 className="rso__real-head">{c.realHead}</h3>
              <p className="rso__real-p">{c.realP1}</p>
              <p className="rso__real-p">{emphasize(c.realP2, [c.realP2Bold])}</p>
            </div>
            {/* bars and captions in two rows, so every bar stands on the same
                baseline however long its caption wraps (user, Oct 30) */}
            <div className="rso__stairs" role="img" aria-label={c.stairsLabel}>
              <div className="rso__stairs-row rso__stairs-row--bars">
                {c.stairs.map((s, i) => (
                  <div key={s.x} className={`rso__st rso__st--${i}`}>
                    {i === 0 && <span className="rso__st-lab">{s.x}</span>}
                    <div className="rso__blk">{i === 0 ? null : s.x}</div>
                  </div>
                ))}
              </div>
              <div className="rso__stairs-row">
                {c.stairs.map((s, i) => (
                  <span key={s.x} className={`rso__cap rso__cap--${i}`}>
                    {s.cap}
                  </span>
                ))}
              </div>
            </div>
            {/* the "We've done 12× and more" Video Mastermind card moved
                out into its own case-study section, CreativeDelivery.jsx
                (user, Nov 2) */}
          </div>
        )}

        <div className="rso__next">
          <p>{c.next}</p>
          {/* TODO: real workshop URL — the "Watch the Workshop" page (QC item 8) */}
          <a className="rso__btn" href={CTA.workshop.href} {...(CTA.workshop.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : null)} onClick={() => ga.ctaClick(CTA.workshop.id)}>
            {/* the arrow hugs the last word, so it never strands alone */}
            <span>
              {btnHead}{' '}
              <span className="rso__nowrap">
                {btnLast}
                <span aria-hidden="true">{' '}→</span>
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
