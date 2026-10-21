import { useLayoutEffect, useRef } from 'react';
import { BASE_CSS } from './cardBase.js';
import './cardFonts.css';

/**
 * Shows one of Yemi's HTML cards inside a shadow root, filling the space
 * under the quiz's progress strip. The card's own markup, CSS and script run
 * exactly as designed (see cardBase.js).
 *
 * `mount({ root, app, host, data, back, complete })` builds the card into
 * `app` (the card file's #app) and returns a cleanup function. `css` is the
 * card's stylesheet as a string (imported with ?inline). `data` carries quiz
 * answers a card needs (e.g. Q3 for the 5B card).
 */
export default function CardHost({ mount, css, label, data, onBack, onContinue }) {
  const hostRef = useRef(null);
  const live = useRef({});
  live.current = { onBack, onContinue, data };
  const dataKey = JSON.stringify(data ?? null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    root.replaceChildren();
    const style = document.createElement('style');
    style.textContent = `${BASE_CSS}\n${css}`;
    const body = document.createElement('div');
    body.className = 'nc-body';
    const app = document.createElement('div');
    app.id = 'app';
    body.append(app);
    root.append(style, body);
    const destroy = mount({
      host,
      root,
      app,
      data: live.current.data,
      back: () => live.current.onBack?.(),
      complete: () => live.current.onContinue?.(),
    });
    return () => {
      if (typeof destroy === 'function') destroy();
      root.replaceChildren();
    };
  }, [mount, css, dataKey]);

  return <div ref={hostRef} className="nc-host" role="region" aria-label={label} />;
}
