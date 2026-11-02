/**
 * Q4 benchmark card figures — run with:  node src/data/benchmarkCard.test.js
 * Expected values are what Yemi's "Q4 Benchmark SLG.html" renders.
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { BENCHMARK_COPY, benchmarkFigures, toneParts } from './benchmarkCard.js';

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
eq(toneParts(BENCHMARK_COPY.shared.headline), [
  { t: 'What if you could add ', tone: null },
  { t: '$1.5M+ more a year', tone: 'o' },
  { t: ' from the same 10,000 visitors a month?', tone: null },
], 'headline (Quiz QC Oct 31): green "$1.5M+ more a year"');
eq(slg.multipleX, '8.9X', 'SLG multiple in the context sentence');
eq(plg.multipleX, '4.1X', 'PLG multiple in the context sentence');
eq(toneParts(BENCHMARK_COPY.shared.context.replace('{x}', slg.multipleX)), [
  { t: 'Two businesses get the same traffic and spend the same on ads. Yet one brings in 8.9X revenue. The ', tone: null },
  { t: 'optimised', tone: 'o' },
  { t: ' one has improved every step of the customer journey. The ', tone: null },
  { t: 'typical', tone: 't' },
  { t: " one hasn't.", tone: null },
], 'context markers');
eq(BENCHMARK_COPY.shared.source_text.split('\n').map((line) => toneParts(line)[0]), [
  { t: 'Optimised:', tone: 'o' },
  { t: 'Typical:', tone: 't' },
], 'source note: both lines, as the card shows them');

/* ---------- copy is verbatim from both HTMLs' #card-copy blocks, except the
   Quiz QC (Oct 31) headline/context/badge changes from Alefiya's doc + Loom ---------- */
const QC_OCT31 = {
  headline: BENCHMARK_COPY.shared.headline,
  context: BENCHMARK_COPY.shared.context,
  multiple_suffix: BENCHMARK_COPY.shared.multiple_suffix,
};
for (const file of ['Q4 Benchmark SLG.html', 'Q4 Benchmark PLG.html']) {
  const htmlPath = new URL(`../../Quiz Questions and logic/Update Slide Html ( 20 OCT )/${file}`, import.meta.url);
  let html = null;
  try {
    html = readFileSync(htmlPath, 'utf8');
  } catch {
    console.log(`(${file} not found — verbatim check skipped)`);
  }
  if (html) {
    const json = html.match(/<script type="application\/json" id="card-copy"[^>]*>([\s\S]*?)<\/script>/)[1];
    const ref = JSON.parse(json);
    delete ref.shared.headline_payoff;
    Object.assign(ref.shared, QC_OCT31);
    eq(BENCHMARK_COPY, ref, `copy + figures identical to ${file} (plus the Oct 31 QC copy)`);
  }
}

console.log(`benchmarkCard: all ${passed} checks passed ✓`);
