import { PILLAR_ONE } from '../copy.js';
import './PillarOneIntro.css';

/**
 * Pillar one panel — opening banner: dark navy/maroon crumple, "Pillar 01"
 * chip, 90% sub-line and the TINY-10% highlighted headline. Lives inside
 * the pillars accordion (PANELS['01']).
 */
export default function PillarOneIntro() {
  return (
    <div className="rp1">
      <span className="rp1__chip">{PILLAR_ONE.chip}</span>
      <p className="rp1__sub">{PILLAR_ONE.sub}</p>
      <h3 className="rp1__headline">
        {PILLAR_ONE.headBefore} <span className="rp1__hl">{PILLAR_ONE.headHighlight}</span>{' '}
        {PILLAR_ONE.headAfter}
      </h3>
    </div>
  );
}
