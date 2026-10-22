import { useLayoutEffect, useRef } from 'react';
import { BASE_CSS, arrowNudge } from './cardBase.js';
import './cardFonts.css';

/**
 * Shows one of Yemi's HTML cards inside a shadow root, filling the space
 * under the quiz's progress strip. The card's own markup, CSS and script run
 * exactly as designed (see cardBase.js).
 *
 * `load()` imports the card's module — `{ mount, css }` — on demand, so the
 * cards stay out of the quiz's first download (each slot component also
 * prefetches its card shortly after the quiz opens; see prefetchCard).
 * `mount({ root, app, host, data, back, complete })` builds the card into
 * `app` (the card file's #app) and returns a cleanup function; `css` is the
 * card's stylesheet as a string. `data` carries quiz answers a card needs.
 */
export default function CardHost({ load, label, data, onBack, onContinue }) {
  const hostRef = useRef(null);
  const live = useRef({});
  live.current = { onBack, onContinue, data };
  const dataKey = JSON.stringify(data ?? null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    root.replaceChildren();
    let cancelled = false;
    let destroy = null;
    load().then(({ mount, css }) => {
      if (cancelled) return;
      const style = document.createElement('style');
      style.textContent = `${BASE_CSS}\n${css}`;
      const body = document.createElement('div');
      body.className = 'nc-body';
      const app = document.createElement('div');
      app.id = 'app';
      body.append(app);
      root.append(style, body);
      destroy = mount({
        host,
        root,
        app,
        data: live.current.data,
        back: () => live.current.onBack?.(),
        complete: () => live.current.onContinue?.(),
      });
      arrowNudge(app).then((dy) => {
        if (!cancelled) host.style.setProperty('--nc-arrow-dy', dy + 'em');
      });
    });
    return () => {
      cancelled = true;
      if (typeof destroy === 'function') destroy();
      root.replaceChildren();
    };
  }, [load, dataKey]);

  // The navy placeholder (every card's ground) covers the moment before the
  // card's code arrives, so there is never a white flash.
  return (
    <div
      ref={hostRef}
      className="nc-host"
      role="region"
      aria-label={label}
      style={{ background: '#121726', minHeight: 'calc(100dvh - var(--qps-height, 0px))' }}
    />
  );
}

/** Starts fetching a card's code in the background, after the quiz opens. */
export function prefetchCard(load, delayMs = 2500) {
  if (typeof window !== 'undefined') window.setTimeout(() => load().catch(() => {}), delayMs);
}
