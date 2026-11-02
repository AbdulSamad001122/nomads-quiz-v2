import { CREATIVE_DELIVERY as c } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './CreativeDelivery.css';

/**
 * Case study — L · Creative Delivery (user, Nov 2). Split like the user's
 * reference: navy panel with the Lean Video System tablet on the left, light
 * paper with the "CASE STUDY" chip, the story, the button and a big 13.5×
 * on the right. Replaces the Video Mastermind proof card that sat under
 * the "It is a stretch…" ladder, so it follows that section.
 */
export default function CreativeDelivery() {
  return (
    <section className="rcd">
      <div className="rcd__media">
        <img
          className="rcd__img"
          src="/assets/results-creative-delivery.avif"
          alt={c.imageAlt}
          width="1167"
          height="860"
          loading="lazy"
        />
      </div>

      <div className="rcd__copy">
        <div className="rcd__copy-inner">
          <span className="rcd__chip">{c.chip}</span>
          <h2 className="rcd__head">{c.head}</h2>
          {c.paras.map((p) => (
            <p key={p.slice(0, 24)} className="rcd__p">
              {emphasize(p, c.bold)}
            </p>
          ))}
          <a
            className="rcd__btn"
            href={c.href}
            target="_blank"
            rel="noopener"
            onClick={() => ga.ctaClick('read_case_study')}
          >
            {c.button}
            <span aria-hidden="true">→</span>
          </a>
          <p className="rcd__big">{c.big}</p>
        </div>
      </div>
    </section>
  );
}
