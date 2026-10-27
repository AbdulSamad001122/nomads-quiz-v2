import { WHAT_IF } from '../copy.js';
import './WhatIfYouDid.css';

/**
 * The GolfBays proof card, right after the "stop at $1.5M / push to their
 * max" section. QC row 5 (Oct 2026) moved this section's "But… what if you
 * did?" kicker, max-gain headline, "Yep, with the same traffic!" banner and
 * workshop note into StopOrPush ("one message, one section"); the card
 * stays here until QC row 6 restyles it like the case-study cards.
 * Suppressed when the achievable gain is ≤ 0 (Block 7 takers never saw it).
 */
export default function WhatIfYouDid({ result }) {
  if (!(result.capped.achievableGain > 0)) return null;
  const c = WHAT_IF;
  return (
    <section className="rwi">
      <div className="rwi__inner">
        <div className="rwi__card-wrap">
          <div className="rwi__card">
            <p className="rwi__card-head">
              {c.golfHead.map((seg) => (
                <span key={seg.t} className={seg.hl ? 'rwi__hl' : undefined}>
                  {seg.t}
                  {seg.t === c.golfHeadBreakAfter ? <br /> : null}
                </span>
              ))}
            </p>
            <p className="rwi__card-body">{c.golfBody}</p>
            <div className="rwi__logo">
              <span className="rwi__logo-disc">
                <img src="/assets/results-golfbays-icon.png" alt="" width="720" height="720" />
              </span>
              <span className="rwi__logo-text">
                <strong>{c.golfName}</strong>
                <small>{c.golfType}</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
