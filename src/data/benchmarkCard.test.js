/**
 * Q4 benchmark card figures — run with:  node src/data/benchmarkCard.test.js
 * Expected values are what Yemi's "Q4 Benchmark SLG.html" renders.
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { BENCHMARK_COPY, benchmarkFigures, toneParts, sourceLines } from './benchmarkCard.js';

let passed = 0;
const eq = (actual, expected, label) => {
  assert.deepStrictEqual(actual, expected, `${label}\n  got: ${JSON.stringify(actual)}\n  want: ${JSON.stringify(expected)}`);
  passed += 1;
};

/* ---------- SLG: the figures on the reference render ---------- */
const slg = benchmarkFigures('slg');
eq(slg.counts, [
  { typical: '2,000', optimised: '3,500' },
  { typical: '30', optimised: '123' },
  { typical: '7', optimised: '62' },
], 'SLG step counts');
eq(slg.revTypical, '$17,500', 'SLG typical monthly revenue');
eq(slg.revOptimised, '$155,000', 'SLG optimised monthly revenue');
eq(slg.gapMonth, '+$137,500', 'SLG monthly gap');
eq(slg.gapYear, '+$1.5M+', 'SLG yearly gap');
eq(slg.gapYearPlain, '$1.5M+', 'SLG yearly gap in the sentence');
eq(slg.multiple, '8.9×', 'SLG multiple');
eq(slg.totalTypical, '$210,000', 'SLG typical yearly revenue');

/* ---------- PLG: same maths over the file's plg block ---------- */
const plg = benchmarkFigures('plg');
eq(plg.counts, [
  { typical: '2,000', optimised: '3,500' },
  { typical: '30', optimised: '123' },
], 'PLG step counts');
eq(plg.revTypical, '$42,000', 'PLG typical monthly revenue');
eq(plg.revOptimised, '$172,200', 'PLG optimised monthly revenue');
eq(plg.gapMonth, '+$130,200', 'PLG monthly gap');
eq(plg.gapYear, '+$1.5M+', 'PLG yearly gap');
eq(plg.multiple, '4.1×', 'PLG multiple');
eq(plg.totalTypical, '$504,000', 'PLG typical yearly revenue');

/* ---------- copy helpers ---------- */
eq(toneParts(BENCHMARK_COPY.shared.context), [
  { t: 'Two businesses get the same traffic and spend the same on ads. The ', tone: null },
  { t: 'optimised', tone: 'o' },
  { t: ' one has improved every step of the customer journey. The ', tone: null },
  { t: 'typical', tone: 't' },
  { t: " one hasn't.", tone: null },
], 'context markers');
eq(sourceLines().length, 1, 'placeholder "Typical: [add source]" line held back');
eq(toneParts(sourceLines()[0])[0], { t: 'Optimised:', tone: 'o' }, 'source line marker');

/* ---------- copy is verbatim from the HTML's #card-copy block ---------- */
const htmlPath = new URL('../../Quiz Questions and logic/Update Slide Html ( 20 OCT )/Q4 Benchmark SLG.html', import.meta.url);
let html = null;
try {
  html = readFileSync(htmlPath, 'utf8');
} catch {
  console.log('(reference HTML not found — verbatim check skipped)');
}
if (html) {
  const json = html.match(/<script type="application\/json" id="card-copy"[^>]*>([\s\S]*?)<\/script>/)[1];
  eq(BENCHMARK_COPY, JSON.parse(json), 'copy + figures identical to the reference file');
}

console.log(`benchmarkCard: all ${passed} checks passed ✓`);
