import { IN_COMMON } from '../copy.js';
import './InCommon.css';

/**
 * Section — "Here's what they have in common." (copy doc row 10, after the
 * quote cards). White rounded card floating over a maroon-crumple band that
 * hands off to cream paper; Nomads stamp badge straddles the top seam.
 * Four channel icon circles (Icons folder art) joined by dotted connectors,
 * then the navy "All on the belief…" box with the ice correlation chip.
 */
export default function InCommon() {
  return (
    <section className="ric">
      <img
        className="ric__badge"
        src="/assets/results-common-badge.png"
        alt=""
        width="614"
        height="613"
      />
      <div className="ric__card">
        <h2 className="ric__heading">{IN_COMMON.heading}</h2>
        <p className="ric__sub">
          {IN_COMMON.subLine1}{' '}
          <br />
          {IN_COMMON.subLine2}
        </p>
        <ul className="ric__row">
          {IN_COMMON.channels.map((c) => (
            <li className="ric__item" key={c.icon}>
              <img className="ric__icon" src={c.icon} alt="" width="600" height="600" />
              <p className="ric__label">
                {c.lines[0]}
                {c.lines[1] ? (
                  <>
                    {' '}
                    <br />
                    {c.lines[1]}
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
        <div className="ric__belief">
          <p className="ric__belief-lines">
            {IN_COMMON.beliefLines[0]}{' '}
            <br />
            {IN_COMMON.beliefLines[1]}
          </p>
          <p className="ric__chip">{IN_COMMON.beliefChip}</p>
        </div>
      </div>
    </section>
  );
}
