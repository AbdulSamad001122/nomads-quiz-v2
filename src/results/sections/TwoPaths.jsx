import { TWO_PATHS } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './TwoPaths.css';

/* Each copy block flows as one run of text: no forced line breaks (standing
   rule — they stranded "numbers" on its own line at ~860–1200px). The
   design's desktop lines come from the column widths in TwoPaths.css. */
const flow = (lines, bold) => {
  // the last two words stay together, so no line ends on a lone word
  const text = lines.join(' ').replace(/ (\S+)$/, '\u00a0$1');
  return bold ? emphasize(text, bold) : text;
};

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
          <p className="rtp__p">{flow(c.panelP1Lines, c.panelBold)}</p>
          <h3 className="rtp__panel-heading">{flow(c.panelHeadingLines)}</h3>
          <p className="rtp__p rtp__panel-sub">{flow(c.panelSubLines)}</p>
          <div className="rtp__btns">
            {/* TODO: real workshop URL when provided (same as NAV). Booking
                URL live (Yemi, Sep 19); new tab keeps the result page. */}
            <a className="rtp__btn" href="#" onClick={() => ga.ctaClick('watch_workshop')}>
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
