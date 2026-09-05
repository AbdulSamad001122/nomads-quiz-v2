import { useEffect } from 'react';
import './SlideScreen.css';

/**
 * Simple non-question slide (placeholder quality — to be upgraded later).
 * Design-system compliant: flat surfaces, radius 0, thin keylines, hard
 * offset shadows, Montserrat EB headline, Roboto Mono eyebrow.
 *
 * kinds: 'default' | 'loading' | 'optin' | 'dq' | 'results'
 */
export default function SlideScreen({
  kind = 'default',
  eyebrow,
  title,
  lines = [],
  body = [], // rich blocks: string=paragraph · {h} subheading · {ul:[...]} bullets · {em} lead
  stat, // optional { value, label } — bold callout (e.g. case-study result)
  cta,
  onCta,
  onBack,
  autoAdvanceMs,
  note,
}) {
  useEffect(() => {
    if (!autoAdvanceMs) return undefined;
    const t = setTimeout(() => onCta?.(), autoAdvanceMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvanceMs]);

  return (
    <div className={`slide-screen slide-screen--${kind}`}>
      <header className="slide-screen__bar">
        <div className="slide-screen__logo">
          <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
        </div>
        {onBack && kind !== 'loading' ? (
          <button type="button" className="slide-screen__back" onClick={onBack}>
            &#8249; Back
          </button>
        ) : null}
      </header>

      <main className="slide-screen__card">
        {kind === 'loading' ? (
          <div className="slide-screen__compass" aria-hidden="true">
            <img src="/assets/nomads-icon-dark.png" alt="" />
          </div>
        ) : null}

        {eyebrow ? <p className="slide-screen__eyebrow">{eyebrow}</p> : null}
        {title ? <h1 className="slide-screen__title">{title}</h1> : null}

        {lines.map((line, i) => (
          <p className="slide-screen__line" key={i}>
            {line}
          </p>
        ))}

        {body.map((block, i) => {
          if (typeof block === 'string')
            return (
              <p className="slide-screen__line" key={i}>
                {block}
              </p>
            );
          if (block.em)
            return (
              <p className="slide-screen__lead" key={i}>
                {block.em}
              </p>
            );
          if (block.h)
            return (
              <p className="slide-screen__subhead" key={i}>
                {block.h}
              </p>
            );
          if (block.ul)
            return (
              <ul className="slide-screen__list" key={i}>
                {block.ul.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            );
          if (block.img)
            return (
              <img
                className="slide-screen__img"
                key={i}
                src={block.img}
                alt={block.alt || ''}
                loading="lazy"
              />
            );
          return null;
        })}

        {stat ? (
          <div className="slide-screen__stat">
            <span className="slide-screen__stat-value">{stat.value}</span>
            {stat.label ? (
              <span className="slide-screen__stat-label">{stat.label}</span>
            ) : null}
          </div>
        ) : null}

        {kind === 'optin' ? (
          <form
            className="slide-screen__form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              onCta?.({
                firstName: (data.get('firstName') || '').trim(),
                email: (data.get('email') || '').trim(),
              });
            }}
          >
            <label className="slide-screen__field">
              <span>Your First Name</span>
              <input type="text" name="firstName" placeholder="First name" required />
            </label>
            <label className="slide-screen__field">
              <span>Your Email</span>
              <input type="email" name="email" placeholder="you@company.com" required />
            </label>
            <button type="submit" className="q-btn slide-screen__cta">
              {cta || 'Show me my RPV™ →'}
            </button>
          </form>
        ) : cta ? (
          <button type="button" className="q-btn slide-screen__cta" onClick={onCta}>
            {cta}
          </button>
        ) : null}

        {note ? <p className="slide-screen__note">{note}</p> : null}
      </main>
    </div>
  );
}
