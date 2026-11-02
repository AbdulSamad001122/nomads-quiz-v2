import { cloneElement } from 'react';
import { CREATIVE_DELIVERY as c } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import './CreativeDelivery.css';

/**
 * Case study — L · Creative Delivery (user, Nov 2). Split like the user's
 * reference: navy panel with the Lean Video System tablet on the left, light
 * paper with the "CASE STUDY" chip, the story and a big 13.5×
 * on the right. Replaces the Video Mastermind proof card that sat under
 * the "It is a stretch…" ladder, so it follows that section.
 */
export default function CreativeDelivery() {
  return (
    <section className="rlc">
      <div className="rlc__media">
        <img
          className="rlc__img"
          src="/assets/results-creative-delivery.avif"
          alt={c.imageAlt}
          width="1167"
          height="860"
          loading="lazy"
        />
      </div>

      <div className="rlc__copy">
        <div className="rlc__copy-inner">
          <span className="rlc__chip">{c.chip}</span>
          <h2 className="rlc__head">{c.head}</h2>
          {c.paras.map((p) => (
            <p key={p.slice(0, 24)} className="rlc__p">
              {[].concat(emphasize(p, c.bold)).map((n) =>
                n?.props?.children === c.figure ? cloneElement(n, { className: 'results-em rlc__fig' }) : n,
              )}
            </p>
          ))}
          <p className="rlc__big">{c.big}</p>
        </div>
      </div>
    </section>
  );
}
