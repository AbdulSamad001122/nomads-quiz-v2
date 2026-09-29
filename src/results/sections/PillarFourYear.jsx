import { PILLAR_FOUR_YEAR } from '../copy.js';
import './PillarFourYear.css';

/**
 * Pillar four — "Here's what a year of it can look like.": the month-by-month
 * compounding table in its own section, between the intro and the workshop
 * copy (Yemi R16: not alongside the workshop section). Copy doc order: lead →
 * table → "Notice what the table doesn't do…".
 *
 * The card follows Yemi's reference (ice paper, dark offset shadow, heading
 * top-left). The whole table image scales to the card at every width,
 * phones included (user, Sep 29 — no sideways scroll).
 * Lives inside the pillars accordion (PANELS['04']).
 */
export default function PillarFourYear() {
  const p = PILLAR_FOUR_YEAR;

  return (
    <div className="rfy">
      <div className="rfy__inner">
        <h3 className="rfy__lead">{p.lead}</h3>

        <div className="rfy__card">
          <h4 className="rfy__heading">{p.tableHeading}</h4>
          <img
            className="rfy__table"
            src="/assets/results-p4-month-table.webp"
            alt={p.tableAlt}
            width="1608"
            height="1058"
          />
        </div>

        <div className="rfy__foot">
          <span className="rfy__chip">{p.noticeChip}</span>
          <p className="rfy__notice">{p.noticeText}</p>
        </div>
      </div>
    </div>
  );
}
