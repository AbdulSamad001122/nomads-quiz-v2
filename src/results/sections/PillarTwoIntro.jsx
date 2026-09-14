import { PILLAR_TWO_INTRO } from '../copy.js';
import './PillarTwoIntro.css';

/**
 * Pillar two — opening split: ice paper panel with the price-war copy and
 * the white bordered box, dark panel with the "look the same → compared on
 * price" diagram. Lives inside the pillars accordion (PANELS['02']).
 */
export default function PillarTwoIntro() {
  const p = PILLAR_TWO_INTRO;

  return (
    <div className="rq2">
      <div className="rq2__left">
        <div className="rq2__body">
          <span className="rq2__chip">{p.chip}</span>
          <h3 className="rq2__headline">{p.headline}</h3>
          <p className="rq2__para">{p.para}</p>

          <div className="rq2__box">
            <p className="rq2__box-lead">{p.boxLead}</p>
            {p.boxParas.map((t) => (
              <p className="rq2__box-para" key={t}>
                {t}
              </p>
            ))}
            <ul className="rq2__bullets">
              {p.bullets.map((b) => (
                <li className="rq2__bullet" key={b}>
                  <img src="/assets/results-swoosh-plum.png" alt="" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="rq2__closing">{p.closing}</p>
          <span className="rq2__chip rq2__chip--close">{p.chipClose}</span>
        </div>
      </div>

      <div className="rq2__right">
        <div className="rq2__diagram">
          <p className="rq2__diagram-head">{p.diagramHeading}</p>
          <img
            className="rq2__diagram-img"
            src="/assets/results-p2-infographic.webp"
            alt="Four identical “We help you scale faster” claims funnelling into one distinct Your Contrarian POV — take a stand, chosen on sight"
          />
          <p className="rq2__diagram-caption">{p.diagramCaption}</p>
        </div>
      </div>
    </div>
  );
}
