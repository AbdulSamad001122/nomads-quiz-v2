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

  /* Scrolling moves through the steps (Alefiya, Slack Oct 31: "once I
     scroll I go to the next … even if I don't click").
     'pin'   — the step buttons + card stay on screen while the page scrolls
               through 01 → 04, then the page carries on. Only when the
               tallest card fits on screen (desktop windows ~770px+ tall).
     'stack' — phones and short screens: the four cards follow one another
               and the step buttons (stuck at the top) light up as each
               card is reached. Nothing is ever hidden off screen. */
  const [mode, setMode] = useState('stack');
  const [dims, setDims] = useState({ step: 500, top: 90 });
  const scrollyRef = useRef(null);
  const routeRef = useRef(null);

  useEffect(() => {
    const decide = () => {
      const track = trackRef.current;
      const route = routeRef.current;
      if (!track || !route) return;
      const top = (document.querySelector('.rnav')?.offsetHeight || 0) + 12;
      const tallest = Math.max(...[...track.querySelectorAll('.rsh__card')].map((el) => el.offsetHeight));
      const stageH = route.offsetHeight + 16 + tallest;
      const fits = window.innerWidth >= 861 && top + stageH + 16 <= window.innerHeight;
      setMode(fits ? 'pin' : 'stack');
      setDims({ step: Math.round(window.innerHeight * 0.55), top });
    };
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(decide);
    };
    decide();
    document.fonts?.ready?.then(decide);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // which step the scroll position stands on
  useEffect(() => {
    let raf = 0;
    const sync = () => {
      raf = 0;
      if (mode === 'pin') {
        const box = scrollyRef.current?.getBoundingClientRect();
        if (!box) return;
        const past = dims.top - box.top;
        setCur(Math.max(0, Math.min(last, Math.floor(past / dims.step))));
      } else {
        const cards = [...(trackRef.current?.querySelectorAll('.rsh__card') || [])];
        const line = window.innerHeight * 0.45;
        let at = 0;
        cards.forEach((el, i) => {
          if (el.getBoundingClientRect().top < line) at = i;
        });
        setCur(at);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [mode, dims, last]);

  // a step button takes the page to that step
  const goTo = (i) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduce ? 'auto' : 'smooth';
    if (mode === 'pin') {
      const startY = scrollyRef.current.getBoundingClientRect().top + window.scrollY - dims.top;
      window.scrollTo({ top: startY + i * dims.step + 2, behavior });
    } else {
      const el = trackRef.current?.querySelectorAll('.rsh__card')[i];
      const offset = dims.top + (routeRef.current?.offsetHeight || 0) + 8;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior });
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

  // pinned: only the current card shows (the others wait in the same spot);
  // stacked: every card shows, one after another
  const off = (i) => mode === 'pin' && cur !== i;
  const card = (i, cls, top, children) => (
    <article
      className={`rsh__card rsh__card--${cls}${off(i) ? ' rsh__card--off' : ''}`}
      id={`rsh-card-${i}`}
      role="tabpanel"
      aria-labelledby={`rsh-stop-${i}`}
      aria-hidden={off(i) || undefined}
    >
      <div className="rsh__top">
        <span>{top}</span>
        <span className="rsh__n">{pad(i + 1)}</span>
      </div>
      {children}
    </article>
  );

  return (
    <section className={`rsh rsh--${mode}`} style={{ '--rsh-pin-top': `${dims.top}px` }}>
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
      <div className="rsh__stage">
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

      <div className={`rsh__track${seen ? ' rsh__track--seen' : ''}`} ref={trackRef}>
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

      {/* Back / Next retired: scrolling (and the step buttons) move through
          the steps now */}
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
