import { RESULT_BLOCKS } from '../copy.js';
import { fill } from '../resolveTokens.js';
import { ga } from '../../analytics/ga.js';
import './ResultBlocks.css';

/**
 * The doc's conditional result blocks (Quiz Logics.docx · Results-page logic).
 * Every taker gets a different read depending on their own numbers.
 *
 * These land in TWO places, per the blue boxes in Result Page Copy.docx:
 *
 *   slot="split"   Blocks 1–3 (revenue split / low share / no email).
 *                  Copy doc box: "Block 3 — No email marketing … See Logic Doc
 *                  Blocks 1–3 for the revenue-split copy that renders here",
 *                  sitting after "They're still sitting in your ecosystem…"
 *                  and before "This is where Compounding Revenue Per
 *                  Subscriber™ comes in."
 *
 *   slot="capped"  Blocks 4–7 (the capped-state outcome).
 *                  Copy doc box: "Blocks 4–7 — Capped-state outcomes",
 *                  sitting straight after the metric table and before
 *                  "You can stop at $1.5M."
 *
 * NOTE: Quiz Logics.docx lists these as one run (table → 1 → 2/3 → 4–7). The
 * copy doc places them apart on the real page; its positions win because it is
 * the page layout. FLAGGED.
 *
 * Block 4 renders nothing by design — the doc says "standard results page, no
 * capped-state copy".
 *
 * All copy is verbatim from the doc; the only judgement here is which block
 * fires, and that comes straight off the calculator.
 */
export default function ResultBlocks({ result, tokens, slot }) {
  const b = RESULT_BLOCKS;

  // Block 2 is suppressed when 3 or 7 fires; 3 suppresses 2 (doc triggers).
  const showBlock3 = result.noEmail;
  const showBlock2 = result.lowPathShare && !showBlock3 && result.cappedBlock !== 7;

  const capped = result.cappedBlock;
  // Doc guard style: drop the sentence naming a value that resolved to zero.
  // Fires when maxing the metrics already clears $1.5M, so there is no gap.
  const showGapSentence = capped === 5 && !result.capped.gapClosedByMetrics;

  // Yemi ruling (2026-09-15, Q5): a true share under 2.5% rounds to 0, so
  // Block 1 switches to the "less than 5%" wording instead of "Around 0%".
  // round5 sends exactly the raw values below 2.5 to 0, so the rounded
  // figure being under 5 is the same condition.
  const tinyShare = result.block1.emailPercentage < 5;

  if (slot === 'split') {
    if (result.block1.splitSuppressed && !showBlock2 && !showBlock3) return null;
    const b1 = tinyShare ? b.block1Small : b.block1;
    return (
      <section className="rsb">
        {!result.block1.splitSuppressed && (
          <>
            <p className="rsb__head">{fill(b1.head, tokens)}</p>
            <p className="rsb__intro">{b.splitIntro}</p>
            <ul className="rsb__cards">
              {b.splitChannels.map((ch) => (
                <li className="rsb__card" key={ch}>
                  <img
                    className="rsb__tick"
                    src="/assets/results-tick-circle.png"
                    alt=""
                    aria-hidden="true"
                    width="160"
                    height="148"
                  />
                  {ch}
                </li>
              ))}
            </ul>
            <p className="rsb__foot">{fill(b1.foot, tokens)}</p>
          </>
        )}
        {/* Blocks 2/3 have no design reference yet — restrained outline note
            in the card language, FLAGGED as dev-styled. */}
        {showBlock3 && <p className="rsb__note">{b.block3}</p>}
        {showBlock2 && <p className="rsb__note">{b.block2}</p>}
      </section>
    );
  }

  if (capped === 4) return null;

  // Blocks 5–7 share one card design (reference 2026-09-15): white card in a
  // plum keyline on the paper texture, playful badge on the seam, copy left
  // with the workshop CTA, the workshop-laptop mockup right.
  const c = capped === 5 ? b.block5 : capped === 6 ? b.block6 : b.block7;

  return (
    <section className="rcb">
      <img
        className="rcb__badge"
        src="/assets/results-badge-playful-2x.png"
        alt=""
        aria-hidden="true"
        width="804"
        height="805"
      />

      <div className="rcb__card">
        <div className="rcb__copy">
          <p className="rcb__p">
            {fill(c.leadBefore, tokens)}
            {c.leadBold ? <strong>{fill(c.leadBold, tokens)}</strong> : null}
            {c.leadAfter}
          </p>

          {capped === 5 && showGapSentence && (
            <>
              <h3 className="rcb__head">{fill(c.gapHead, tokens)}</h3>
              <p className="rcb__p">{fill(c.gapBody, tokens)}</p>
            </>
          )}

          <p className="rcb__p">{c.tail}</p>
          <p className="rcb__q">{c.question}</p>

          {/* TODO: real workshop URL when provided (same as NAV). */}
          <a className="q-btn rcb__btn" href="#" onClick={() => ga.ctaClick('watch_workshop')}>
            {c.cta}
          </a>
        </div>

        <div className="rcb__media">
          <img
            src="/assets/results-workshop-laptop.webp"
            alt="The workshop playing on a laptop"
            width="827"
            height="564"
          />
        </div>
      </div>
    </section>
  );
}
