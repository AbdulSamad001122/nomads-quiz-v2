import { PILLAR_FOUR_INTRO } from '../copy.js';
import './PillarFourIntro.css';

/**
 * Pillar four — opening split: cream copy panel with the bordered
 * subscriber box, and the dark keyline-framed panel carrying the
 * Compounding-RPS artwork plus the corner compass badge.
 * Lives inside the pillars accordion (PANELS['04']).
 */
export default function PillarFourIntro() {
  const p = PILLAR_FOUR_INTRO;

  return (
    <div className="rfs">
      <div className="rfs__left">
        <div className="rfs__body">
          <span className="rfs__chip">{p.chip}</span>
          <p className="rfs__lead">{p.lead}</p>
          <p className="rfs__para">{p.para1}</p>
          <p className="rfs__para">{p.para2}</p>

          <div className="rfs__box">
            <p className="rfs__box-lead">
              <strong>{p.boxLeadBold}</strong>
              {p.boxLeadTail}
            </p>
            <p className="rfs__box-para">{p.boxPara}</p>
            <ul className="rfs__bullets">
              {p.bullets.map((b) => (
                <li className="rfs__bullet" key={b}>
                  <img src="/assets/results-swoosh-plum.png" alt="" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="rfs__para">{p.closing}</p>
          <p className="rfs__closing">{p.closingBold}</p>
        </div>
      </div>

      <div className="rfs__right">
        {/* the keyline frame and corner compass are baked into the artwork */}
        <img className="rfs__art" src="/assets/results-p4-crps.webp" alt={p.imageAlt} />
      </div>
    </div>
  );
}
