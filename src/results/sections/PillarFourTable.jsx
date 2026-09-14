import { PILLAR_FOUR_TABLE } from '../copy.js';
import './PillarFourTable.css';

/**
 * Pillar four — "I walk you through the whole table": copy left with the
 * notice/workshop chips and three swoosh bullets, calculator artwork right.
 * Lives inside the pillars accordion (PANELS['04']).
 */
export default function PillarFourTable() {
  const p = PILLAR_FOUR_TABLE;

  return (
    <div className="rft">
      <div className="rft__body">
        <span className="rft__chip rft__chip--navy">{p.noticeChip}</span>
        <p className="rft__notice">{p.noticeText}</p>

        <h3 className="rft__headline">
          <span className="rft__sweep">{p.workshopChip}</span>, {p.headline}
        </h3>

        <ul className="rft__bullets">
          {p.bullets.map((b) => (
            <li className="rft__bullet" key={b}>
              <img src="/assets/results-swoosh-plum.png" alt="" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <p className="rft__closing">{p.closing}</p>
      </div>

      <div className="rft__media">
        <img src="/assets/results-p4-calculator.webp" alt={p.imageAlt} />
      </div>
    </div>
  );
}
