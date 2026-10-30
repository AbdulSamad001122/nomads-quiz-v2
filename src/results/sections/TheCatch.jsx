import { useEffect, useRef, useState } from 'react';
import { THE_CATCH } from '../copy.js';
import './TheCatch.css';

/** Copy lines flow as one naturally-wrapping run (no forced breaks). */
function Lines({ lines }) {
  return lines.join(' ');
}

const SKETCH = [3, 2, 3]; // placeholder question lines per question

/* The write-in timeline (QC row 8, Oct 30): when the scorecard comes into
   view it is "workshopped through" in front of the reader — Pillar 01's
   three answers are pencilled in one by one, then its 2.7 lands on the
   wheel and in the totals, then the still-empty "?"s and the centre's
   "your lowest score = ?" pulse once, so it reads as theirs to fill.
   Alefiya: "an incomplete diagnostic … like they are scoring themselves
   and they are workshopping through that", "unfillable worksheet type of
   look" (so nothing is typed in by the reader), and diagrams must not be
   "overwhelming when they appear … keep it interactive". Each step is the
   delay (ms) after the previous one. */
const STEPS = [
  700, // 1 · board pieces have settled in
  650, // 2 · Pillar 01, question 1 → 3
  650, // 3 · question 2 → 2
  650, // 4 · question 3 → 3
  800, // 5 · the wheel: 2.7 / 5
  700, // 6 · the totals: 2.7
  700, // 7 · the "?"s ask for the rest
];
const FINAL = STEPS.length;

/* Pillar order everywhere: 0 = 01 (top left), 1 = 02, 2 = 03, 3 = 04. */

/** One pillar's question card: greyed placeholder lines + a score box each. */
function QCard({ p, idx, c, step, focusProps, cls }) {
  return (
    <div className={`rtc__qc rtc__qc--${p.tone}${cls}`} {...focusProps(idx)}>
      <span className="rtc__hd">
        <b>{p.n}</b>
        {`${c.pillar} ${p.n}`}
      </span>
      {p.scores.map((sc, i) => {
        const on = sc && step >= 2 + i;
        return (
          <div className="rtc__qrow" key={i}>
            <span className="rtc__sk" aria-hidden="true">
              {Array.from({ length: SKETCH[i % 3] }, (_, k) => (
                <i key={k} />
              ))}
            </span>
            <span className={`rtc__box${on ? ' rtc__box--f' : ''}`}>
              {sc && <span className={`rtc__ink${on ? ' rtc__ink--on' : ''}`}>{sc}</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * QC row 8 (Oct 2026): the unfilled workshop scorecard that replaces the OS
 * board image — Alefiya's "Here's The Catch V2": the four-quadrant wheel
 * with an empty "_ / 5" per pillar, the question cards with empty score
 * boxes, and the four totals. Only Pillar 01 is pencilled in, so it reads
 * as theirs to fill. Drawn in HTML/SVG, so it stays sharp at every width.
 *
 * Interactive (Oct 30): the write-in timeline above, and pointing at (or
 * tapping) a pillar — its card, its wheel quadrant or its total — lights up
 * all three and dims the rest, so the board reads as one connected thing.
 * Reduced motion: the finished board, no animation.
 */
function Scorecard() {
  const c = THE_CATCH.scorecard;
  const [p1, p2, p3, p4] = c.pillars;
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setStep(FINAL);
      return undefined;
    }
    const timers = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let t = 0;
        STEPS.forEach((d, i) => {
          t += d;
          timers.push(setTimeout(() => setStep(i + 1), t));
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  // pointer / tap focus on one pillar (purely visual; the board stays an image
  // for screen readers)
  const focusProps = (i) => ({
    onMouseEnter: () => setFocus(i),
    onMouseLeave: () => setFocus(null),
    onClick: () => setFocus((f) => (f === i ? null : i)),
  });
  const hl = (i) => (focus === null ? '' : focus === i ? ' rtc__hl' : ' rtc__dim');

  // quadrant score positions, clockwise from top left
  const spots = [
    ['31%', '38%'],
    ['69%', '38%'],
    ['69%', '62%'],
    ['31%', '62%'],
  ];
  const quads = [
    'M100 100 L100 20 A80 80 0 0 0 20 100 Z',
    'M100 100 L180 100 A80 80 0 0 0 100 20 Z',
    'M100 100 L100 180 A80 80 0 0 0 180 100 Z',
    'M100 100 L20 100 A80 80 0 0 0 100 180 Z',
  ];
  const fills = ['#250F1C', '#152638', '#5D1B4E', '#2c4a52'];
  const wheelOn = step >= 5;
  const totalOn = step >= 6;
  const asking = step >= FINAL;
  const writing = step >= 1 && step < FINAL;

  return (
    <>
      <div
        ref={ref}
        className={`rtc__board${step >= 1 ? ' rtc__board--in' : ''}${asking ? ' rtc__board--ask' : ''}`}
        role="img"
        aria-label={c.label}
      >
        <div className="rtc__bt">
          {c.titleBefore} <span>{c.titleMark}</span>
          {c.titleAfter}
        </div>
        <div className="rtc__bs">{c.sub}</div>
        <div className="rtc__bgrid">
          <div className="rtc__col">
            <QCard p={p1} idx={0} c={c} step={step} focusProps={focusProps} cls={hl(0)} />
            <QCard p={p4} idx={3} c={c} step={step} focusProps={focusProps} cls={hl(3)} />
          </div>
          <div className="rtc__wheel">
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="96" fill="#f3ece8" stroke="#e2d4cc" strokeWidth="2" />
              {quads.map((d, i) => (
                <path key={d} d={d} fill={fills[i]} className={`rtc__quad${hl(i)}`} {...focusProps(i)} />
              ))}
              <circle className="rtc__hub" cx="100" cy="100" r="24" fill="#f3e6ee" />
              <g className="rtc__wheel-centre" textAnchor="middle">
                <text x="100" y="98">{c.centre[0]}</text>
                <text x="100" y="107">{c.centre[1]}</text>
              </g>
              <g className="rtc__wheel-label" textAnchor="middle">
                {c.wheel.map(([a, b], i) => {
                  // names sit near the rim, inside each quadrant's widest part,
                  // so they clear the score boxes
                  const x = i === 0 || i === 3 ? 72 : 128;
                  const y = i < 2 ? 42 : 158;
                  return (
                    <text key={a} x={x} y={y}>
                      <tspan x={x}>{a}</tspan>
                      <tspan x={x} dy="8">
                        {b}
                      </tspan>
                    </text>
                  );
                })}
              </g>
            </svg>
            {c.pillars.map((p, i) => {
              const on = p.total && wheelOn;
              return (
                <span
                  key={p.n}
                  className={`rtc__qscore${on ? ' rtc__qscore--f' : ''}${p.total ? '' : ' rtc__ask'}${hl(i)}`}
                  style={{ left: spots[i][0], top: spots[i][1], '--ask': i }}
                  {...focusProps(i)}
                >
                  {p.total ? (
                    <span className={`rtc__ink${on ? ' rtc__ink--on' : ''}`}>{p.total}</span>
                  ) : (
                    <i className="rtc__blank">{c.blank}</i>
                  )}
                  {c.outOf}
                </span>
              );
            })}
          </div>
          <div className="rtc__col">
            <QCard p={p2} idx={1} c={c} step={step} focusProps={focusProps} cls={hl(1)} />
            <QCard p={p3} idx={2} c={c} step={step} focusProps={focusProps} cls={hl(2)} />
          </div>
          <div className="rtc__tot">
            {c.pillars.map((p, i) => {
              const on = p.total && totalOn;
              return (
                <div
                  key={p.n}
                  className={`${on ? 'rtc__tot--f' : ''}${p.total ? '' : ' rtc__ask'}${hl(i)}`}
                  style={{ '--ask': i }}
                  {...focusProps(i)}
                >
                  {!p.total && focus === i && (
                    <span className="rtc__tip" aria-hidden="true">
                      {c.together.tip}
                    </span>
                  )}
                  {`${c.pillar} ${p.n}`}
                  <b>
                    {p.total ? (
                      <span className={`rtc__ink${on ? ' rtc__ink--on' : ''}`}>{p.total}</span>
                    ) : (
                      <i className="rtc__blank">{c.unknown}</i>
                    )}
                  </b>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* "It's unfinished — we fill the rest in together": a sticky note on
          the board's corner (1 of 4 scored + a 4-part bar), and a pencilled
          arrow drawing itself towards the empty pillars. Real text, outside
          the board image, so screen readers get it too. */}
      <div className={`rtc__note${step >= 1 ? ' rtc__note--on' : ''}`}>
        <span className="rtc__note-tape" aria-hidden="true" />
        <span className="rtc__note-scored">{c.together.scored}</span>
        <span className="rtc__note-bar" aria-hidden="true">
          {c.pillars.map((p) => (
            <i key={p.n} className={p.total && totalOn ? 'rtc__note-seg--f' : undefined} />
          ))}
        </span>
        <span className="rtc__note-rest">{c.together.rest}</span>
      </div>
      <svg className={`rtc__arrow${step >= 1 ? ' rtc__arrow--on' : ''}`} viewBox="0 0 60 54" aria-hidden="true">
        <path className="rtc__arrow-line" d="M4 44 C 30 52, 56 34, 26 6" />
        <path className="rtc__arrow-head" d="M28.5 17.7 L26 6 L37.9 7.7" />
      </svg>
      <svg
        className={`rtc__pencil${writing ? ' rtc__pencil--writing' : ''}${asking ? ' rtc__pencil--wait' : ''}`}
        viewBox="0 0 150 22"
        aria-hidden="true"
      >
        <rect x="0" y="5" width="20" height="12" rx="2" fill="#E0B5A3" />
        <rect x="20" y="5" width="98" height="12" fill="#5D1B4E" />
        <rect x="20" y="5" width="98" height="4" fill="#8A4F70" />
        <path d="M118 5 L140 11 L118 17 Z" fill="#E4C8BC" />
        <path d="M133 9 L140 11 L133 13 Z" fill="#250F1C" />
      </svg>
    </>
  );
}

/**
 * Section — "Here's the catch": white left column (chip rule, headline,
 * score box, workshop scoring copy) and mint-gradient right column with the
 * down-arrows doodle and the blank workshop scorecard (QC row 8). The plum
 * "More On Both Below." band straddles the seam with the section above.
 */
export default function TheCatch() {
  return (
    <section className="rtc">
      <div className="rtc__band" aria-hidden="true">
        {THE_CATCH.band}
      </div>

      <div className="rtc__left">
        <div className="rtc__rule">
          <span className="rtc__chip">{THE_CATCH.chip}</span>
          <span className="rtc__rule-line" aria-hidden="true" />
          <img className="rtc__rule-icon" src="/assets/results-compass-navy.png" alt="" aria-hidden="true" width="426" height="426" />
        </div>

        <h2 className="rtc__headline">
          {THE_CATCH.headlineLines[0]}{' '}
          <span className="rtc__keep">{THE_CATCH.headlineLines[1]}</span>{' '}
          {THE_CATCH.headlineLines[2]}
        </h2>

        <p className="rtc__sub">
          <Lines lines={THE_CATCH.subLines} />
        </p>

        <p className="rtc__scorebox">{THE_CATCH.scoreBox}</p>

        <p className="rtc__para">
          <Lines lines={THE_CATCH.paraLines} />
        </p>

        <p className="rtc__para">
          <Lines lines={THE_CATCH.para2Lines} />
        </p>

        <p className="rtc__bold">
          <Lines lines={THE_CATCH.boldLines} />
        </p>
      </div>

      <div className="rtc__right">
        <img className="rtc__arrows" src="/assets/results-down-arrows.png" alt="" aria-hidden="true" />
        <div className="rtc__card-wrap">
          <Scorecard />
        </div>
      </div>
    </section>
  );
}
