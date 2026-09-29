import { GAMEPLAN_CTA } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import TidyCalEmbed from './TidyCalEmbed.jsx';
import './GamePlanCta.css';

/**
 * Section — "$125k Game Plan Call" CTA: cream card on the teal/maroon topo
 * texture. Left: two-tone headline, body copy, pink bordered button.
 * Right: the live TidyCal calendar.
 *
 * Also used for the call option under the red-metrics diagnostic video
 * (RED_METRICS_CALL, user Sep 29) — same layout, no button there because
 * that copy has none.
 */
export default function GamePlanCta({ copy = GAMEPLAN_CTA }) {
  const body = copy.bodyLines ? copy.bodyLines.join(' ') : copy.body;
  return (
    <section className="rgp">
      <div className="rgp__card">
        <div className="rgp__content">
          <h2 className="rgp__headline">
            {copy.headlinePlain} <span className="rgp__accent">{copy.headlineAccent}</span>
          </h2>
          <p className="rgp__body">{copy.noBreak ? keepTogether(body, copy.noBreak) : body}</p>
          {/* Booking URL live (Yemi, Sep 19 doc comments). New tab so the
              taker keeps their result page — it can't be regenerated. */}
          {copy.button && (
            <a
              className="rgp__btn"
              href="https://tidycal.com/alefiya/crpv-game-plan-call"
              target="_blank"
              rel="noopener"
              onClick={() => ga.ctaClick('book_call')}
            >
              {copy.button}
            </a>
          )}
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

/** Stops the browser breaking `term` at its hyphen ("C-" / "RPV"). */
function keepTogether(text, term) {
  return text.split(term).flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span className="rgp__nowrap" key={i}>
            {term}
          </span>,
          part,
        ],
  );
}
