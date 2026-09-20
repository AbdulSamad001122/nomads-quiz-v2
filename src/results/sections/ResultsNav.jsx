import { NAV } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import './ResultsNav.css';

/** Sticky white top bar: NOMADS logo, section links, the two CTA buttons. */
export default function ResultsNav() {
  return (
    <header className="rnav">
      <img className="rnav__logo" src="/assets/results-nomads-logo-plum.png" alt="Nomads" />

      <nav className="rnav__links">
        {NAV.links.map((l) => (
          <a key={l.href} className="rnav__link" href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className="rnav__ctas">
        {NAV.ctas.map((c) => (
          <a
            key={c.id}
            className={`rnav__cta rnav__cta--${c.variant}`}
            href={c.href}
            // external links (TidyCal) open in a new tab so the taker keeps
            // their result page — it can't be regenerated without retaking
            {...(c.href.startsWith('http')
              ? { target: '_blank', rel: 'noopener' }
              : null)}
            onClick={() => ga.ctaClick(c.id)}
          >
            {c.label}
          </a>
        ))}
      </div>
    </header>
  );
}
