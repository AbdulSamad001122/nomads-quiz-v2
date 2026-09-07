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
      ['Welcome / first page', '/'],
      ['Benchmark — SLG', '/?goto=benchmark'],
      ['Benchmark — PLG', '/?goto=benchmark&path=plg'],
      ['"Get real" transition', '/?goto=transition-belief'],
      ['Transition to calculator', '/?goto=transition-calculator'],
      ['Loading — blue', '/?loading=blue'],
      ['Loading — maroon', '/?loading=maroon'],
      ['Loading — green', '/?loading=green'],
      ['Almost ready', '/?goto=almost-ready'],
      ['Q14 — feedback loop', '/?goto=q14'],
      ['Opt-in', '/?goto=optin'],
      ['Disqualification', '/?goto=dq'],
      ['Case study 5A — GolfBays (maroon)', '/?goto=case-study&q5=a'],
      ['Case study 5A — GolfBays (green, gate route)', '/?goto=case-study&q5=a&gate=1'],
      ['Case study 5B — The 97% (maroon)', '/?goto=case-study&q5=b'],
      ['Case study 5B — The 97% (green, gate route)', '/?goto=case-study&q5=b&gate=1'],
      ['Case study 5C — Creative Delivery (maroon)', '/?goto=case-study&q5=c'],
      ['Case study 5C — Creative Delivery (green, gate route)', '/?goto=case-study&q5=c&gate=1'],
      ['Case study 5D — Lara Acosta (maroon)', '/?goto=case-study&q5=d'],
      ['Case study 5D — Lara Acosta (green, gate route)', '/?goto=case-study&q5=d&gate=1'],
      ['Case study 5E — Estelle Winsett (maroon)', '/?goto=case-study&q5=e'],
      ['Case study 5E — Estelle Winsett (green, gate route)', '/?goto=case-study&q5=e&gate=1'],
    ],
  },
  {
    title: 'Placeholder slides (fancy design pending)',
    links: [
      ['Five metrics', '/?goto=five-metrics'],
      ['Advice 12A', '/?goto=advice&path=plg&q12=a'],
      ['Advice 12B', '/?goto=advice&path=plg&q12=b'],
      ['Advice 12C', '/?goto=advice&path=plg&q12=c'],
      ['Advice 12D', '/?goto=advice&path=plg&q12=d'],
      ['Results — worked fixture', '/?results=fixture'],
      ['Results — capped scenario', '/?results=capped'],
      ['Results — no email', '/?results=noemail'],
      ['Results — ad slider', '/?results=adslider'],
    ],
  },
  {
    title: 'Question slides',
    links: [
      ['Q1 · Role', '/?goto=q1'],
      ['Q2A · Revenue', '/?goto=q2a'],
      ['Q2B · Gate check', '/?goto=q2b'],
      ['Q3 · Business type', '/?goto=q3'],
      ['Q4 · Sales model', '/?goto=q4'],
      ['Q5 · Biggest problem', '/?goto=q5'],
      ['Q6 · Traffic sources', '/?goto=q6'],
      ['Q7A · Monthly visitors', '/?goto=q7a'],
      ['Q7B · Ad spend', '/?goto=q7b'],
      ['Q7C · Ad share', '/?goto=q7c'],
      ['Q8 · New subscribers', '/?goto=q8'],
      ['Q9A · 14-day buying action', '/?goto=q9a'],
      ['Q9B · Close rate', '/?goto=q9b'],
      ['Q10 · Order value (SLG)', '/?goto=q10'],
      ['Q10 · Order value (PLG)', '/?goto=q10&path=plg'],
      ['Q11 · Email revenue', '/?goto=q11'],
      ['Q12 · Current puzzle (SLG · 5 options)', '/?goto=q12'],
      ['Q12 · Current puzzle (PLG · 4 options)', '/?goto=q12&path=plg'],
      ['Q13 · What you tried', '/?goto=q13'],
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
