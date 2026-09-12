import { Fragment } from 'react';
import { PILLAR_ONE_FLOW } from '../copy.js';
import './PillarOneFlow.css';

/**
 * Pillar one — the 4C flow (Curiosity → Consideration → Conviction →
 * Conversion) on stone, then the navy keyline panel closing the pillar.
 * Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOneFlow() {
  return (
    <div className="rp4">
      <div className="rp4__flow">
        <div className="rp4__steps">
          {PILLAR_ONE_FLOW.steps.map((step, i) => (
            <Fragment key={step.label}>
              <div className={`rp4__card rp4__card--${step.variant}`}>
                <img className="rp4__icon" src={step.icon} alt="" aria-hidden="true" />
                <span className="rp4__label">{step.label}</span>
              </div>
              {i < PILLAR_ONE_FLOW.steps.length - 1 && (
                <span className="rp4__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>

        <p className="rp4__lines">
          {PILLAR_ONE_FLOW.line1} {PILLAR_ONE_FLOW.line2}
        </p>
      </div>

      <div className="rp4__panel">
        <div className="rp4__keyline" aria-hidden="true" />
        <div className="rp4__panel-inner">
          <span className="rp4__chip">{PILLAR_ONE_FLOW.chip}</span>
          <p className="rp4__para">{PILLAR_ONE_FLOW.para1}</p>
          <p className="rp4__para">{PILLAR_ONE_FLOW.para2}</p>
        </div>
      </div>
    </div>
  );
}
