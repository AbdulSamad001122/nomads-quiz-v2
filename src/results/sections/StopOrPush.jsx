import { STOP_OR_PUSH } from '../copy.js';
import './StopOrPush.css';

/**
 * Section — "You can stop at $1.5M. or push all 5 metrics to their max."
 * (copy doc row 1, straight after the metric table). Dark maroon-crumple
 * band with a white keyline frame, the "Playful, yet highly profitable"
 * compass stamp straddling the top-left seam, and the centred RPV-lift
 * headline: the taker's current RPV in a white box → goal RPV in a plum
 * box, then the "$1.5M/year ($125K/mo)" line and two body lines.
 */
export default function StopOrPush({ tokens }) {
  const c = STOP_OR_PUSH;
  return (
    <section className="rso">
      <div className="rso__keyline" aria-hidden="true" />
      <span className="rso__badge" aria-hidden="true">
        <img src="/assets/results-badge-playful-2x.png" alt="" width="800" height="800" />
      </span>
      <div className="rso__inner">
        <p className="rso__lead">{c.lead}</p>
        <h2 className="rso__headline">
          {c.headLine1}{' '}
          <br />
          {c.headLine2Before}{' '}
          <span className="rso__box rso__box--current">{tokens.current_rpv}</span>
          <span className="rso__arrow" aria-hidden="true">→</span>
          <span className="rso__box rso__box--goal">{tokens.goal_rpv}</span>{' '}
          <br />
          {c.headLine3}
        </h2>
        <p className="rso__body">
          {c.bodyLine1}{' '}
          <br />
          {c.bodyLine2}
        </p>
      </div>
    </section>
  );
}
