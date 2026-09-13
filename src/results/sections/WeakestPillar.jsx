import { WEAKEST_PILLAR } from '../copy.js';
import './WeakestPillar.css';

function Lines({ lines }) {
  return lines.join(' ');
}

/**
 * Section — "On the call, we take the weakest pillar and get specific:".
 * Left: bear-sketch dark panel with the judgment para + diagnostic bold.
 * Right: peach panel with five question bubbles, the next-step paragraphs,
 * plum band and the footprints doodle.
 */
export default function WeakestPillar() {
  return (
    <section className="rwp">
      <div className="rwp__left">
        <div className="rwp__left-inner">
          <p className="rwp__para">
            <Lines lines={WEAKEST_PILLAR.leftParaLines} />
          </p>
          <p className="rwp__bold">
            <Lines lines={WEAKEST_PILLAR.leftBoldLines} />
          </p>
        </div>
      </div>

      <div className="rwp__right">
        <img className="rwp__footprints" src="/assets/results-footprints.png" alt="" aria-hidden="true" />

        <div className="rwp__right-inner">
          <p className="rwp__header">{WEAKEST_PILLAR.rightHeader}</p>

          <div className="rwp__bubbles">
            {WEAKEST_PILLAR.bubbles.map((b) => (
              <div key={b.variant} className={`rwp__bubble rwp__bubble--${b.variant}`}>
                <span className="rwp__qicon">
                  <img src="/assets/results-question-doodle.png" alt="" aria-hidden="true" />
                </span>
                <span>
                  <Lines lines={b.lines} />
                </span>
              </div>
            ))}
          </div>

          <p className="rwp__p">
            <Lines lines={WEAKEST_PILLAR.para1Lines} />
          </p>

          <p className="rwp__p">
            {WEAKEST_PILLAR.para2Before}
            <strong className="rwp__p-bold">{WEAKEST_PILLAR.para2Bold}</strong>
            {WEAKEST_PILLAR.para2After}
          </p>

          <p className="rwp__band">{WEAKEST_PILLAR.band}</p>
        </div>
      </div>
    </section>
  );
}
