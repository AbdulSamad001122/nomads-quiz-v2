import { GAMEPLAN_CTA } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import './GamePlanCta.css';

/**
 * Section — "$125k Game Plan Call" CTA: cream card on the teal/maroon topo
 * texture. Left: two-tone headline, body lines, pink bordered button.
 * Right: the Calendly reservation-page image.
 */
export default function GamePlanCta() {
  return (
    <section className="rgp">
      <div className="rgp__card">
        <div className="rgp__content">
          <h2 className="rgp__headline">
            {GAMEPLAN_CTA.headlinePlain} <span className="rgp__accent">{GAMEPLAN_CTA.headlineAccent}</span>
          </h2>
          <p className="rgp__body">
            {GAMEPLAN_CTA.bodyLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {i > 0 && ' '}
                {line}
              </span>
            ))}
          </p>
          {/* TODO: real booking URL when provided */}
          <a className="rgp__btn" href="#" onClick={() => ga.ctaClick('book_call')}>
            {GAMEPLAN_CTA.button}
          </a>
        </div>
        <div className="rgp__media">
          <img src="/assets/results-calendly-card.webp" alt="Calendly reservation page — pick a date and time for the call" />
        </div>
      </div>
    </section>
  );
}
