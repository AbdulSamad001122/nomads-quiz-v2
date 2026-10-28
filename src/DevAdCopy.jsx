import { AD_SPEND, DATA_NERDS } from './results/copy.js';

/**
 * DEV ONLY — `?copy=ad` — the ad-spend module's full copy as a flat sheet,
 * read live from AD_SPEND in copy.js so it can never drift from the page.
 * For design work: every word, in page order, tagged with how it behaves.
 */
const TAGS = {
  static: { label: 'STATIC', bg: '#2e4d3f', note: 'same for everyone' },
  dynamic: { label: 'DYNAMIC', bg: '#274c66', note: 'number computed per person' },
  conditional: { label: 'CONDITIONAL', bg: '#5d1b4e', note: 'only some people see it' },
  dev: { label: 'DEV-ADDED', bg: '#6b4b13', note: 'not in the copy doc — written by dev, flagged' },
  conflict: { label: 'DOC CONFLICT', bg: '#7a1f1f', note: 'copy doc vs logic doc — awaiting Yemi' },
};

export default function DevAdCopy() {
  const c = AD_SPEND;

  const rows = [
    ['Chip (navy mono, uppercase)', c.chip, ['static']],
    ['Headline', c.headline, ['static']],
    ['Lede', c.lede, ['static']],
    ['Chips', `${c.spendChip} $17,500 · ${c.visitorsChip} 19,500 — each “${c.stays}”`, ['dynamic']],
    ['— SLIDER (renders only when Q7c was answered “Not sure”) —', null, null],
    ['Slider label', c.shareLabel, ['conditional', 'dev']],
    ['Slider value (top right)', '50%  → live, changes as they drag (10–100%)', ['conditional', 'dynamic']],
    ['Note under the slider', c.adjustNote, ['conditional', 'conflict']],
    ['— THE CHART (two bars on one scale) —', null, null],
    ['Chart heading', c.chartHead, ['static']],
    ['Dashed-line key', c.spendKey.replace('{{spend}}', '$17,500'), ['dynamic']],
    ['Bar 1', `${c.todayLabel} · ${c.roas.replace('{{x}}', '2.5')} · ${c.perVisitor.replace('{{rpv}}', '$2.25')}`, ['dynamic']],
    ['Bar 2', `${c.goalLabel} · ${c.roas.replace('{{x}}', '7.2')} · ${c.perVisitor.replace('{{rpv}}', '$6.42')}`, ['dynamic']],
    ['Verdict when ROAS < 1×', c.short, ['dynamic']],
    ['Verdict when ROAS ≥ 1×', c.back, ['dynamic']],
    ['Footer', c.foot, ['static']],
    ['— PLUM CARD —', null, null],
    ['Intro', c.payIntro, ['static']],
    ['Gain figure', '+$81,200  → computed per person', ['dynamic']],
    ['Under the figure', c.payGainSub, ['static']],
    ['Yearly chip', c.payYear.replace('{{year}}', '$974,400'), ['dynamic']],
    ['Working', c.payMath, ['dynamic']],
    ['Button', `${c.button} →`, ['static']],
    ['— “FOR THE DATA NERDS” (its own always-visible section below the module — renders for EVERYONE) —', null, null],
    ['Title', DATA_NERDS.title, ['static']],
    ['Paragraph 1', DATA_NERDS.p1, ['static']],
    ['Paragraph 2', DATA_NERDS.p2, ['static']],
    ['Channels row (plum swoosh bullets; the doc writes it as one sentence)', DATA_NERDS.channels.join('   ·   '), ['static']],
    ['Chip (plum band)', DATA_NERDS.chip, ['static']],
    ['Button', DATA_NERDS.button, ['static']],
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#152638',
        color: '#e4fbff',
        fontFamily: "'Roboto Mono', monospace",
        padding: '48px clamp(20px, 6vw, 80px)',
      }}
    >
      <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', margin: 0 }}>
        Ad-spend module — full copy sheet <span style={{ opacity: 0.5, fontSize: 14 }}>(dev harness — not shipped)</span>
      </h1>
      <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.8, maxWidth: 760 }}>
        Read live from AD_SPEND in copy.js, in page order — this sheet can’t drift from the real page.
        The whole module is hidden when Q7c was skipped (no paid ads). No copy ever swaps in this
        module — only the numbers change and whether the slider/section exist.
        See it rendered: <a href="/diagnostic-start-now?results=ad-fixed" style={{ color: '#e4fbff' }}>fixed share</a> ·{' '}
        <a href="/diagnostic-start-now?results=ad-slider" style={{ color: '#e4fbff' }}>with slider</a> ·{' '}
        <a href="/diagnostic-start-now?slides" style={{ color: '#e4fbff' }}>slide gallery</a>
      </p>
      <p style={{ fontSize: 12, opacity: 0.7, maxWidth: 760 }}>
        {Object.values(TAGS).map((t) => (
          <span key={t.label} style={{ marginRight: 16, whiteSpace: 'nowrap' }}>
            <span style={{ background: t.bg, color: '#fff', padding: '2px 8px', fontSize: 10.5 }}>{t.label}</span> {t.note}
          </span>
        ))}
      </p>

      <div style={{ marginTop: 26, maxWidth: 860 }}>
        {rows.map(([name, copy, tags], i) =>
          copy === null ? (
            <p key={i} style={{ margin: '30px 0 10px', fontSize: 13, color: '#cae1f4', fontWeight: 700 }}>{name}</p>
          ) : (
            <div key={i} style={{ borderLeft: '3px solid #38506b', padding: '8px 14px', margin: '10px 0', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>
                {name}
                {tags?.map((tg) => (
                  <span key={tg} style={{ background: TAGS[tg].bg, color: '#fff', padding: '1px 7px', fontSize: 10, marginLeft: 8 }}>
                    {TAGS[tg].label}
                  </span>
                ))}
              </div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15.5, lineHeight: 1.55, color: '#ffffff' }}>{copy}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
