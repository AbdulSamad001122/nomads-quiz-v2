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
            onClick={() => ga.ctaClick(c.id)}
          >
            {c.label}
          </a>
        ))}
      </div>
    </header>
  );
}
