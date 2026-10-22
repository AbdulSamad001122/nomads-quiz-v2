/**
 * Shared pieces for Yemi's HTML cards (the Oct 20 "in-between" slides).
 *
 * Each card runs its own markup, stylesheet and script, ported from the
 * HTML file with the preview-only parts removed, inside a shadow root (see
 * CardHost.jsx), so the quiz's global CSS can't change the card and the
 * card's CSS can't leak into the quiz.
 */

/* Base styles inside every card's shadow root:
   - the reset the card's HTML page shipped with (Claude artifact reset),
     re-aimed at the shadow root (:host = the page, .nc-body = <body>);
   - the quiz additions shared by every card: the Back control (Q4's "← Back"
     in the card's own type) and the CTA arrow (user, Oct 21: the button hugs
     its text, arrow 1.6× the text size, 12px from it; Oct 22: the arrow sits
     on the right of the text, vertically centred on the button, also when
     the text wraps to two lines). */
export const BASE_CSS = `
:host{display:block;position:relative;overflow:hidden;color-scheme:light;
  height:calc(100vh - var(--qps-height, 0px));height:calc(100dvh - var(--qps-height, 0px))}
.nc-body{margin:0;padding:0;height:100%;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000;
  -webkit-font-smoothing:auto;text-rendering:auto;letter-spacing:normal;word-spacing:normal;text-transform:none;text-align:start}
img{max-width:100%}
[hidden]:not([hidden=until-found i]){display:none!important}

.nc-back{align-self:flex-start;margin:-8px 0 -12px -6px;padding:8px 6px;background:none;border:0;cursor:pointer;
  color:var(--cream,#F4EDE6);font:500 11px var(--mono);letter-spacing:.09em;text-transform:uppercase;opacity:.75;
  -webkit-tap-highlight-color:transparent}
.nc-back:focus-visible{outline:2px solid var(--cream,#F4EDE6);outline-offset:3px}
.nc-cta{display:flex;align-items:center;gap:12px}
.nc-cta-t{min-width:0}
.nc-arrow{flex:none;font-size:1.6em;line-height:0;position:relative;top:var(--nc-arrow-dy,0)}
.nc-arrow-svg{flex:none;display:block;margin:-.3em 0;width:1.6em;height:1.6em}
.nc-arrow-svg svg{display:block;width:100%;height:100%}
`;

export function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

/* A button's label: the text, then the arrow to its right, centred on the
   button's height (a flex row, so a wrapped label never strands the arrow on
   a line of its own). The arrow is the card's own: the "→" glyph by default,
   or the card's SVG arrow when it used one (`svg`). */
export function ctaLabel(text, svg) {
  const arrow = svg
    ? '<span class="nc-arrow-svg" aria-hidden="true">' + svg + '</span>'
    : '<span class="nc-arrow" aria-hidden="true">→</span>';
  return '<span class="nc-cta"><span class="nc-cta-t">' + esc(text) + '</span>' + arrow + '</span>';
}

/* The "→" comes from a fallback font (the cards' Montserrat files are the
   latin subset, without U+2192), so where its ink sits in its line differs by
   platform (about 2px low on Windows). Measure it once per card, in the
   card's own button type, and return the nudge (em) that puts the arrow's
   ink on the button's vertical centre; CardHost sets it as --nc-arrow-dy. */
export function arrowNudge(app) {
  const probe = document.createElement('button');
  probe.className = 'cta';
  probe.tabIndex = -1;
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden';
  probe.innerHTML = '<span class="nc-arrow">→</span>';
  app.append(probe);
  const cs = getComputedStyle(probe.firstChild);
  const font = cs.fontStyle + ' ' + cs.fontWeight + ' 100px ' + cs.fontFamily;
  probe.remove();
  const measure = () => {
    const m = document.createElement('canvas').getContext('2d');
    m.font = font;
    const t = m.measureText('→');
    if (!t.actualBoundingBoxAscent || !t.fontBoundingBoxAscent) return 0;
    const ink = (t.actualBoundingBoxAscent - t.actualBoundingBoxDescent) / 2;
    const box = (t.fontBoundingBoxAscent - t.fontBoundingBoxDescent) / 2;
    return Math.round(ink - box) / 100; /* ink below centre: negative, moves it up */
  };
  const fonts = document.fonts && document.fonts.load ? document.fonts.load(font) : null;
  return Promise.resolve(fonts).catch(() => null).then(measure);
}

export function backButton(label = 'Back') {
  return '<button type="button" class="nc-back" data-act="nc-back">← ' + esc(label) + '</button>';
}

/**
 * Tracks everything a card starts outside its own DOM (window/document
 * listeners, media-query listeners, timers, observers, animations) so leaving
 * the screen stops all of it.
 */
export function createScope() {
  const undo = [];
  let alive = true;
  return {
    get alive() {
      return alive;
    },
    on(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      undo.push(() => target.removeEventListener(type, fn, opts));
    },
    onMedia(mql, fn) {
      if (mql.addEventListener) {
        mql.addEventListener('change', fn);
        undo.push(() => mql.removeEventListener('change', fn));
      } else {
        mql.addListener(fn);
        undo.push(() => mql.removeListener(fn));
      }
    },
    timeout(fn, ms) {
      const id = setTimeout(() => alive && fn(), ms);
      undo.push(() => clearTimeout(id));
      return id;
    },
    interval(fn, ms) {
      const id = setInterval(() => alive && fn(), ms);
      undo.push(() => clearInterval(id));
      return id;
    },
    raf(fn) {
      const id = requestAnimationFrame((t) => alive && fn(t));
      undo.push(() => cancelAnimationFrame(id));
      return id;
    },
    track(thing) {
      // anything with disconnect() / cancel() (observers, animations)
      undo.push(() => (thing.disconnect ? thing.disconnect() : thing.cancel && thing.cancel()));
      return thing;
    },
    destroy() {
      alive = false;
      while (undo.length) {
        try {
          undo.pop()();
        } catch {
          /* already gone */
        }
      }
    },
  };
}
