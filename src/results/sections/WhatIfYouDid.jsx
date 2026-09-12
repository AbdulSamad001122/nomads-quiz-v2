import { WHAT_IF } from '../copy.js';
import './WhatIfYouDid.css';

/**
 * Section — "But… what if you did?" (copy doc row 1, after the RPV-lift
 * banner). Stone band handing off to white: plum kicker, 3-line headline
 * with the taker's max-benchmark gain, the plum torn "Yep, With The Same
 * Traffic!" banner (image 54), the workshop note, then the GolfBays proof
 * card straddling the seam with its gradient backdrop and logo lockup
 * (image 23).
 * Suppressed when the achievable gain is ≤ 0 (Logic Doc guard: never show
 * a sentence built on a zero gain).
 */
export default function WhatIfYouDid({ result, tokens }) {
  if (!(result.capped.achievableGain > 0)) return null;
  const c = WHAT_IF;
  return (
    <section className="rwi">
      <div className="rwi__band" aria-hidden="true" />
      <div className="rwi__inner">
        <p className="rwi__kicker">{c.kicker}</p>
        <h2 className="rwi__headline">
          {c.headLine1}{' '}
          <br />
          {c.headLine2}{' '}
          <br />
          {c.headLine3Before} <span className="rwi__gain">{tokens.achievable_gain}</span>
          {c.headLine3After}
        </h2>
        <p className="rwi__banner">
          <span>{c.banner}</span>
        </p>
        <p className="rwi__note">{c.note}</p>
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
