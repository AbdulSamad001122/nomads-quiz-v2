import { SAME_PROBLEM } from '../copy.js';
import './SameProblemIntro.css';

/**
 * Section — "Here are variations of the same problem…" (copy doc row 10,
 * intro band). Steel-blue paper section with keyline frame, plum
 * "See How It Shows Up ↓" ribbon straddling the top seam, faint brush-script
 * "8 figures" watermark, the four-founder avatar strip, and a 3-line centered
 * headline with the ice "same problem" highlight.
 * The doc's "Perhaps you can relate?" + quote cards are the next slice of
 * this row — separate build when their reference arrives.
 */
export default function SameProblemIntro() {
  return (
    <section className="rsp">
      <div className="rsp__keyline" aria-hidden="true" />
      <p className="rsp__ribbon">
        <span className="rsp__ribbon-text">{SAME_PROBLEM.ribbon}</span>
      </p>
      <img
        className="rsp__avatars"
        src="/assets/results-relate-avatars.png"
        alt=""
        width="408"
        height="110"
      />
      <h2 className="rsp__headline">
        {SAME_PROBLEM.l1Before}{' '}
        <span className="rsp__script">{SAME_PROBLEM.l1ScriptGlyph}</span>
        {SAME_PROBLEM.l1ScriptRest} {SAME_PROBLEM.l1After}{' '}
        <span className="rsp__hl">{SAME_PROBLEM.l1Highlight}</span>{' '}
        <br />
        {SAME_PROBLEM.line2}{' '}
        <br />
        {SAME_PROBLEM.line3}
      </h2>
    </section>
  );
}
