import { PILLAR_ONE_SITUATION3, PILLAR_ONE_LARA_QUOTE } from '../copy.js';
import './PillarOneSituation3.css';

/**
 * Pillar one — Situation 03 as a 2×2 grid: ice copy panel + the navy
 * content→close-rate flow on top, Lara Acosta portrait + her testimonial
 * below. Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOneSituation3() {
  const s = PILLAR_ONE_SITUATION3;
  const q = PILLAR_ONE_LARA_QUOTE;

  return (
    <div className="rpt">
      <div className="rpt__cell rpt__cell--ice">
        <div className="rpt__body">
          <span className="rpt__chip">{s.chip}</span>
          <p className="rpt__lead">{s.lead}</p>
          {s.paras.map((p) => (
            <p className="rpt__para" key={p}>
              {p}
            </p>
          ))}
          <p className="rpt__bold">{s.bold}</p>
          <p className="rpt__para">{s.closing}</p>
        </div>
      </div>

      <div className="rpt__cell rpt__cell--navy">
        <img
          className="rpt__flow"
          src="/assets/results-situation3-flow.webp"
          alt="Content → Book a call → Calls full of doubtful buyers → 45 mins spent educating → Close rate drops"
        />
      </div>

      <div className="rpt__cell rpt__cell--maroon">
        <img className="rpt__lara" src="/assets/results-lara.webp" alt="Lara Acosta — Forbes 30 Under 30" />
      </div>

      <div className="rpt__cell rpt__cell--cream">
        <div className="rpt__quote">
          <img className="rpt__mark rpt__mark--open" src="/assets/results-quote-mark.png" alt="" aria-hidden="true" />
          <p className="rpt__quote-head">
            {q.quoteBefore} <span className="rpt__hl">{q.quoteHighlight}</span> {q.quoteAfter}
          </p>
          <p className="rpt__quote-para">{q.para}</p>
          <span className="rpt__quote-chip">{q.chip}</span>
          <p className="rpt__stat">
            {q.statLead} {q.stat} {q.statTrail}
          </p>
          <img className="rpt__mark rpt__mark--close" src="/assets/results-quote-mark.png" alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
