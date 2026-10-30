import { useLayoutEffect, useRef } from 'react';
import { STOP_OR_PUSH, CTA } from '../copy.js';
import { fill } from '../resolveTokens.js';
import HighlightSweep from '../../components/primitives/HighlightSweep.jsx';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './StopOrPush.css';

/* Ladder value labels: measured, not guessed. Each label sits just past
   its bar when there is room, else inside the bar (dark, right-aligned);
   only if neither fits does it drop its "× today" chip. Re-runs on resize
   and once fonts load. Pure presentation, so it works on the DOM. */
function placeLabels(ladder) {
  ladder.querySelectorAll('.rso__tr').forEach((tr) => {
    const fill = tr.querySelector('.rso__fill');
    const val = tr.querySelector('.rso__val');
    const chip = val.querySelector('i');
    val.classList.remove('rso__val--inside', 'rso__val--nochip');
    const trackW = tr.clientWidth;
    const fillW = fill.offsetWidth;
    const labelW = val.offsetWidth;
    const chipW = chip ? chip.offsetWidth + 8 : 0;
    const outSpace = trackW - fillW - 16;
    const inSpace = fillW - 24;
    let inside = false;
    let nochip = false;
    if (labelW <= outSpace) inside = false;
    else if (labelW <= inSpace) inside = true;
    else if (labelW - chipW <= outSpace) nochip = true;
    else {
      inside = true;
      nochip = true;
    }
    val.classList.toggle('rso__val--inside', inside);
    val.classList.toggle('rso__val--nochip', nochip);
    val.style.left = inside ? '' : `${fillW + 10}px`;
    // inside: right-aligned to the end of ITS fill (the CSS right: 12px
    // alone would pin it to the end of the track, off a short fill)
    val.style.right = inside ? `${trackW - fillW + 12}px` : '';
  });
}

/**
 * "You can stop at $1.5M. Or push all 5 metrics to their max." — QC row 5
 * (Oct 2026), rebuilt to Alefiya's "RPV Max Upside Section" design: one
 * navy section with one message (design note 1). The smaller "stop here"
 * card (+$1.5M) and the big "go all the way" card (the max, capped at 12×
 * today — calculator.js), joined by "But… what if you did?"; today / goal /
 * max drawn to scale as bars; the scepticism block (only when the 12× cap
 * bites); the workshop note + button. The old "But… what if you did?"
 * section's headline moved in here; its GolfBays card stays in
 * WhatIfYouDid (QC row 6).
 *
 * ResultsPage renders this only for non-capped takers: capped takers
 * (Blocks 5–7, which now include a goal beyond 12× today) read their capped
 * card instead — "blocks 5, 6, and 7 in the logic doc has the copy to
 * replace the 'push metrics to their max' section" (Added Logic.docx).
 */
export default function StopOrPush({ result, tokens }) {
  const c = STOP_OR_PUSH;
  const t = (s) => fill(s, tokens);
  const btnWords = c.button.split(' ');
  const btnLast = btnWords.pop();
  const btnHead = btnWords.join(' ');

  const ladderRef = useRef(null);
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
  const max = Math.max(result.capped.maxRPV * result.annualVisitors, goal);
  const pct = (v) => Math.max(1.5, Math.min(100, (v / max) * 100));
  const rows = [
    { key: 'today', label: c.rowToday, sub: t(c.rowTodaySub), val: t(c.rowTodayVal), chip: null, w: pct(today) },
    { key: 'goal', label: c.rowGoal, sub: t(c.rowGoalSub), val: t(c.rowGoalVal), chip: tokens.rpv_multiple ? t(c.rowGoalChip) : null, w: pct(goal) },
    {
      key: 'max',
      label: c.rowMax,
      sub: t(result.capped.maxCappedAt12 ? c.rowMaxSubCapped : c.rowMaxSub),
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

        <div className="rso__steps">
          <div className="rso__card rso__card--stop">
            <span className="rso__eyebrow">{c.stopEyebrow}</span>
            <p className="rso__rpv">
              {c.stopRpvBefore}{' '}
              <b>
                <span className="rso__from">{tokens.current_rpv}</span> →{' '}
                <span className="rso__to">{tokens.goal_rpv}</span>
              </b>
            </p>
            <p className="rso__big">
              {c.stopBig}
              <small>{c.stopBigSub}</small>
            </p>
            <p className="rso__p">{emphasize(c.stopBody, [c.stopBodyBold])}</p>
            <p className="rso__p rso__nope">{c.stopNope}</p>
          </div>

          <p className="rso__but">
            <span>{c.but}</span>
            <b aria-hidden="true">→</b>
          </p>

          <div className="rso__card rso__card--max">
            <span className="rso__eyebrow">{c.maxEyebrow}</span>
            <p className="rso__if">{emphasize(c.maxIf, [c.maxIfBold])}</p>
            <span className="rso__lead">{c.maxLead}</span>
            <p className="rso__mega">
              {t(c.maxMega)}
              <small>{c.maxMegaSub}</small>
            </p>
            <div className="rso__row">
              <span className="rso__x">
                {t(c.maxTotal.split('{{max_multiple}}')[0])}
                <b className="rso__x-mult">{tokens.max_multiple}</b>
                {t(c.maxTotal.split('{{max_multiple}}')[1] || '')}
              </span>
              <span className="rso__yep">{c.maxYep}</span>
            </div>
          </div>
        </div>

        <div className="rso__ladder" ref={ladderRef}>
          <h3 className="rso__ladder-head">{c.ladderHead}</h3>
          <p className="rso__ladder-sub">{c.ladderSub}</p>
          {rows.map((r) => (
            <div key={r.key} className={`rso__lr rso__lr--${r.key}`}>
              <div className="rso__l">
                {r.label}
                <small>{r.sub}</small>
              </div>
              <div className="rso__tr">
                <div className="rso__fill" style={{ width: `${r.w}%` }} />
                <span className="rso__val">
                  {r.val}
                  {r.chip && <i>{r.chip}</i>}
                </span>
              </div>
            </div>
          ))}
        </div>

        {result.capped.maxCappedAt12 && (
          <div className="rso__real">
            <div>
              <div className="rso__who">
                <img src="/assets/results-alefiya-headshot.webp" alt={c.whoName} width="192" height="192" />
                <div>
                  <b>{c.whoName}</b>
                  <small>{c.whoRole}</small>
                </div>
              </div>
              <span className="rso__eyebrow rso__eyebrow--rose">{c.realEyebrow}</span>
              <h3 className="rso__real-head">{c.realHead}</h3>
              <p className="rso__real-p">{c.realP1}</p>
              <p className="rso__real-p">{emphasize(c.realP2, [c.realP2Bold])}</p>
            </div>
            <div className="rso__stairs" role="img" aria-label={c.stairsLabel}>
              {c.stairs.map((s, i) => (
                <div key={s.x} className={`rso__st rso__st--${i}`}>
                  {i === 0 && <span className="rso__st-lab">{s.x}</span>}
                  <div className="rso__blk">{i === 0 ? null : s.x}</div>
                  <span className="rso__cap">{s.cap}</span>
                </div>
              ))}
            </div>
            <p className="rso__proof-head">{c.proofHead}</p>
            <div className="rso__proof">
              {c.proof.map((p) => (
                <div key={p.name} className="rso__pc">
                  <b>{p.name}</b>
                  <span>{p.big}</span>
                  <small>{p.small}</small>
                </div>
              ))}
            </div>
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
