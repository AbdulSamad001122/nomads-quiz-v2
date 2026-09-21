import { TWO_PATHS } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import TidyCalEmbed from './TidyCalEmbed.jsx';
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
 * Section — "So there's a fork here." closer (copy doc row 10 tail).
 * Dark maroon-crumple band: fork badge on the seam, mono TWO PATHS chip,
 * the quoted "$357,000" headline with cream highlight, the fork chip and
 * the two path cards joined by the plum "Or" badge. A plum-bordered panel
 * straddles into the cream footer: closing copy, workshop/call heading and
 * the two hard-shadow CTAs beside the founder photo.
 */
export default function TwoPaths() {
  const c = TWO_PATHS;
  return (
    <section className="rtp">
      <div className="rtp__dark">
        <span className="rtp__badge" aria-hidden="true">
          <img src="/assets/results-fork-badge-text.png" alt="" width="1024" height="1024" />
        </span>
        <div className="rtp__inner">
          <p className="rtp__label">TWO PATHS</p>
          <p className="rtp__intro">{c.intro}</p>
          <h2 className="rtp__headline">
            {brJoin(c.headlineLines)}{' '}
            <br />
            {c.headlineTail} <span className="rtp__hl">{c.headlineHl}</span>
          </h2>
        </div>
        <p className="rtp__fork-chip">{c.forkChip}</p>
        <div className="rtp__paths">
          <div className="rtp__path rtp__path--cream">
            <img
              className="rtp__path-img"
              src="/assets/results-fork-megaphone.png"
              alt=""
              width="838"
              height="838"
            />
            <p>{c.pathA}</p>
          </div>
          <span className="rtp__or" aria-hidden="true">Or</span>
          <div className="rtp__path rtp__path--mauve">
            <span className="rtp__path-icon">
              <img src="/assets/results-fork-coins.png" alt="" width="830" height="830" />
            </span>
            <p>{c.pathB}</p>
          </div>
        </div>
      </div>
      <div className="rtp__panel">
        <div className="rtp__panel-copy">
          <p className="rtp__p">{brJoin(c.panelP1Lines, c.panelBold)}</p>
          <h3 className="rtp__panel-heading">{brJoin(c.panelHeadingLines)}</h3>
          <p className="rtp__p rtp__panel-sub">{brJoin(c.panelSubLines)}</p>
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

      {/* live TidyCal at the section foot — same widget as the game-plan
          sections, so the fork's "book the call" path ends on a calendar the
          taker can use right here */}
      <div className="rtp__calendar">
        <TidyCalEmbed />
      </div>
    </section>
  );
}
