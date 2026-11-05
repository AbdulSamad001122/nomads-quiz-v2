import { TWO_PATHS, CTA, FINAL_FRAME } from '../copy.js';
import TidyCalEmbed from './TidyCalEmbed.jsx';
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
 * hard-shadow CTAs beside the workshop thumbnail (placeholder for now),
 * then the booking calendar in the same section (2.0 FINAL RP QC #17).
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
        {/* 2.0 FINAL RP QC #17 (Yemi, Nov 5): "Remove Alefiya's photo and
            replace it with the thumbnail". The thumbnail isn't final, so a
            marked placeholder holds its place until it arrives. */}
        <div className="rtp__panel-thumb">
          <a
            className="rtp__thumb"
            href={CTA.workshop.href}
            target="_blank"
            rel="noopener"
            onClick={() => ga.ctaClick('watch_workshop')}
            aria-label={FINAL_FRAME.thumbAlt}
          >
            {FINAL_FRAME.thumbPlaceholder || !FINAL_FRAME.thumbSrc ? (
              <span className="rtp__thumb-ph">
                <span className="rtp__thumb-play" aria-hidden="true" />
                <span className="rtp__thumb-label">{FINAL_FRAME.thumbLabel}</span>
                <span className="rtp__thumb-note">{FINAL_FRAME.thumbNote}</span>
              </span>
            ) : (
              <img src={FINAL_FRAME.thumbSrc} alt="" width="1280" height="720" loading="lazy" />
            )}
          </a>
        </div>
      </div>

      {/* "…and move the calendar up into the same section" (Yemi, Nov 5):
          the booking calendar sits under the frame, part of this section */}
      <div className="rtp__cal">
        <TidyCalEmbed />
      </div>

    </section>
  );
}
