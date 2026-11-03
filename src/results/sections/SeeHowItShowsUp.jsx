import { useEffect, useRef, useState } from 'react';
import { SEE_HOW } from '../copy.js';
import './SeeHowItShowsUp.css';

const pad = (n) => String(n).padStart(2, '0');

/**
 * "See How It Shows Up" — QC row 4 (Oct 2026), Alefiya's "See How It Shows
 * Up V2" design. One Midnight section that tells the "dozen marketing teams"
 * thought end to end: four tappable steps (only one card shows at a time;
 * Back / Next do the same), then the "So what if…" block, chaos vs
 * compounding, and the two-paths fork. Replaces SameProblemIntro,
 * RelateQuotes, InCommon, BounceRates, NotJustSite and TwoPaths' dark band;
 * TwoPaths' closing panel (copy + both buttons + photo) follows it.
 */
export default function SeeHowItShowsUp() {
  const c = SEE_HOW;
  const [cur, setCur] = useState(0);
  const trackRef = useRef(null);
  const last = c.steps.length - 1;

  /* Scrolling moves through the steps SIDEWAYS, like a carousel
     (Alefiya, Slack Oct 31: "once I scroll I go to the next … even if I
     don't click"; user: horizontal, the cards must not go bottom to top).
     'pin'   — desktop / tablet: the step buttons + the card strip stay on
               screen while the page scrolls, and the scrolling slides the
               strip to the left, one card at a time (01 → 04), each card
               held for a moment; then the page carries on. On short screens
               the whole stage is scaled down a little so the tallest card
               always fits.
     'swipe' — phones (a card is taller than the screen there, so it can't
               be held in place): the cards sit side by side and swipe left
               / right; the step buttons follow. */
  const [mode, setMode] = useState('swipe');
  const modeRef = useRef('swipe');
  const curRef = useRef(0);
  const [dims, setDims] = useState({ step: 500, top: 90, scale: 1 });
  const sectionRef = useRef(null);
  const scrollyRef = useRef(null);
  const routeRef = useRef(null);
  const railRef = useRef(null);
  const stageRef = useRef(null);
  const cardsOf = () => [...(trackRef.current?.querySelectorAll('.rsh__card') || [])];

  useEffect(() => {
    curRef.current = cur;
  }, [cur]);

  useEffect(() => {
    // sticking needs overflow: clip on the section (Safari 16+); older
    // browsers simply get the swipe strip
    const canPin = typeof CSS !== 'undefined' && CSS.supports?.('overflow', 'clip');
    let lastW = 0;
    let lastH = 0;
    const decide = (force) => {
      const sec = sectionRef.current;
      const route = routeRef.current;
      if (!sec || !route) return;
      const w = window.innerWidth;
      const h = document.documentElement.clientHeight;
      // a phone's toolbar sliding in / out only nudges the height: don't
      // rebuild the carousel mid-scroll for that
      if (!force && w === lastW && Math.abs(h - lastH) < 120) return;
      lastW = w;
      lastH = h;
      // always measure the cards as they sit when pinned (full width), so
      // the answer doesn't depend on the mode we happen to be in
      sec.classList.add('rsh--measure');
      const tallest = Math.max(...cardsOf().map((el) => el.offsetHeight));
      const stageH = route.offsetHeight + 16 + tallest + 14;
      sec.classList.remove('rsh--measure');
      const top = (document.querySelector('.rnav')?.offsetHeight || 0) + 12;
      const scale = Math.min(1, (h - top - 16) / stageH);
      // pin only while the text stays readable; a little hysteresis so a
      // window right at the edge doesn't flip back and forth
      const floor = modeRef.current === 'pin' ? 0.72 : 0.76;
      const next = canPin && w >= 861 && scale >= floor ? 'pin' : 'swipe';
      modeRef.current = next;
      setMode(next);
      const step = Math.round(h * 0.6);
      const sc = next === 'pin' ? Math.round(scale * 1000) / 1000 : 1;
      setDims((d) => (d.step === step && d.top === top && d.scale === sc ? d : { step, top, scale: sc }));
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
  }, []);

  // 'pin': the page's scroll position decides WHICH card shows; the slide
  // to it is a CSS transition the browser runs on its own (compositor).
  // Root cause of the jitter (user's videos, Oct 31): the strip used to be
  // moved frame by frame from JavaScript while the browser scrolled on its
  // own thread, so any slow frame (dev-mode React, a busy page) left the
  // strip a frame behind and it caught up in little jumps. Now scrolling
  // only flips an index — with a dead band so it can't flicker on a
  // boundary — and nothing about the motion depends on scroll timing.
  useEffect(() => {
    const rail = railRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (mode !== 'pin' || !rail || !track || !stage) return undefined;
    track.scrollLeft = 0; // no leftover sideways offset from the swipe strip
    let raf = 0;
    const sync = () => {
      raf = 0;
      const box = scrollyRef.current?.getBoundingClientRect();
      if (!box) return;
      const raw = Math.max(0, (dims.top - box.top) / dims.step);
      // card k owns raw ∈ [k - 0.4, k + 0.6); +-0.06 dead band either side
      let k = curRef.current;
      while (k < last && raw >= k + 0.66) k += 1;
      while (k > 0 && raw < k - 0.46) k -= 1;
      if (k !== curRef.current) {
        curRef.current = k;
        setCur(k);
      }
    };
    // Nothing in the pinned stage changes height while the page scrolls —
    // a height change there made the browser's scroll anchoring shift the
    // page, which moved the strip, which changed the height again: the
    // cards shook (user's video, Oct 31). Instead, what follows the section
    // is pulled up once by a fixed amount, so it lands just under card 04
    // (and under the scaled-down stage) when the pin lets go.
    const scrolly = scrollyRef.current;
    const tuck = () => {
      const cards = cardsOf();
      const lastCard = cards[cards.length - 1];
      if (!scrolly || !lastCard) return;
      const stageBox = stage.getBoundingClientRect();
      const lastBottom = lastCard.getBoundingClientRect().bottom + 14 * dims.scale;
      const unused = stageBox.top + stage.offsetHeight - lastBottom;
      scrolly.style.marginBottom = unused > 0 ? `${-unused.toFixed(1)}px` : '';
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(tuck) : null;
    cardsOf().forEach((el) => ro?.observe(el));
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    // place the strip on the right card WITHOUT a slide, then transitions on
    let ready = 0;
    const jump = () => {
      cancelAnimationFrame(ready);
      rail.classList.remove('rsh__rail--ready');
      rail.style.setProperty('--rsh-i', curRef.current);
      ready = requestAnimationFrame(() => {
        ready = requestAnimationFrame(() => rail.classList.add('rsh__rail--ready'));
      });
    };
    // the page above can change height with no scroll at all (late images
    // and fonts after a reload mid-section, a pillar opening), which moves
    // this section: check the card again then, and jump straight to it
    // (edge-case test, Oct 31). Watched on the page wrapper, which grows
    // with its content; body is pinned to the window height (global.css).
    const onLayout = () => {
      const was = curRef.current;
      sync();
      if (curRef.current !== was) jump();
    };
    const pageRo = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onLayout) : null;
    pageRo?.observe(sectionRef.current?.parentElement || document.body);
    sync();
    tuck();
    jump();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(ready);
      ro?.disconnect();
      pageRo?.disconnect();
      window.removeEventListener('scroll', onScroll);
      rail.classList.remove('rsh__rail--ready');
      if (scrolly) scrolly.style.marginBottom = '';
    };
  }, [mode, dims, last]);

  // 'swipe': the strip scrolls sideways under the finger (or via Back /
  // Next); the step buttons follow live, and once the strip comes to rest
  // its height fits the card on screen
  useEffect(() => {
    const track = trackRef.current;
    if (mode !== 'swipe' || !track) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let settleT = 0;
    let gestureFrom = -1;
    const indexNow = () => {
      const cards = cardsOf();
      const stride = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
      return Math.max(0, Math.min(last, Math.round(track.scrollLeft / stride)));
    };
    const fit = (at) => {
      const card = cardsOf()[at];
      if (!card) return;
      const bar = track.offsetHeight - track.clientHeight; // a visible scrollbar, if any
      track.style.height = `${card.offsetHeight + 14 + bar}px`;
    };
    const settle = () => {
      clearTimeout(settleT);
      const at = indexNow();
      setCur(at);
      fit(at);
      // swiped while reading low down a tall card: bring the new card's
      // top back into view — only after a real swipe, never on resize
      if (gestureFrom !== -1 && at !== gestureFrom && track.getBoundingClientRect().top < dims.top) {
        const y = track.getBoundingClientRect().top + window.scrollY - dims.top - (routeRef.current?.offsetHeight || 0) - 8;
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      }
      gestureFrom = -1;
    };
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          setCur(indexNow());
        });
      }
      clearTimeout(settleT);
      settleT = setTimeout(settle, 160);
    };
    const onStart = () => {
      gestureFrom = indexNow();
    };
    const onRefit = () => fit(indexNow());
    // coming from 'pin' (e.g. a tablet turned round): stay on the same card
    const cards = cardsOf();
    if (cards[curRef.current]) track.scrollLeft = cards[curRef.current].offsetLeft - cards[0].offsetLeft;
    setCur(indexNow());
    fit(indexNow());
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onRefit) : null;
    cards.forEach((el) => ro?.observe(el));
    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('scrollend', settle);
    track.addEventListener('touchstart', onStart, { passive: true });
    track.addEventListener('pointerdown', onStart);
    window.addEventListener('resize', onRefit);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleT);
      ro?.disconnect();
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('scrollend', settle);
      track.removeEventListener('touchstart', onStart);
      track.removeEventListener('pointerdown', onStart);
      window.removeEventListener('resize', onRefit);
      track.style.height = '';
    };
  }, [mode, dims, last]);

  // a step button (or Back / Next) goes to that step
  const goTo = (i) => {
    const n = Math.max(0, Math.min(last, i));
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduce ? 'auto' : 'smooth';
    if (mode === 'pin') {
      const startY = scrollyRef.current.getBoundingClientRect().top + window.scrollY - dims.top;
      // the middle of card n's own stretch of scroll
      window.scrollTo({ top: startY + (n === 0 ? 0.05 : n + 0.1) * dims.step, behavior });
    } else {
      const cards = cardsOf();
      if (cards[n]) trackRef.current.scrollTo({ left: cards[n].offsetLeft - cards[0].offsetLeft, behavior });
    }
  };

  // the chat bubbles pop in when the card first comes into view, not on
  // page load (row 4 sits far down the page, so the pop was long over)
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const card = (i, cls, top, children) => (
    <article
      className={`rsh__card rsh__card--${cls}`}
      id={`rsh-card-${i}`}
      role="tabpanel"
      aria-labelledby={`rsh-stop-${i}`}
    >
      <div className="rsh__top">
        <span>{top}</span>
        <span className="rsh__n">{pad(i + 1)}</span>
      </div>
      {children}
    </article>
  );

  return (
    <section
      ref={sectionRef}
      className={`rsh rsh--${mode}`}
      style={{ '--rsh-pin-top': `${dims.top}px`, '--rsh-scale': dims.scale }}
    >
      <div className="rsh__head">
        <span className="rsh__tag">{c.tag}</span>
        <img className="rsh__avs" src="/assets/results-relate-avatars.png" alt="" width="408" height="110" />
        <h2 className="rsh__h2">
          {c.headBefore} <mark>{c.headMark}</mark> {c.headAfter}
        </h2>
        <p className="rsh__ctx-top">
          {c.ctxTop.map(([t, b]) => (b ? <b key={t}>{t}</b> : t))}
        </p>
      </div>

      <div
        className="rsh__scrolly"
        ref={scrollyRef}
        // step 04 is held on screen for a while too, like the others
        style={mode === 'pin' ? { '--rsh-scroll': `${Math.round((last + 0.7) * dims.step)}px` } : undefined}
      >
      <div className="rsh__stage" ref={stageRef}>
      <div className="rsh__route" role="tablist" ref={routeRef}>
        {c.steps.map((s, i) => (
          <button
            key={s}
            id={`rsh-stop-${i}`}
            type="button"
            role="tab"
            aria-selected={cur === i}
            aria-controls={`rsh-card-${i}`}
            className={`rsh__stop${cur === i ? ' rsh__stop--on' : ''}`}
            onClick={() => goTo(i)}
          >
            <b>{pad(i + 1)}</b>
            <span>{s}</span>
          </button>
        ))}
      </div>

      {/* the swipe strip also gets Back / Next — a mouse can't swipe, and
          on phones they sit between the step buttons and the card (user,
          Oct 30) */}
      {mode === 'swipe' && (
        <div className="rsh__stepnav">
          <button type="button" onClick={() => goTo(cur - 1)} disabled={cur === 0}>
            {c.back}
          </button>
          <span aria-live="polite">{`${cur + 1} / ${c.steps.length}`}</span>
          <button type="button" onClick={() => goTo(cur + 1)} disabled={cur === last}>
            {c.next}
          </button>
        </div>
      )}

      <div className={`rsh__track${seen ? ' rsh__track--seen' : ''}`} ref={trackRef}>
      <div className="rsh__rail" ref={railRef} style={mode === 'pin' ? { '--rsh-i': cur } : undefined}>
        {card(
          0,
          'relate',
          c.relate.top,
          <>
            <p className="rsh__ctx">{c.relate.ctx}</p>
            <div className="rsh__chat">
              {c.relate.chat.map((m, k) => (
                <div key={m.av} className={`rsh__msg rsh__msg--${m.side} rsh__msg--${m.tone}`} style={{ '--d': `${0.1 + k * 0.4}s` }}>
                  <span className="rsh__av">{m.av}</span>
                  <div className="rsh__bub">
                    <span className="rsh__who">{m.who}</span>
                    <span className="rsh__lead">{m.lead}</span>
                    {m.rest && <span className="rsh__rest">{m.rest}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {card(
          1,
          'common',
          c.common.top,
          <>
            <p className="rsh__ctx">{c.common.ctx}</p>
            <h3 className="rsh__h3">{c.common.title}</h3>
            <p className="rsh__p">{c.common.p}</p>
            <div className="rsh__mores">
              {c.common.mores.map((m) => (
                <div key={m.label} className="rsh__mo">
                  <img src={m.icon} alt="" width="600" height="600" />
                  {m.label}
                </div>
              ))}
            </div>
            <div className="rsh__belief">
              {c.common.belief}
              <span>{c.common.beliefChip}</span>
            </div>
          </>
        )}

        {card(
          2,
          'stop',
          c.stop.top,
          <>
            <p className="rsh__ctx">{c.stop.ctx}</p>
            <div className="rsh__corr">
              {c.stop.corr.map((x) => (
                <div key={x.big} className="rsh__cx">
                  <b>{x.big}</b>
                  {x.small}
                </div>
              ))}
            </div>
            <p className="rsh__p">{c.stop.p1}</p>
            <span className="rsh__stop-line">{c.stop.line}</span>
            <p className="rsh__p">
              {c.stop.p2Before}
              <b>{c.stop.p2Bold}</b>
            </p>
            <div className="rsh__sites">
              {c.stop.sites.map((s) => (
                <div key={s.name} className="rsh__site">
                  <img src={s.src} alt={s.alt} width="660" height="348" loading="lazy" />
                  <span className="rsh__br">
                    <small>{c.stop.bounceLabel}</small>
                    {s.bounce}
                  </span>
                  <div className="rsh__meta">
                    {s.name}
                    <small>{s.meta}</small>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {card(
          3,
          'site',
          c.site.top,
          <>
            <p className="rsh__ctx">{c.site.ctx}</p>
            <div className="rsh__wrap">
              <img src="/assets/results-shows-eagle.webp" alt="" width="900" height="605" loading="lazy" />
              <div>
                <div className="rsh__big9">
                  {c.site.big}
                  <small>{c.site.bigSmall}</small>
                </div>
                <p className="rsh__p rsh__p--gap">
                  {c.site.pBefore}
                  <b>{c.site.pBold}</b>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      </div>
      </div>
      </div>

      <div className="rsh__joint" aria-hidden="true">
        <i />
        <b>↓</b>
      </div>

      <div className="rsh__aha">
        <h2 className="rsh__aha-h">{c.aha}</h2>
        <p className="rsh__aha-sub">{c.ahaSub}</p>

        <div className="rsh__vs">
          <div className="rsh__side rsh__side--chaos">
            <span className="rsh__lbl">{c.chaos.label}</span>
            <p className="rsh__side-h">{c.chaos.head}</p>
            <div className="rsh__throw">
              {c.chaos.throws.map((t, k) => (
                <span key={t} style={{ '--r': ['-4deg', '3deg', '-2deg', '4deg'][k] }}>
                  {t}
                </span>
              ))}
            </div>
            <p className="rsh__side-f">{c.chaos.foot}</p>
          </div>
          <div className="rsh__side rsh__side--calm">
            <span className="rsh__lbl">{c.calm.label}</span>
            <p className="rsh__side-h">{c.calm.head}</p>
            <ol className="rsh__know">
              {c.calm.know.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ol>
          </div>
        </div>

        <p className="rsh__goal">
          {c.goalBefore}
          <b>{c.goalBold}</b>
          {c.goalAfter}
          <span>{c.goalSub}</span>
        </p>

        <div className="rsh__paths">
          <span className="rsh__tp">{c.paths.tag}</span>
          <p className="rsh__tp-l">{c.paths.intro}</p>
          <blockquote className="rsh__quote">
            {c.paths.quote}
            <mark>{c.paths.quoteMark}</mark>
            {c.paths.quoteEnd}
          </blockquote>
          <p className="rsh__fork-l">{c.paths.fork}</p>
          <div className="rsh__fork">
            <div className="rsh__road rsh__road--a">
              <span className="rsh__rn">A</span>
              {c.paths.a}
            </div>
            <span className="rsh__or">{c.paths.or}</span>
            <div className="rsh__road rsh__road--b">
              <span className="rsh__rn">B</span>
              {c.paths.b}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
