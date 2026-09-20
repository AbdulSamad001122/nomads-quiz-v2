import { GAMEPLAN_CTA } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import TidyCalEmbed from './TidyCalEmbed.jsx';
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
          <p className="rgp__body">{GAMEPLAN_CTA.bodyLines.join(' ')}</p>
          {/* Booking URL live (Yemi, Sep 19 doc comments). New tab so the
              taker keeps their result page — it can't be regenerated. */}
          <a
            className="rgp__btn"
            href="https://tidycal.com/alefiya/crpv-game-plan-call"
            target="_blank"
            rel="noopener"
            onClick={() => ga.ctaClick('book_call')}
          >
            {GAMEPLAN_CTA.button}
          </a>
        </div>
        <div className="rgp__media">
          {/* live TidyCal widget replaces the static Calendly mock
              (Yemi "Embed Calendar" comment, code supplied Sep 19) */}
          <TidyCalEmbed />
        </div>
      </div>
    </section>
  );
}
