import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RPS_CARDS } from '../copy.js';
import { fill } from '../resolveTokens.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './CompoundingRps.css';

const CEILING = 50; // the $50 Revenue Per Subscriber™ benchmark (calculator CEILINGS.rps)
const PIN_ROOM = 8; // px of clear space two neighbouring pin labels keep

const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
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
  const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // slide the row itself to card i (used by the pinned scroll and, outside
  // pin mode, by the arrows / dots / keys)
  const slideTo = (i, smooth = true) => {
    const track = trackRef.current;
    const els = cardEls();
    if (!track || !els.length) return;
    const k = Math.max(0, Math.min(els.length - 1, i));
    track.scrollTo({ left: els[k].offsetLeft - track.offsetLeft - 4, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
  };

  /* ——— pinned on desktop: the page's scroll moves the cards (Alefiya, 2.0
     FINAL RP QC: "if I scroll, I go left to right on these cards"). Built
     like row 4's steps after their jitter fix: the scroll position only
     PICKS a card (with a dead band), the row then glides there on its own,
     and nothing inside the pinned stage changes height while pinned. ——— */
  const scrollyRef = useRef(null);
  const stageRef = useRef(null);
  const [pin, setPin] = useState(null); // { top, step } while pinned
  const pinRef = useRef(null);
  const curRef = useRef(0);
  pinRef.current = pin;

  // the places the row can rest: one per card, except that the last cards
  // share the row's end (2+ cards fit on a desktop row), so they share a stop
  const stopOf = (i) => {
    const track = trackRef.current;
    const els = cardEls();
    if (!track || !els.length) return i;
    const max = track.scrollWidth - track.clientWidth;
    const lefts = els.map((el) => Math.min(Math.max(0, el.offsetLeft - track.offsetLeft - 4), max));
    const stops = lefts.filter((v, k) => k === 0 || v > lefts[k - 1] + 1);
    const target = lefts[Math.max(0, Math.min(els.length - 1, i))];
    return Math.max(0, stops.findIndex((v) => Math.abs(v - target) <= 1));
  };
  const stopLeft = (k) => {
    const track = trackRef.current;
    const els = cardEls();
    const max = track.scrollWidth - track.clientWidth;
    const lefts = els.map((el) => Math.min(Math.max(0, el.offsetLeft - track.offsetLeft - 4), max));
    const stops = lefts.filter((v, j) => j === 0 || v > lefts[j - 1] + 1);
    return stops[Math.max(0, Math.min(stops.length - 1, k))];
  };

  const go = (i) => {
    const p = pinRef.current;
    const scrolly = scrollyRef.current;
    if (p && scrolly) {
      // pinned: scroll the page to the middle of that card's stretch; the
      // page scroll then moves the row
      const k = stopOf(i);
      const startY = scrolly.getBoundingClientRect().top + window.scrollY - p.top;
      window.scrollTo({ top: startY + (k === 0 ? 0.05 : k + 0.1) * p.step, behavior: reducedMotion() ? 'auto' : 'smooth' });
      return;
    }
    slideTo(i);
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
      // pinned: the tallest card overall, so the stage never changes height
      // while the page scrolls (a height change there shook row 4's cards)
      if (pinRef.current || (r.right > box.left + 1 && r.left < box.right - 1)) h = Math.max(h, el.offsetHeight);
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
  // pin only when the controls + the tallest card fit under the top bar,
  // on desktop widths; phones and short windows keep arrows + swipe
  useEffect(() => {
    // zoom shrinks the pinned stage to fit a short laptop screen (1366x768)
    const canPin = typeof CSS !== 'undefined' && CSS.supports?.('overflow', 'clip') && CSS.supports?.('zoom', '0.9');
    let lastW = 0;
    let lastH = 0;
    const decide = (force) => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;
      const prevZoom = stage.style.zoom;
      stage.style.zoom = '1';
      const w = window.innerWidth;
      const h = document.documentElement.clientHeight;
      // a phone toolbar sliding in/out only nudges the height: ignore it
      if (!force && w === lastW && Math.abs(h - lastH) < 120) return;
      lastW = w;
      lastH = h;
      const tallest = Math.max(0, ...cardEls().map((el) => el.offsetHeight));
      const cs = getComputedStyle(track);
      const trackH = tallest + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.marginTop);
      const bar = stage.firstElementChild;
      const barH = bar ? bar.offsetHeight + parseFloat(getComputedStyle(bar).marginTop) : 0;
      const top = (document.querySelector('.rnav')?.offsetHeight || 0) + 12;
      // measured at full size (the zoom is off until we pin); a short
      // screen gets the stage scaled down to fit, but never below 0.78 so
      // the cards stay readable — below that, arrows + swipe instead
      const zoom = Math.min(1, (h - top - 16) / (barH + trackH));
      const fits = zoom >= (pinRef.current ? 0.74 : 0.78);
      const max = track.scrollWidth - track.clientWidth;
      const lefts = cardEls().map((el) => Math.min(Math.max(0, el.offsetLeft - track.offsetLeft - 4), max));
      const stops = lefts.filter((v, k) => k === 0 || v > lefts[k - 1] + 1).length;
      stage.style.zoom = prevZoom;
      const z = Math.round(zoom * 1000) / 1000;
      const next = canPin && w >= 861 && stops > 1 && fits ? { top, step: Math.round(h * 0.55), stops, zoom: z } : null;
      setPin((prev) =>
        prev && next && prev.top === next.top && prev.step === next.step && prev.stops === next.stops && prev.zoom === next.zoom ? prev : next
      );
    };
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => decide(false));
    };
    decide(true);
    document.fonts?.ready?.then(() => decide(true));
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  useEffect(() => {
    const scrolly = scrollyRef.current;
    if (!pin || !scrolly) return undefined;
    const last = pin.stops - 1;
    let raf = 0;
    const pick = (glide) => {
      let smooth = glide;
      raf = 0;
      const box = scrolly.getBoundingClientRect();
      const raw = Math.max(0, (pin.top - box.top) / pin.step);
      // card k owns raw in [k - 0.4, k + 0.6); +-0.06 dead band either side
      // a jump of more than one stop at once (scroll restored after a
      // reload, the page above changing height) goes straight there with
      // no glide through the cards in between
      const far = Math.abs(raw - curRef.current) > 1.2;
      let k = smooth && !far ? curRef.current : Math.max(0, Math.min(last, Math.round(raw)));
      while (k < last && raw >= k + 0.66) k += 1;
      while (k > 0 && raw < k - 0.46) k -= 1;
      if (far) smooth = false;
      if (k !== curRef.current || !smooth) {
        curRef.current = k;
        const track = trackRef.current;
        if (track) track.scrollTo({ left: stopLeft(k), behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => pick(true));
    };
    // the page above can change height with no scroll at all (late images
    // and fonts after a reload mid-section), which moves this section:
    // re-check the stop then and jump straight to it (row 4's fix)
    const page = scrolly.closest('.results-page') || document.body;
    const pageRo = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => pick(false)) : null;
    pageRo?.observe(page);
    // first placement without a glide (e.g. a reload mid-section): start
    // from the stop the scroll position is nearest to
    {
      const box = scrolly.getBoundingClientRect();
      const raw = Math.max(0, (pin.top - box.top) / pin.step);
      curRef.current = Math.max(0, Math.min(last, Math.round(raw)));
    }
    pick(false);
    fitHeight();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      pageRo?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, cards.length]);

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
    <section className={`rcs${pin ? ' rcs--pin' : ''}`}>
      <div className="rcs__inner">
        <div className="rcs__head">
          {/* capped takers can't reach $1.5M, so no "Beyond your $1.5M" */}
          {!result.cappedState && <span className="rcs__k">{c.kicker}</span>}
          {lifts ? (
            <h2 className="rcs__h2">
              {c.headBefore} <span className="rcs__hn rcs__hn--green">{c.headPromise}</span> {c.headMid}{' '}
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

        <div
          className="rcs__scrolly"
          ref={scrollyRef}
          style={
            pin
              ? { '--rcs-scroll': `${(pin.stops - 1) * pin.step}px`, '--rcs-pin-top': `${(pin.top / pin.zoom).toFixed(2)}px` }
              : undefined
          }
        >
        <div className="rcs__stage" ref={stageRef} style={pin && pin.zoom < 1 ? { zoom: pin.zoom } : undefined}>
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
        </div>

      </div>
    </section>
    {/* the calculator, its own split section under the cards (Alefiya,
        Slack Oct 31: it blended into the navy) */}
    <CalcPreview c={c} />
    </>
  );
}

/**
 * The calculator block: what it tells you, the button, and a looping preview
 * that types the design's example (36,000 subscribers, $360,000) and counts
 * the three outputs up — the design's own script, as a React effect. Reduced
 * motion: the finished example, no animation.
 */
function CalcPreview({ c }) {
  const ex = c.example;
  const reduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const done = {
    f1: ex.subs,
    f2: ex.revenue,
    typing: null,
    o1: money(ex.rps),
    o2: `${money(ex.gap)} away`,
    gap: ex.gapPct,
    o2b: true,
    o3: `${money(ex.yearly)} a year`,
  };
  const [s, setS] = useState(reduced ? done : { ...done, f1: '', f2: '', o1: '$0', o2: '$0 away', gap: 0, o2b: false, o3: '$0 a year' });

  useEffect(() => {
    if (reduced) return undefined;
    let alive = true;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const count = (ms, fn) =>
      new Promise((res) => {
        let start = null;
        const step = (tm) => {
          if (!alive) return res();
          if (start === null) start = tm;
          const p = Math.min((tm - start) / ms, 1);
          fn(1 - Math.pow(1 - p, 3));
          if (p < 1) requestAnimationFrame(step);
          else res();
        };
        requestAnimationFrame(step);
      });
    const type = async (key, text) => {
      for (let i = 1; i <= text.length && alive; i++) {
        setS((v) => ({ ...v, [key]: text.slice(0, i), typing: key }));
        await wait(100);
      }
      await wait(200);
      if (alive) setS((v) => ({ ...v, typing: null }));
    };
    (async () => {
      await wait(3500);
      while (alive) {
        setS({ f1: '', f2: '', typing: null, o1: '$0', o2: '$0 away', gap: 0, o2b: false, o3: '$0 a year' });
        await wait(500);
        await type('f1', ex.subs);
        await type('f2', ex.revenue);
        await count(900, (e) => setS((v) => ({ ...v, o1: money(ex.rps * e) })));
        await count(900, (e) => setS((v) => ({ ...v, gap: ex.gapPct * e, o2: `${money(ex.gap * e)} away` })));
        if (!alive) break;
        setS((v) => ({ ...v, o2b: true }));
        await count(900, (e) => setS((v) => ({ ...v, o3: `${money(ex.yearly * e)} a year` })));
        await wait(3200);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reduced, ex]);

  return (
    <section className="rcs-calc">
      <div className="rcs__cw-text">
        <div className="rcs__cw-inner">
        <span className="rcs__k2">{c.calcKicker}</span>
        <h3 className="rcs__calc-h">{c.calcHead}</h3>
        <ol className="rcs__gets">
          {c.gets.map((g, i) => (
            <li key={g}>
              <b>{i + 1}</b>
              <span>{g}</span>
            </li>
          ))}
        </ol>
        {/* TODO: real calculator URL (Burhan, with the other placeholder links) */}
        <a
          className="rcs__btn"
          href={c.buttonHref}
          target="_blank"
          rel="noopener"
          onClick={() => ga.ctaClick('crps_calculator')}
        >
          {/* the arrow stays with the last word */}
          {c.button.replace(/ (\S+)$/, '\u00a0$1')}
        </a>
        </div>
      </div>
      <div className="rcs__cw-media">
      <div className="rcs__calc" role="img" aria-label={c.calcLabel}>
        <div className="rcs__in-side" aria-hidden="true">
          <div className="rcs__ttl">
            <i />
            {c.calcTitle}
          </div>
          <div className="rcs__fld">
            <label>{c.calcField1}</label>
            <div className={`rcs__box${s.typing === 'f1' ? ' rcs__box--on' : ''}`}>
              {s.f1}
              {s.typing === 'f1' && <span className="rcs__caret" />}
            </div>
          </div>
          <div className="rcs__fld">
            <label>{c.calcField2}</label>
            <div className={`rcs__box${s.typing === 'f2' ? ' rcs__box--on' : ''}`}>
              {s.f2}
              {s.typing === 'f2' && <span className="rcs__caret" />}
            </div>
          </div>
        </div>
        <div className="rcs__out-side" aria-hidden="true">
          <div className="rcs__o">
            <span className="rcs__ol">{c.calcOut1}</span>
            <span className="rcs__ov">{s.o1}</span>
          </div>
          <div className="rcs__o rcs__o--hi">
            <span className="rcs__ol">{c.calcOut2}</span>
            <span className="rcs__ov rcs__ov--gap">{s.o2}</span>
            <div className="rcs__gap">
              <i style={{ width: `${s.gap}%` }} />
            </div>
            <span className="rcs__os" style={{ opacity: s.o2b ? 1 : 0 }}>
              {c.calcOut2Sub}
            </span>
          </div>
          <div className="rcs__o">
            <span className="rcs__ol">{c.calcOut3}</span>
            <span className="rcs__ov rcs__ov--sm">{s.o3}</span>
          </div>
        </div>
      </div>
      <p className="rcs__calc-note">{c.calcNote}</p>
      </div>
    </section>
  );
}
