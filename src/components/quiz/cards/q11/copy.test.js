/**
 * Q11 card copy is verbatim from Yemi's HTML — run with:
 *   node src/components/quiz/cards/q11/copy.test.js
 * (The HTML lives in the git-ignored "Quiz Questions and logic" folder; the
 * check is skipped where it isn't present.)
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const html = (() => {
  try {
    return readFileSync(new URL('../../../../../Quiz Questions and logic/Update Slide Html ( 20 OCT )/Q11 One Table.html', import.meta.url), 'utf8');
  } catch {
    return null;
  }
})();
if (!html) {
  console.log('q11: reference HTML not found — check skipped');
} else {
  const ref = JSON.parse(html.match(/<script type="application\/json" id="card-copy"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const copy = JSON.parse(readFileSync(new URL('./copy.json', import.meta.url), 'utf8'));
  assert.deepStrictEqual(copy, ref, 'copy.json differs from the HTML card');
  console.log('q11: copy identical to the HTML card ✓');
}
