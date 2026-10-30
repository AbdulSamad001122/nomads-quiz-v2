import { WHAT_IF } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import TitledPortrait from './TitledPortrait.jsx';
import './WhatIfYouDid.css';

/* The GolfBays composition for the left panel (frame, founders and name art
   baked in, like the Lara / David portraits — user, Oct 30). If it's ever
   set to null, the frame falls back to the GolfBays logo on a white disc. */
const GOLF_IMAGE = '/assets/results-golfbays-photo.webp';
// "GOLFBAYS" starts at the art's left edge (x 1 of 1000)
const GOLF_INSET = '0%';

/**
 * The GolfBays case study, right after the "stop at $1.5M / push to their
 * max" section. QC row 6 (Oct 2026): "pls design this the way we design
 * case study cards - it is currently blurring with the rest of the beige
 * background"; Yemi's reference is the split testimonial layout (Dani Paige):
 * dark crumpled-paper panel with a framed image on the left, light paper
 * with the story on the right. Same pattern as the Lara / David sections.
 * Copy unchanged (WHAT_IF). Suppressed when the achievable gain is ≤ 0.
 */
export default function WhatIfYouDid({ result }) {
  if (!(result.capped.achievableGain > 0)) return null;
  const c = WHAT_IF;
  // the body's second sentence carries the result, set bold like the
  // reference's bold line
  const boldLine = c.golfBody.slice(c.golfBody.indexOf('They also'));
  return (
    <section className="rwi">
      <div className="rwi__media">
        {/* name + type under the image as plain white lines, like Lara's
            and David's titles (user, Oct 30) */}
        {GOLF_IMAGE ? (
          <TitledPortrait
            src={GOLF_IMAGE}
            alt={`${c.golfName} founders`}
            width="1000"
            height="890"
            title={[c.golfName, c.golfType]}
            inset={GOLF_INSET}
            className="rwi__golf"
          />
        ) : (
          <div className="rwi__frame">
            <span className="rwi__logo-disc">
              <img src="/assets/results-golfbays-icon.png" alt={c.golfName} width="720" height="720" />
            </span>
          </div>
        )}
      </div>

      <div className="rwi__copy">
        <div className="rwi__copy-inner">
          <h2 className="rwi__head">
            {c.golfHead.map((seg) => (
              <span key={seg.t} className={seg.hl ? 'rwi__hl' : undefined}>
                {seg.t}
              </span>
            ))}
          </h2>
          <p className="rwi__body">{emphasize(c.golfBody, [boldLine])}</p>
          {/* the bar only shows with the logo fallback, which has no title */}
          {!GOLF_IMAGE && (
            <p className="rwi__chip">
              <strong>{c.golfName}</strong>
              <span>{c.golfType}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
