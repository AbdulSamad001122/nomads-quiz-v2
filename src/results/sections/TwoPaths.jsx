import { TWO_PATHS, CTA } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './TwoPaths.css';

const brJoin = (lines, bold) =>
  lines.map((line, i) => (
    <span key={line.slice(0, 14)}>
      {bold ? emphasize(line, bold) : line}
      {i < lines.length - 1 ? ' ' : ''}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));

/**
 * Section — the two-paths closing panel (copy doc row 10 tail). Since QC
 * row 4 the quote, fork and path cards live in SeeHowItShowsUp; this is the
 * plum-bordered panel that rides up over that section's bottom seam into
 * the cream footer: closing copy, workshop/call heading and the two
 * hard-shadow CTAs beside the founder photo.
 */
export default function TwoPaths() {
  const c = TWO_PATHS;
  return (
    <section className="rtp">
      <div className="rtp__panel">
        <div className="rtp__panel-copy">
          <p className="rtp__p">{brJoin(c.panelP1Lines, c.panelBold)}</p>
          <h3 className="rtp__panel-heading">{brJoin(c.panelHeadingLines)}</h3>
          <p className="rtp__p rtp__panel-sub">{brJoin(c.panelSubLines)}</p>
          <div className="rtp__btns">
            {/* TODO: real workshop URL when provided (same as NAV). Booking
                URL live (Yemi, Sep 19); new tab keeps the result page. */}
            <a className="rtp__btn" href={CTA.workshop.href} target="_blank" rel="noopener" onClick={() => ga.ctaClick('watch_workshop')}>
              {c.btnWorkshop}
            </a>
            <a
              className="rtp__btn"
              href="https://tidycal.com/alefiya/crpv-game-plan-call"
              target="_blank"
              rel="noopener"
              onClick={() => ga.ctaClick('book_call')}
            >
              {c.btnCall}
            </a>
          </div>
        </div>
        <div className="rtp__panel-photo">
          <img src="/assets/results-fork-photo.webp" alt="Alefiya in a rattan chair" width="2515" height="3793" />
        </div>
      </div>

    </section>
  );
}
