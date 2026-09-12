import { PILLAR_ONE_SAMAR } from '../copy.js';
import './PillarOneSamar.css';

/**
 * Pillar one — Samar Owais proof: dark left panel with the open-to-it pie
 * and market-expansion caption; right gradient-rimmed cream card with the
 * story and attribution. Lives inside the pillars accordion (PANELS['01']).
 */
export default function PillarOneSamar() {
  return (
    <div className="rps">
      <div className="rps__left">
        <img
          className="rps__pie"
          src="/assets/results-samar-pie.webp"
          alt="Pie chart — 3% ready to buy now, 30% know they're not interested, 67% open to it"
        />
        <p className="rps__caption">{PILLAR_ONE_SAMAR.caption}</p>
      </div>

      <div className="rps__right">
        <div className="rps__rim">
          <div className="rps__card">
            <h3 className="rps__headline">{PILLAR_ONE_SAMAR.headline}</h3>
            <p className="rps__para">{PILLAR_ONE_SAMAR.para1}</p>
            <p className="rps__para">
              {PILLAR_ONE_SAMAR.para2Plain}
              <br />
              <strong>{PILLAR_ONE_SAMAR.para2Bold}</strong>
            </p>
            <p className="rps__para">{PILLAR_ONE_SAMAR.para3}</p>
            <div className="rps__who">
              <img className="rps__avatar" src="/assets/results-samar-avatar.webp" alt="Samar Owais" />
              <span>
                <span className="rps__name">{PILLAR_ONE_SAMAR.name}</span>
                <span className="rps__role">{PILLAR_ONE_SAMAR.role}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
