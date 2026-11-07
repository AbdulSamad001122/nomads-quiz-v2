import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RPS_CARDS } from '../copy.js';
import { CEILINGS } from '../../calc/calculator.js';
import { fill } from '../resolveTokens.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './CompoundingRps.css';

const CEILING = 50; // the $50 Revenue Per Subscriber™ benchmark (calculator CEILINGS.rps)
const PIN_ROOM = 8; // px of clear space two neighbouring pin labels keep

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * The revenue-per-subscriber part — QC row 7 (Oct 2026), Alefiya's
 * "Compounding RPS Cards" design: one navy section, one message, five cards
 * left to right (arrows, dots, swipe and ←/→ move through them; the next
 * card always peeks in), then the calculator with a looping preview of its
 * two real fields. Replaces BeyondFourteenDays + CompoundingIntro +
 * CrpsCalculatorCta.
 *
 * Card 1 and the headline use the taker's own Revenue Per Subscriber™ (today
 * → goal); card 5 their Revenue Per Visitor™. Takers for whom that story
 * isn't true get the parts that are (see RPS_CARDS notes in copy.js).
 */
export default function CompoundingRps({ result, tokens }) {
  const c = RPS_CARDS;
  const t = (s) => fill(s, tokens);

  const now = result.current.rps;
  const goal = result.goal.rps;
  // the "$X → $Y" story only holds when the goal is reachable and RPS rises
  const lifts = !result.cappedState && tokens.rps_goal !== tokens.rps_now && goal > now;
  const goalAtCeiling = goal >= CEILING - 1e-9;

  const cards = [];
  if (lifts) cards.push('c1');
  cards.push('c2', 'c3', 'c4');
  if (!result.cappedState) cards.push('c5');

  /* ——— carousel (the design's own logic, in React) ——— */
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  const cardEls = () => [...(trackRef.current?.children || [])];
  const indexNow = () => {
    const track = trackRef.current;
    if (!track) return 0;
    let best = 0;
    let d = Infinity;
    cardEls().forEach((el, i) => {
      const dd = Math.abs(el.offsetLeft - track.offsetLeft - track.scrollLeft - 4);
      if (dd < d) {
        d = dd;
        best = i;
      }
    });
    return best;
  };
  const go = (i) => {
    const track = trackRef.current;
    const els = cardEls();
    if (!track || !els.length) return;
    const k = Math.max(0, Math.min(els.length - 1, i));
    track.scrollTo({ left: els[k].offsetLeft - track.offsetLeft - 4, behavior: 'smooth' });
  };
  // The row is as tall as the tallest card on screen, not the tallest card
  // overall, so every card keeps the same gap above what follows (on phones
  // a short card used to leave up to ~280px of empty navy; user, Oct 30).
  const fitHeight = () => {
    const track = trackRef.current;
    if (!track) return;
    const box = track.getBoundingClientRect();
    let h = 0;
    cardEls().forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > box.left + 1 && r.left < box.right - 1) h = Math.max(h, el.offsetHeight);
    });
    if (!h) return;
    const cs = getComputedStyle(track);
    const pad = cs.boxSizing === 'border-box' ? parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) : 0;
    track.style.height = `${Math.ceil(h + pad)}px`;
  };
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    setAtEnd(end);
    setActive(end ? cardEls().length - 1 : indexNow());
    fitHeight();
  }, []);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => window.requestAnimationFrame(sync);
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // a card's height also changes as fonts load or its text rewraps
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScroll) : null;
    cardEls().forEach((el) => ro?.observe(el));
    document.fonts?.ready?.then(onScroll);
    sync();
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro?.disconnect();
    };
  }, [sync]);
  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(indexNow() + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(indexNow() - 1);
    }
  };

  /* ——— card 1 scale pins: $now today · $goal your $1.5M · $50 the goal ——— */
  const pos = (v) => Math.max(0, Math.min(100, (v / CEILING) * 100));
  const pNow = Math.max(2, pos(now));
  const pGoal = pos(goal);
  const pins = goalAtCeiling
    ? [
        { key: 'now', left: pNow, v: tokens.rps_now, l: c.c1PinToday, cls: 'rcs__pin--now' },
        { key: 'end', left: 100, v: '$50', l: c.c1PinGoalEnd, cls: 'rcs__pin--end rcs__pin--endwide' },
      ]
    : [
        { key: 'now', left: pNow, v: tokens.rps_now, l: c.c1PinToday, cls: 'rcs__pin--now' },
        { key: 'goal', left: pGoal, v: tokens.rps_goal, l: c.c1PinGoal, cls: 'rcs__pin--goal' },
        { key: 'end', left: 100, v: '$50', l: c.c1PinEnd, cls: 'rcs__pin--end' },
      ];
  // A pin whose label would touch its right-hand neighbour's drops a row
  // (with a leader line to its dot). Measured from the real label widths at
  // the real scale width, so it holds at every screen size.
  const scaleRef = useRef(null);
  const [low, setLow] = useState([]);
  useLayoutEffect(() => {
    const scale = scaleRef.current;
    if (!scale) return undefined;
    const measure = () => {
      const r = [...scale.querySelectorAll('.rcs__pin')].map((el) => el.getBoundingClientRect());
      const close = (a, b) => a.right + PIN_ROOM > b.left;
      const next = r.map(() => false);
      if (r.length === 3) {
        next[1] = close(r[1], r[2]); // goal under the $50
        next[0] = !next[1] && close(r[0], r[1]); // today under the goal
      } else if (r.length === 2) {
        next[0] = close(r[0], r[1]);
      }
      setLow((prev) => (prev.join() === next.join() ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(scale);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [now, goal, goalAtCeiling]);

  const top = (label, i) => (
    <div className="rcs__top">
      <span>{label}</span>
      <span className="rcs__n">{pad2(i + 1)}</span>
    </div>
  );

  const render = (id, i) => {
    switch (id) {
      case 'c1':
        return (
          <article key={id} className="rcs__card rcs__card--1" style={{ '--r': '-0.6deg' }}>
            {top(c.c1Top, i)}
            <h3 className="rcs__h3">
              {c.c1Before} <span className="rcs__bn rcs__bn--huge rcs__bn--one">{tokens.rps_now}</span> {c.c1Mid}{' '}
              <span className="rcs__bn rcs__bn--huge">{tokens.rps_goal}</span>
              {c.c1End}
            </h3>
            <p className="rcs__p">{emphasize(c.c1Body, [c.c1Bold])}</p>
            <div className="rcs__vis">
              <div ref={scaleRef} className={`rcs__scale${low.some(Boolean) ? ' rcs__scale--tall' : ''}`} role="img" aria-label={t(c.c1ScaleLabel)}>
                <div className="rcs__sc-track">
                  <i className="rcs__sc-fill" style={{ width: `${pGoal}%` }} />
                </div>
                {pins.map((p, k) => (
                  <span key={p.key} className={`rcs__pin ${p.cls}${low[k] ? ' rcs__pin--low' : ''}`} style={{ left: `${p.left}%` }}>
                    <b>{p.v}</b>
                    <small>{p.l}</small>
                  </span>
                ))}
              </div>
            </div>
          </article>
        );
      case 'c2':
        return (
          <article key={id} className="rcs__card rcs__card--2" style={{ '--r': '0.5deg' }}>
            {top(c.c2Top, i)}
            <h3 className="rcs__h3">
              {c.c2Before} <mark>{c.c2Mark}</mark>
              {c.c2After}
            </h3>
            <div className="rcs__vis">
              <div className="rcs__steps" role="img" aria-label={c.c2Label}>
                <div className="rcs__paid">
                  <b>{c.c2Paid}</b>
                  <small>{c.c2PaidSub}</small>
                </div>
                <div className="rcs__cols" aria-hidden="true">
                  {[14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 93, 100].map((h) => (
                    <i key={h} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="rcs__ax" aria-hidden="true">
                <span>{c.c2Month1}</span>
                <span>{c.c2Month12}</span>
              </div>
              <p className="rcs__cap">{c.c2Cap}</p>
            </div>
          </article>
        );
      case 'c3':
        return (
          <article key={id} className="rcs__card rcs__card--3" style={{ '--r': '-0.4deg' }}>
            {top(c.c3Top, i)}
            <h3 className="rcs__h3">
              {c.c3Before} <mark>{c.c3Mark}</mark>
              {c.c3After}
            </h3>
            <div className="rcs__vis rcs__tree">
              <div className="rcs__node rcs__node--1">
                <span className="rcs__when">{c.w1When}</span>
                <span className="rcs__wnum">1</span>
                <b>{c.w1Head}</b>
                <small>{c.w1Body}</small>
              </div>
              <div className="rcs__fork" aria-hidden="true">
                <i className="rcs__fk-s" />
                <i className="rcs__fk-h" />
                <i className="rcs__fk-l" />
                <i className="rcs__fk-r" />
              </div>
              <div className="rcs__pair">
                <div className="rcs__branch">
                  <span className="rcs__tag rcs__tag--yes">{c.tagYes}</span>
                  <div className="rcs__node">
                    <span className="rcs__when">{c.w2When}</span>
                    <span className="rcs__wnum">2</span>
                    <b>{c.w2Head}</b>
                    <small>{c.w2Body}</small>
                  </div>
                </div>
                <div className="rcs__branch">
                  <span className="rcs__tag rcs__tag--no">{c.tagNo}</span>
                  <div className="rcs__node">
                    <span className="rcs__when">{c.w3When}</span>
                    <span className="rcs__wnum">3</span>
                    <b>{c.w3Head}</b>
                    <small>{c.w3Body}</small>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      case 'c4':
        return (
          <article key={id} className="rcs__card rcs__card--4" style={{ '--r': '0.5deg' }}>
            {top(c.c4Top, i)}
            <h3 className="rcs__h3">
              {c.c4Before} <span className="rcs__bn">{c.c4Big}</span> {c.c4After}
            </h3>
            <p className="rcs__p">{c.c4Body}</p>
            <div className="rcs__vis rcs__tiers">
              {c.tiers.map((tr) => (
                <div key={tr.n} className={`rcs__tier${tr.peak ? ' rcs__tier--peak' : ''}`}>
                  <span className="rcs__tl">
                    {tr.at} <b className="rcs__tn">{tr.n}</b> {tr.per}
                  </span>
                  <div className="rcs__tb">
                    <i style={{ width: `${tr.bar}%` }} />
                  </div>
                  <span className="rcs__tv">
                    {tr.value}
                    <small>{tr.valueSub}</small>
                  </span>
                  <small className="rcs__per">
                    {tr.from} <b className="rcs__subs">{tr.subs}</b>
                  </small>
                </div>
              ))}
            </div>
          </article>
        );
      case 'c5':
        return (
          <article key={id} className="rcs__card rcs__card--5" style={{ '--r': '0deg' }}>
            {top(c.c5Top, i)}
            <h3 className="rcs__h3">
              {c.c5Before} <span className="rcs__bn">{c.c5Promise}</span> {c.c5Mid}{' '}
              <span className="rcs__bn rcs__bn--huge rcs__bn--one">{tokens.current_rpv}</span> {c.c5To}{' '}
              <span className="rcs__bn rcs__bn--huge">{tokens.goal_rpv}</span>
              {c.c5End}
            </h3>
            <div className="rcs__vis rcs__up">
              <div className="rcs__row rcs__row--1">
                <span className="rcs__v">{c.c5Row1Value}</span>
                <span className="rcs__l">{c.c5Row1Label}</span>
              </div>
              <div className="rcs__plus" aria-hidden="true">
                +
              </div>
              <div className="rcs__row rcs__row--2">
                <span className="rcs__v">{c.c5Row2Value}</span>
                <span className="rcs__l">
                  {c.c5Row2Before} <b className="rcs__subs rcs__subs--inv">{c.c5Row2Subs}</b> {c.c5Row2After}
                </span>
              </div>
            </div>
          </article>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <section className="rcs">
      <div className="rcs__inner">
        <div className="rcs__head">
          {/* capped takers can't reach $1.5M, so no "Beyond your $1.5M" */}
          {!result.cappedState && <span className="rcs__k">{c.kicker}</span>}
          {lifts ? (
            <h2 className="rcs__h2">
              {c.headBefore} <span className="rcs__hn">{c.headPromise}</span> {c.headMid}{' '}
              <span className="rcs__hn rcs__hn--big">{tokens.rps_goal}</span> {c.headAfter}{' '}
              {/* both sentences always — the design's approved copy, even when
                  the goal is already the $50 ceiling */}
              <em>
                {c.headBut} <span className="rcs__hn rcs__hn--big rcs__hn--alt">{tokens.rps_goal}</span>{' '}
                {c.headEnd}
              </em>
            </h2>
          ) : (
            <h2 className="rcs__h2">{c.headFallback}</h2>
          )}
        </div>

        <div className="rcs__bar">
          <div className="rcs__dots">
            {cards.map((id, i) => (
              <button
                key={id}
                type="button"
                aria-label={`${c.cardLabel} ${i + 1}`}
                className={i === active ? 'rcs__dot--on' : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="rcs__arrows">
            <span>
              {active + 1} / {cards.length}
            </span>
            <button type="button" aria-label={c.prev} disabled={active === 0} onClick={() => go(indexNow() - 1)}>
              ←
            </button>
            <button type="button" aria-label={c.next} disabled={atEnd} onClick={() => go(indexNow() + 1)}>
              →
            </button>
          </div>
        </div>

        <div className="rcs__track" ref={trackRef} tabIndex={0} onKeyDown={onKey}>
          {cards.map(render)}
        </div>

      </div>
    </section>
    {/* the calculator, its own split section under the cards (Alefiya,
        Slack Oct 31: it blended into the navy) */}
    <CalcSection c={c} tokens={tokens} result={result} />
    </>
  );
}

/**
 * The calculator section (Alefiya, 2.0 FINAL RP QC, Nov 4): her design —
 * label, headline and three numbered steps with the button on plain cream;
 * on the dark plum half, TODAY (the taker's own revenue per subscriber, the
 * same figure as card 1) → TARGET $50 and a bar filled to today ÷ $50.
 * Sizes follow her picture's proportions (container units, see the CSS).
 */
function CalcSection({ c, tokens, result }) {
  // the bar and the label read the same rounded figure (review: a raw
  // 0.4 showed "$0" with a dot of bar; 49.6 showed "$50" with a bar short)
  const now = Math.max(0, Math.round(result.current.rps) || 0);
  const pct = Math.min(100, (now / CEILINGS.rps) * 100);
  // already at or past $50: no "→ TARGET $50" (it would point down), just
  // today's figure and a full bar
  const reached = now >= CEILINGS.rps;
  // a long figure ($1667) steps down so it never runs into the arrow
  const len = tokens.rps_now.length;
  // the button's arrow is drawn (her design's heavy arrow), kept with the
  // last word
  const label = c.button.replace(/\s*→$/, '');
  const cut = label.lastIndexOf(' ') + 1;
  return (
    <section className="rcs-calc">
      <div className="rcs__cw-text">
        <div className="rcs__cw-inner">
          {/* the calculator's name is the heading, the $50/year line sits
              under it (user, Nov 7: in the doc the name is the bold heading
              and "If each subscriber…" is a copy line) */}
          <h3 className="rcs__calc-h">{c.calcKicker}</h3>
          <p className="rcs__calc-sub">{c.calcHead}</p>
          <ol className="rcs__gets">
            {c.gets.map((g, i) => (
              <li key={g}>
                <b>{i + 1}</b>
                <span>{g}</span>
              </li>
            ))}
          </ol>
          <a
            className="rcs__cbtn"
            href={c.buttonHref}
            target="_blank"
            rel="noopener"
            onClick={() => ga.ctaClick('crps_calculator')}
          >
            {label.slice(0, cut)}
            <span className="rcs__nw">
              {label.slice(cut)}
              {'\u00a0'}
              <svg className="rcs__cbtn-arrow" viewBox="0 0 48 32" aria-hidden="true" focusable="false">
                <path d="M4 16h38M29 5l13 11-13 11" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
      <div className="rcs__cw-media">
        <div
          className={`rcs__tt${reached ? ' rcs__tt--reached' : ''}`}
          role="img"
          aria-label={fill(reached ? c.calcPanelLabelReached : c.calcPanelLabel, { now: tokens.rps_now })}
        >
          <div className="rcs__tt-row" aria-hidden="true">
            <div className="rcs__tt-side">
              <span className="rcs__tt-l">{c.calcToday}</span>
              <span className="rcs__tt-v rcs__tt-v--now" style={len > 3 ? { '--rcs-len': len } : undefined}>
                {tokens.rps_now}
              </span>
              <span className="rcs__tt-per">{c.calcPer}</span>
            </div>
            {!reached && (
            // the page's swoosh arrow, white on the blue box (user, Nov 7)
            <img className="rcs__tt-arrow" src="/assets/results-swoosh-white.png" alt="" width="230" height="218" />
            )}
            {!reached && (
              <div className="rcs__tt-side rcs__tt-side--target">
                <span className="rcs__tt-l">{c.calcTarget}</span>
                <span className="rcs__tt-v rcs__tt-v--target">{c.calcTargetValue}</span>
                <span className="rcs__tt-per">{c.calcPer}</span>
              </div>
            )}
          </div>
          <div className="rcs__tt-bar" aria-hidden="true">
            <i className="rcs__tt-fill" style={{ width: `${pct}%`, minWidth: now > 0 ? undefined : 0 }} />
          </div>
        </div>
      </div>
    </section>
  );
}
