/**
 * CALC card copy is verbatim from Yemi's HTML — run with:
 *   node src/components/quiz/cards/calc/copy.test.js
 * (The HTML lives in the git-ignored "Quiz Questions and logic" folder; the
 * check is skipped where it isn't present.)
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const html = (() => {
  try {
    return readFileSync(new URL('../../../../../Quiz Questions and logic/Update Slide Html ( 20 OCT )/Calculator Intro (after Q5 case studies).html', import.meta.url), 'utf8');
  } catch {
    return null;
  }
})();
if (!html) {
  console.log('calc: reference HTML not found — check skipped');
} else {
  const ref = JSON.parse(html.match(/<script type="application\/json" id="card-copy"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const copy = JSON.parse(readFileSync(new URL('./copy.json', import.meta.url), 'utf8'));
  // Quiz QC Oct 31 (doc row 4; user, Nov 2): the "$1.5M" promise became three lines —
  // an intended difference from the HTML card.
  delete ref.pr;
  ref.pr_1 = 'So you can see where the opportunity lies to';
  ref.pr_v = 'ADD $1.5M + In annual revenue';
  ref.pr_2 = 'from the visitors you’re already attracting, without increasing your marketing spend.';
  // Quiz QC Oct 31 (Yemi, Nov 2): the card moved after Q7A, so its
  // "Next question:" line follows. The quiz fills in the real next question
  // (Q7B or Q8); copy.json keeps Q8's, the one most takers see.
  ref.up_next = 'Next question: Out of everyone discovering your business each month, how many are becoming new email subscribers?';
  assert.deepStrictEqual(copy, ref, 'copy.json differs from the HTML card');
  console.log('calc: copy identical to the HTML card ✓');
}
