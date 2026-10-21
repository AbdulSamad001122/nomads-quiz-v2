/**
 * Q4 benchmark card (shown after Q4, before Q5).
 *
 * Copy and figures are verbatim from Yemi's "Q4 Benchmark SLG.html" and
 * "Q4 Benchmark PLG.html" (#card-copy JSON, Slack thread Oct 20), the source
 * of truth for this slide. Both files carry the same JSON: `shared` copy plus
 * an `slg` and a `plg` block; they differ only in which block they show.
 * Q4 options 1, 3, 4 get SLG; option 2 gets PLG.
 *
 * Markers inside copy strings, as in the source file:
 *   {{text}} = optimised (green)   [[text]] = typical (red)
 *
 * The counts, revenue, gap, totals and the "×" multiple are calculated from
 * visitors, the rates and deal_value (the file's dev notes: "never hardcode
 * them"), using the same rounding as the file's calcText().
 */

export const BENCHMARK_COPY = {
  shared: {
    myth_lead: 'Most growth advice says:',
    myth_struck: 'get more visitors.',
    headline: 'Same 10,000 visitors a month.',
    headline_payoff: '$1.5M+ more a year.',
    context:
      "Two businesses get the same traffic and spend the same on ads. The {{optimised}} one has improved every step of the customer journey. The [[typical]] one hasn't.",
    table_heading: 'Each month',
    label_typical: 'Typical',
    label_optimised: 'Optimised',
    gap_month_suffix: 'a month from the same 10,000 visitors',
    gap_year_suffix: 'a year, same visitors',
    year_sentence_a: "Typically, you'd earn around",
    year_sentence_b: 'a year. Optimise every step, and you add',
    year_sentence_c: 'on top, from the same visitors.',
    next: "The next few questions use your own numbers to show which steps you'd optimise to add $1.5M a year from the visitors you already have.",
    cta: 'Show me how I can add $1.5M with my existing traffic',
    up_next: 'Next: the #1 constraint between you and that $1.5M',
    /* tap/click hints belong to the file's multi-screen "paced" mode, which
       this slide doesn't use (the file ships LAYOUT = "single") */
    tap_hint: 'Tap to continue',
    click_hint: 'Click to continue',
    back: 'Back',
    source_q: 'Where do these numbers come from?',
    source_text:
      '{{Optimised:}} the average across our client projects using the Compounding Revenue Per Visitor™ OS.\n[[Typical:]] [add source]',
  },
  slg: {
    visitors: 10000,
    deal_value: 2500,
    rows: [
      {
        label: 'Opt-in rate',
        sub: 'Visitors who join your email list',
        unit: '',
        typical_rate: 20,
        optimised_rate: 35,
      },
      {
        label: 'Lead conversion rate',
        sub: 'Subscribers who book a sales call',
        unit: 'calls',
        typical_rate: 1.5,
        optimised_rate: 3.5,
      },
      {
        label: 'Close rate',
        sub: 'Calls that become clients',
        unit: 'clients',
        typical_rate: 22.5,
        optimised_rate: 50,
      },
    ],
    revenue_label: 'Monthly revenue',
    revenue_sub: 'at a $2.5K average deal size',
  },
  plg: {
    visitors: 10000,
    deal_value: 1400,
    rows: [
      {
        label: 'Opt-in rate',
        sub: 'Visitors who join your email list',
        unit: '',
        typical_rate: 20,
        optimised_rate: 35,
      },
      {
        label: 'Purchase rate',
        sub: 'Subscribers who buy within 14 days',
        unit: 'sales',
        typical_rate: 1.5,
        optimised_rate: 3.5,
      },
    ],
    revenue_label: 'Monthly revenue',
    revenue_sub: 'at a $1,400 average order',
  },
};

const fmtInt = (n) => n.toLocaleString('en-US');
export const rateText = (r) => (Math.round(r * 10) / 10).toString().replace(/\.0$/, '');
const money = (n) => '$' + (Math.round(n / 100) * 100).toLocaleString('en-US');
const yearly = (n) =>
  n >= 1e6 ? '$' + Math.round(n / 1e4) / 100 + 'M' : '$' + Math.round(n / 1000) + 'K';
/* The yearly gain always shows as the same half-million floor ($1.5M+), so
   the card never shows two different millions. */
const halfFloor = (n) => '$' + (Math.floor(n / 5e5) * 0.5).toFixed(1) + 'M+';

/**
 * Every calculated figure on the card for one version ('slg' | 'plg').
 * Counts round to whole people at each step so every figure multiplies out.
 */
export function benchmarkFigures(mode) {
  const c = BENCHMARK_COPY[mode];
  let typ = c.visitors;
  let opt = c.visitors;
  const counts = c.rows.map((r) => {
    typ = Math.round((typ * r.typical_rate) / 100);
    opt = Math.round((opt * r.optimised_rate) / 100);
    return { typical: fmtInt(typ), optimised: fmtInt(opt) };
  });
  const tRev = typ * c.deal_value;
  const oRev = opt * c.deal_value;
  const gap = oRev - tRev;
  return {
    counts,
    revTypical: money(tRev),
    revOptimised: money(oRev),
    gapMonth: '+' + money(gap),
    gapYear: '+' + halfFloor(gap * 12),
    gapYearPlain: halfFloor(gap * 12),
    multiple: (tRev ? (oRev / tRev).toFixed(1).replace(/\.0$/, '') : '0') + '×',
    totalTypical: money(tRev * 12),
    totalOptimised: yearly(oRev * 12),
  };
}

/**
 * Splits copy with {{optimised}} / [[typical]] markers into parts:
 * [{ t: 'text', tone: null | 'o' | 't' }].
 */
export function toneParts(text) {
  const parts = [];
  const re = /\{\{(.+?)\}\}|\[\[(.+?)\]\]/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index), tone: null });
    parts.push(m[1] != null ? { t: m[1], tone: 'o' } : { t: m[2], tone: 't' });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ t: text.slice(last), tone: null });
  return parts;
}
