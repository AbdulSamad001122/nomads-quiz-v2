import { RESULT_BLOCKS } from '../copy.js';
import { fill } from '../resolveTokens.js';
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
    return (
      <section className="rbk">
        <div className="rbk__inner">
          {!result.block1.splitSuppressed && (
            <p className="rbk__para">
              {fill(tinyShare ? b.block1Small : b.block1, tokens)}
            </p>
          )}
          {showBlock3 && <p className="rbk__para rbk__para--note">{b.block3}</p>}
          {showBlock2 && <p className="rbk__para rbk__para--note">{b.block2}</p>}
        </div>
      </section>
    );
  }

  if (capped === 4) return null;

  return (
    <section className="rbk">
      <div className="rbk__inner">
        {capped === 5 && (
          <div className="rbk__capped">
            <p className="rbk__para">{fill(b.block5.lead, tokens)}</p>
            {showGapSentence && <p className="rbk__para">{fill(b.block5.gap, tokens)}</p>}
            <p className="rbk__para">{b.block5.tail}</p>
            <a className="rbk__cta" href="#">
              {b.block5.cta}
            </a>
          </div>
        )}

        {capped === 6 && (
          <div className="rbk__capped">
            <p className="rbk__para">{fill(b.block6.lead, tokens)}</p>
            <p className="rbk__para">{b.block6.tail}</p>
            <a className="rbk__cta" href="#">
              {b.block6.cta}
            </a>
          </div>
        )}

        {capped === 7 && (
          <div className="rbk__capped">
            <p className="rbk__para">{b.block7.lead}</p>
            <p className="rbk__para">{b.block7.tail}</p>
            <a className="rbk__cta" href="#">
              {b.block7.cta}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
