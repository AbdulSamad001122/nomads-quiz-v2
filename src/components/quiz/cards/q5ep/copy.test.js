/**
 * Q5EP card copy is verbatim from Yemi's HTML — run with:
 *   node src/components/quiz/cards/q5ep/copy.test.js
 * (The HTML lives in the git-ignored "Quiz Questions and logic" folder; the
 * check is skipped where it isn't present.)
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const html = (() => {
  try {
    return readFileSync(new URL('../../../../../Quiz Questions and logic/Update Slide Html ( 20 OCT )/Q5E PLG Abandonment Card.html', import.meta.url), 'utf8');
  } catch {
    return null;
  }
})();
if (!html) {
  console.log('q5ep: reference HTML not found — check skipped');
} else {
  const ref = JSON.parse(html.match(/<script type="application\/json" id="card-copy"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const copy = JSON.parse(readFileSync(new URL('./copy.json', import.meta.url), 'utf8'));
  // Quiz QC Oct 31 (Yemi, Nov 3: change every "quiz takers" in the quiz):
  // "Conversion Quiz™ takers".
  ref.after_sub = ref.after_sub.replace(/^quiz takers/, 'Conversion Quiz™ takers');
  // Alefiya (doc comment, Nov 3): "with *a* reason to buy".
  ref.t2 = ref.t2.replace('with the reason', 'with a reason');
  assert.deepStrictEqual(copy, ref, 'copy.json differs from the HTML card');
  console.log('q5ep: copy identical to the HTML card ✓');
}
