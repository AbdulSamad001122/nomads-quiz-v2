import { WORKSHOP_INVITE } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import './WorkshopInvite.css';

const brJoin = (lines) =>
  lines.map((line, i) => (
    <span key={line.slice(0, 14)}>
      {line}
      {i < lines.length - 1 ? ' ' : ''}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));

/**
 * Section — "Because… revenue rarely scales…" → workshop invite (copy doc
 * rows 2–3, between "Here's what it took us…" and the game-plan CTA).
 * One keyline-framed block: a navy→maroon crumple band with the isolated-
 * channels copy and the "revenue growth" highlight headline, the plum
 * "See What's Working" stamp on the seam, then the white half with the
 * pen-and-paper invite (live RPV tokens), the Watch the Workshop button
 * and the clickable thumbnail placeholder.
 */
export default function WorkshopInvite({ tokens }) {
  const c = WORKSHOP_INVITE;
  return (
    <section className="rwk">
      <div className="rwk__frame" aria-hidden="true" />
      <div className="rwk__dark">
        <div className="rwk__col">
          <p className="rwk__because">{c.because}</p>
          <p className="rwk__p">{brJoin(c.mostLines)}</p>
          <h2 className="rwk__headline">
            {brJoin(c.headLines)}{' '}
            <br />
            <span className="rwk__hl">{c.headHl}</span> {c.headTail}
          </h2>
          <p className="rwk__p">{brJoin(c.beforeLines)}</p>
        </div>
        <img
          className="rwk__badge"
          src="/assets/results-badge-see-working.png"
          alt=""
          aria-hidden="true"
          width="860"
          height="860"
        />
      </div>
      <div className="rwk__light">
        <div className="rwk__invite">
          <p className="rwk__p rwk__p--dark">
            {c.grabBefore}{' '}
            <br />
            {c.grabMid1} {tokens.current_rpv} {c.grabMid2}{' '}
            <br />
            {tokens.goal_rpv} {c.grabAfter}
          </p>
          {/* TODO: real workshop URL when provided (same as NAV). */}
          <a className="rwk__btn" href="#" onClick={() => ga.ctaClick('watch_workshop')}>
            {c.button}
          </a>
        </div>
        {/* TODO: swap for the clickable workshop thumbnail when the asset lands. */}
        <a
          className="rwk__thumb"
          href="#"
          aria-label="Watch the workshop"
          onClick={() => ga.ctaClick('watch_workshop')}
        >
          <span>{c.thumbPlaceholder}</span>
        </a>
      </div>
    </section>
  );
}
