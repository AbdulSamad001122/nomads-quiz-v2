import { useRef, useState } from 'react';
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

  const show = (i, fromNav) => {
    const n = Math.max(0, Math.min(last, i));
    setCur(n);
    // Back / Next sit under the card: when the new card is shorter and its
    // top is now above the screen, bring it back into view
    if (fromNav) {
      requestAnimationFrame(() => {
        const el = trackRef.current;
        // clear the sticky top bar (taller on phones)
        const offset = (document.querySelector('.rnav')?.offsetHeight || 0) + 16;
        const top = el?.getBoundingClientRect().top;
        if (el && top < offset) {
          const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: top + window.scrollY - offset, behavior: reduce ? 'auto' : 'smooth' });
        }
      });
    }
  };

  const card = (i, cls, top, children) => (
    <article
      className={`rsh__card rsh__card--${cls}`}
      id={`rsh-card-${i}`}
      role="tabpanel"
      aria-labelledby={`rsh-stop-${i}`}
      hidden={cur !== i}
    >
      <div className="rsh__top">
        <span>{top}</span>
        <span className="rsh__n">{pad(i + 1)}</span>
      </div>
      {children}
    </article>
  );

  return (
    <section className="rsh">
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

      <div className="rsh__route" role="tablist">
        {c.steps.map((s, i) => (
          <button
            key={s}
            id={`rsh-stop-${i}`}
            type="button"
            role="tab"
            aria-selected={cur === i}
            aria-controls={`rsh-card-${i}`}
            className={`rsh__stop${cur === i ? ' rsh__stop--on' : ''}`}
            onClick={() => show(i, false)}
          >
            <b>{pad(i + 1)}</b>
            <span>{s}</span>
          </button>
        ))}
      </div>

      <div className="rsh__track" ref={trackRef}>
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

      <div className="rsh__stepnav">
        <button type="button" onClick={() => show(cur - 1, true)} disabled={cur === 0}>
          {c.back}
        </button>
        <span aria-live="polite">{`${cur + 1} / ${c.steps.length}`}</span>
        <button type="button" onClick={() => show(cur + 1, true)} disabled={cur === last}>
          {c.next}
        </button>
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
