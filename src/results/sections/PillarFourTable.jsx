import { PILLAR_FOUR_TABLE } from '../copy.js';
import './PillarFourTable.css';

/**
 * Pillar four — "In the workshop, I walk you through the whole table": the
 * workshop copy with its three swoosh bullets. Text only since Yemi's R16:
 * the table and its notice line moved into their own section before this one
 * (PillarFourYear), and the old calculator artwork is gone.
 * Lives inside the pillars accordion (PANELS['04']).
 */
export default function PillarFourTable() {
  const p = PILLAR_FOUR_TABLE;

  return (
    <div className="rft">
      <div className="rft__body">
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
    </div>
  );
}
