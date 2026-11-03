/**
 * Q5B card copy is verbatim from Yemi's HTML — run with:
 *   node src/components/quiz/cards/q5b/copy.test.js
 * (The HTML lives in the git-ignored "Quiz Questions and logic" folder; the
 * check is skipped where it isn't present.)
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const html = (() => {
  try {
    return readFileSync(new URL('../../../../../Quiz Questions and logic/Update Slide Html ( 20 OCT )/Q5B Email List Card.html', import.meta.url), 'utf8');
  } catch {
    return null;
  }
})();
if (!html) {
  console.log('q5b: reference HTML not found — check skipped');
} else {
  const ref = JSON.parse(html.match(/<script type="application\/json" id="card-copy"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const copy = JSON.parse(readFileSync(new URL('./copy.json', import.meta.url), 'utf8'));
  // Quiz QC Oct 31 (Yemi, Nov 3: change every "quiz takers" in the quiz):
  // "Conversion Quiz™ takers".
  ref.services_mcap = ref.services_mcap.replace('of quiz-takers', 'of Conversion Quiz™ takers');
  assert.deepStrictEqual(copy, ref, 'copy.json differs from the HTML card');
  console.log('q5b: copy identical to the HTML card ✓');
}
