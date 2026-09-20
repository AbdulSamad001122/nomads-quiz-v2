import { YOUR_CALL } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import TidyCalEmbed from './TidyCalEmbed.jsx';
import './YourCall.css';

/**
 * Section — "Then It's Your Call." closer: cream rounded card on the topo
 * texture with the rule + compass, run-it-in-house copy, plum band, pink
 * booking button and the Calendly image. The circle badge straddles the
 * top seam.
 */
export default function YourCall() {
  return (
    <section className="ryc">
      <img className="ryc__badge" src="/assets/results-your-call-badge.png" alt="" aria-hidden="true" />

      <div className="ryc__card">
        <div className="ryc__rule" aria-hidden="true">
          <span className="ryc__rule-line" />
          <img className="ryc__rule-icon" src="/assets/nomads-icon-dark.png" alt="" />
        </div>

        <div className="ryc__grid">
          <div className="ryc__content">
            <p className="ryc__para">{YOUR_CALL.para1}</p>
            <p className="ryc__band">{YOUR_CALL.band}</p>
            <p className="ryc__para">{YOUR_CALL.para2}</p>
            {/* Booking URL live (Yemi, Sep 19 doc comments). New tab so the
                taker keeps their result page — it can't be regenerated. */}
            <a
              className="ryc__btn"
              href="https://tidycal.com/alefiya/crpv-game-plan-call"
              target="_blank"
              rel="noopener"
              onClick={() => ga.ctaClick('book_call')}
            >
              {YOUR_CALL.button}
            </a>
            <p className="ryc__para">{YOUR_CALL.sub}</p>
          </div>

          <div className="ryc__media">
            {/* live TidyCal widget replaces the static Calendly mock
                (Yemi "Embed Calendar" comment, code supplied Sep 19) */}
            <TidyCalEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
