/**
 * Q12A card copy is verbatim from Yemi's two HTML cards — run with:
 *   node src/components/quiz/cards/q12a/copy.test.js
 * (The HTMLs live in the git-ignored "Quiz Questions and logic" folder; the
 * check is skipped where they aren't present.)
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

for (const [file, json] of [
  ['Q12A SLG Calls Constraint.html', './copy-slg.json'],
  ['Q12A PLG Buyers Constraint.html', './copy-plg.json'],
]) {
  let html = null;
  try {
    html = readFileSync(new URL(`../../../../../Quiz Questions and logic/Update Slide Html ( 20 OCT )/${file}`, import.meta.url), 'utf8');
  } catch {
    console.log(`q12a: ${file} not found — check skipped`);
    continue;
  }
  const ref = JSON.parse(html.match(/<script type="application\/json" id="card-copy"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const copy = JSON.parse(readFileSync(new URL(json, import.meta.url), 'utf8'));
  assert.deepStrictEqual(copy, ref, `${json} differs from ${file}`);
  console.log(`q12a: ${json} identical to ${file} ✓`);
}
