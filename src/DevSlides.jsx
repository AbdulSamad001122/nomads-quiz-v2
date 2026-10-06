/**
 * DEV ONLY — `?slides` — index of every screen in the quiz with direct
 * jump links (`?goto=…` prefills realistic answers so themes, branches
 * and data render correctly). For design + responsiveness review.
 * Part of the dev harness — removed before launch.
 */
import { useState } from 'react';

const GROUPS = [
  {
    title: 'Designed slides',
    links: [
      ['Welcome / first page', '/diagnostic-start-now'],
      ['Benchmark — SLG', '/diagnostic-start-now?goto=benchmark'],
      ['Benchmark — PLG', '/diagnostic-start-now?goto=benchmark&path=plg'],
      ['"Get real" transition', '/diagnostic-start-now?goto=transition-belief'],
      ['Transition to calculator', '/diagnostic-start-now?goto=transition-calculator'],
      ['Loading — blue', '/diagnostic-start-now?loading=blue'],
      ['Loading — maroon', '/diagnostic-start-now?loading=maroon'],
      ['Loading — green', '/diagnostic-start-now?loading=green'],
      ['Almost ready', '/diagnostic-start-now?goto=almost-ready'],
      ['Q14 — feedback loop', '/diagnostic-start-now?goto=q14'],
      ['Opt-in', '/diagnostic-start-now?goto=optin'],
      ['Disqualification', '/diagnostic-start-now?goto=dq'],
      ['Case study 5A — GolfBays (maroon)', '/diagnostic-start-now?goto=case-study&q5=a'],
      ['Case study 5A — GolfBays (green, gate route)', '/diagnostic-start-now?goto=case-study&q5=a&gate=1'],
      ['Case study 5B — The 97% (maroon)', '/diagnostic-start-now?goto=case-study&q5=b'],
      ['Case study 5B — The 97% (green, gate route)', '/diagnostic-start-now?goto=case-study&q5=b&gate=1'],
      ['Case study 5C — Creative Delivery (maroon)', '/diagnostic-start-now?goto=case-study&q5=c'],
      ['Case study 5C — Creative Delivery (green, gate route)', '/diagnostic-start-now?goto=case-study&q5=c&gate=1'],
      ['Case study 5D — Lara Acosta (maroon)', '/diagnostic-start-now?goto=case-study&q5=d'],
      ['Case study 5D — Lara Acosta (green, gate route)', '/diagnostic-start-now?goto=case-study&q5=d&gate=1'],
      ['Case study 5E — Estelle Winsett (maroon)', '/diagnostic-start-now?goto=case-study&q5=e'],
      ['Case study 5E — Estelle Winsett (green, gate route)', '/diagnostic-start-now?goto=case-study&q5=e&gate=1'],
      ['Advice 12A', '/diagnostic-start-now?goto=advice&path=plg&q12=a'],
      ['Advice 12B', '/diagnostic-start-now?goto=advice&path=plg&q12=b'],
      ['Advice 12C', '/diagnostic-start-now?goto=advice&path=plg&q12=c'],
      ['Advice 12D', '/diagnostic-start-now?goto=advice&path=plg&q12=d'],
      ['Five metrics', '/diagnostic-start-now?goto=five-metrics'],
    ],
  },
  {
    title: 'Results page — Blocks 1–3 · revenue split',
    note: 'Sits near the bottom, between "…revenue for months to come." and "This is where Compounding Revenue Per Subscriber™ comes in."',
    links: [
      ['Block 1 only — 20% runs through the metrics', '/diagnostic-start-now?results=split-normal'],
      ['Block 1 + 2 — share under 5%', '/diagnostic-start-now?results=split-low'],
      ['Block 1 + 3 — no email at all (RPS $0)', '/diagnostic-start-now?results=split-noemail'],
      ['Block 1 hidden — split would be nonsense', '/diagnostic-start-now?results=split-hidden'],
      ['No blocks at all — both slots empty', '/diagnostic-start-now?results'],
    ],
  },
  {
    title: 'Results page — Blocks 4–7 · capped outcome',
    note: 'Sits straight under the metric table, before "You can stop at $1.5M."',
    links: [
      ['Block 4 — goal reached (renders nothing)', '/diagnostic-start-now?results=capped4'],
      ['Block 5 — short, but more traffic is reachable', '/diagnostic-start-now?results=capped5'],
      ['Block 6 — short, and traffic is not the answer', '/diagnostic-start-now?results=capped6'],
      ['Block 7 — nothing left to gain from the metrics', '/diagnostic-start-now?results=capped7'],
    ],
  },
  {
    title: 'Results page — ad-spend module',
    note: 'Sits between the CRPS calculator CTA and "So this isn’t a hollow… promise". Hidden unless Q7c was answered.',
    links: [
      ['No ad module — Q7c never answered', '/diagnostic-start-now?results=ad-none'],
      ['Ad module — fixed share (doc fixture, 2.5× → 7.2×)', '/diagnostic-start-now?results=ad-fixed'],
      ['Ad module + slider — Q7c = "Not sure"', '/diagnostic-start-now?results=ad-slider'],
      ['Ad module — $0 spend, ROAS shows “—”', '/diagnostic-start-now?results=ad-zero'],
      ['Copy sheet — every word of the module, tagged', '/diagnostic-start-now?copy=ad'],
    ],
  },
  {
    title: 'Results page — “For the data nerds” (own section since 2026-09-15)',
    note: 'Designed and moved out of the ad module’s purple panel: white card on the topo/dice texture, playful-compass badge on the seam, swoosh channel bullets. Renders for EVERYONE now — compare the two links: the ad module comes and goes, the data-nerds card is on both.',
    links: [
      ['Has ads → ad module + data-nerds card', '/diagnostic-start-now?results=ad-fixed'],
      ['No ads → data-nerds card still there', '/diagnostic-start-now?results=ad-none'],
    ],
  },
  {
    title: 'Results page — original scenarios',
    links: [
      ['Results — worked fixture', '/diagnostic-start-now?results=fixture'],
      ['Results — capped scenario', '/diagnostic-start-now?results=capped'],
      ['Results — no email', '/diagnostic-start-now?results=noemail'],
      ['Results — ad slider', '/diagnostic-start-now?results=adslider'],
    ],
  },
  {
    title: 'Impossible-answer checks',
    note: 'Fires on advancing when two answers contradict each other. Message and button labels are verbatim from Quiz Logics.docx · Manual entry & validation. “Keep my answers” clamps the value at its ceiling and tags the Kit record unverified.',
    links: [
      ['Q8 · more subscribers than visitors', '/diagnostic-start-now?check=subs'],
      ['Q11 · more email revenue than total revenue', '/diagnostic-start-now?check=email'],
      ['Walk it in the quiz — Q7A (then enter 4000)', '/diagnostic-start-now?goto=q7a'],
    ],
  },
  {
    title: 'Question slides',
    links: [
      ['Q1 · Role', '/diagnostic-start-now?goto=q1'],
      ['Q2A · Revenue', '/diagnostic-start-now?goto=q2a'],
      ['Q2B · Gate check', '/diagnostic-start-now?goto=q2b'],
      ['Q3 · Business type', '/diagnostic-start-now?goto=q3'],
      ['Q4 · Sales model', '/diagnostic-start-now?goto=q4'],
      ['Q5 · Biggest problem', '/diagnostic-start-now?goto=q5'],
      ['Q6 · Traffic sources', '/diagnostic-start-now?goto=q6'],
      ['Q7A · Monthly visitors', '/diagnostic-start-now?goto=q7a'],
      ['Q7B · Ad spend', '/diagnostic-start-now?goto=q7b'],
      ['Q7C · Ad share', '/diagnostic-start-now?goto=q7c'],
      ['Q8 · New subscribers', '/diagnostic-start-now?goto=q8'],
      ['Q9A · 14-day buying action', '/diagnostic-start-now?goto=q9a'],
      ['Q9B · Close rate', '/diagnostic-start-now?goto=q9b'],
      ['Q10 · Order value (SLG)', '/diagnostic-start-now?goto=q10'],
      ['Q10 · Order value (PLG)', '/diagnostic-start-now?goto=q10&path=plg'],
      ['Q11 · Email revenue', '/diagnostic-start-now?goto=q11'],
      ['Q12 · Current puzzle (SLG · 5 options)', '/diagnostic-start-now?goto=q12'],
      ['Q12 · Current puzzle (PLG · 4 options)', '/diagnostic-start-now?goto=q12&path=plg'],
      ['Q13 · What you tried', '/diagnostic-start-now?goto=q13'],
    ],
  },
];

export default function DevSlides() {
  const [blockedMsg, setBlockedMsg] = useState(null);

  const openAll = (links) => {
    let blocked = 0;
    links.forEach(([, href]) => {
      const w = window.open(href, '_blank');
      if (!w) blocked += 1;
    });
    setBlockedMsg(
      blocked > 0
        ? `Chrome blocked ${blocked} of ${links.length} tabs. Click the blocked-popup icon (⛔) at the RIGHT END of the address bar → choose "Always allow pop-ups and redirects from http://localhost:3000" → Done → click the button again. This is a one-time browser permission — code can't bypass it.`
        : null
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#152638',
        color: '#e4fbff',
        fontFamily: "'Roboto Mono', monospace",
        padding: '40px clamp(20px, 6vw, 80px)',
      }}
    >
      <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 28, color: '#fff' }}>
        Slide gallery <span style={{ opacity: 0.5, fontSize: 15 }}>(dev harness — not shipped)</span>
      </h1>
      <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.8, maxWidth: 720 }}>
        Every link jumps straight to that screen with realistic answers
        prefilled — themes, branches and data all resolve. To see a slide in a
        different rotation colour, append <code>&amp;gate=1</code> (adds Q2B to
        the count) or <code>&amp;ads=1</code> (adds Q7B+Q7C). Resize the window
        or use device mode for responsiveness checks.
      </p>
      {blockedMsg ? (
        <div
          style={{
            marginTop: 18,
            padding: '12px 16px',
            background: '#5d1b4e',
            color: '#fff',
            fontSize: 13,
            lineHeight: 1.6,
            maxWidth: 720,
          }}
        >
          {blockedMsg}
        </div>
      ) : null}
      {GROUPS.map((g) => (
        <section key={g.title} style={{ marginTop: 34 }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#cae1f4', display: 'flex', alignItems: 'center', gap: 14 }}>
            {g.title}
            <button
              type="button"
              onClick={() => openAll(g.links)}
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 12,
                background: '#cae1f4',
                color: '#152638',
                border: 'none',
                padding: '5px 12px',
                cursor: 'pointer',
              }}
            >
              Open all ({g.links.length}) ↗
            </button>
          </h2>
          {g.note ? (
            <p style={{ fontSize: 12.5, lineHeight: 1.6, opacity: 0.65, margin: '6px 0 0', maxWidth: 760 }}>
              {g.note}
            </p>
          ) : null}
          <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px 24px' }}>
            {g.links.map(([label, href]) => (
              <li key={href + label}>
                <a href={href} style={{ color: '#e4fbff', fontSize: 13.5, textDecorationColor: '#5d8aa8' }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
