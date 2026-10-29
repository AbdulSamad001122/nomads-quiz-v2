import { THE_CATCH } from '../copy.js';
import './TheCatch.css';

/** Copy lines flow as one naturally-wrapping run (no forced breaks). */
function Lines({ lines }) {
  return lines.join(' ');
}

const SKETCH = [3, 2, 3]; // placeholder question lines per question

/** One pillar's question card: greyed placeholder lines + a score box each. */
function QCard({ p, c }) {
  return (
    <div className={`rtc__qc rtc__qc--${p.tone}`}>
      <span className="rtc__hd">
        <b>{p.n}</b>
        {`${c.pillar} ${p.n}`}
      </span>
      {p.scores.map((sc, i) => (
        <div className="rtc__qrow" key={i}>
          <span className="rtc__sk" aria-hidden="true">
            {Array.from({ length: SKETCH[i % 3] }, (_, k) => (
              <i key={k} />
            ))}
          </span>
          <span className={`rtc__box${sc ? ' rtc__box--f' : ''}`}>{sc}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * QC row 8 (Oct 2026): the unfilled workshop scorecard that replaces the OS
 * board image — Alefiya's "Here's The Catch V2": the four-quadrant wheel
 * with an empty "_ / 5" per pillar, the question cards with empty score
 * boxes, and the four totals. Only Pillar 01 is pencilled in, so it reads
 * as theirs to fill. Drawn in HTML/SVG, so it stays sharp at every width.
 */
function Scorecard() {
  const c = THE_CATCH.scorecard;
  const [p1, p2, p3, p4] = c.pillars;
  // quadrant score positions, clockwise from top left
  const spots = [
    ['31%', '38%'],
    ['69%', '38%'],
    ['69%', '62%'],
    ['31%', '62%'],
  ];
  return (
    <div className="rtc__board" role="img" aria-label={c.label}>
      <div className="rtc__bt">
        {c.titleBefore} <span>{c.titleMark}</span>
        {c.titleAfter}
      </div>
      <div className="rtc__bs">{c.sub}</div>
      <div className="rtc__bgrid">
        <div className="rtc__col">
          <QCard p={p1} c={c} />
          <QCard p={p4} c={c} />
        </div>
        <div className="rtc__wheel">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" fill="#f3ece8" stroke="#e2d4cc" strokeWidth="2" />
            <path d="M100 100 L100 20 A80 80 0 0 0 20 100 Z" fill="#250F1C" />
            <path d="M100 100 L180 100 A80 80 0 0 0 100 20 Z" fill="#152638" />
            <path d="M100 100 L100 180 A80 80 0 0 0 180 100 Z" fill="#5D1B4E" />
            <path d="M100 100 L20 100 A80 80 0 0 0 100 180 Z" fill="#2c4a52" />
            <circle cx="100" cy="100" r="24" fill="#f3e6ee" />
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
          {c.pillars.map((p, i) => (
            <span
              key={p.n}
              className={`rtc__qscore${p.total ? ' rtc__qscore--f' : ''}`}
              style={{ left: spots[i][0], top: spots[i][1] }}
            >
              {p.total || <i className="rtc__blank">{c.blank}</i>}
              {c.outOf}
            </span>
          ))}
        </div>
        <div className="rtc__col">
          <QCard p={p2} c={c} />
          <QCard p={p3} c={c} />
        </div>
        <div className="rtc__tot">
          {c.pillars.map((p) => (
            <div key={p.n} className={p.total ? 'rtc__tot--f' : undefined}>
              {`${c.pillar} ${p.n}`}
              <b>{p.total || <i className="rtc__blank">{c.unknown}</i>}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
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
          <svg className="rtc__pencil" viewBox="0 0 150 22" aria-hidden="true">
            <rect x="0" y="5" width="20" height="12" rx="2" fill="#E0B5A3" />
            <rect x="20" y="5" width="98" height="12" fill="#5D1B4E" />
            <rect x="20" y="5" width="98" height="4" fill="#8A4F70" />
            <path d="M118 5 L140 11 L118 17 Z" fill="#E4C8BC" />
            <path d="M133 9 L140 11 L133 13 Z" fill="#250F1C" />
          </svg>
        </div>
      </div>
    </section>
  );
}
