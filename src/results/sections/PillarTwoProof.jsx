import { PILLAR_TWO_PROOF } from '../copy.js';
import './PillarTwoProof.css';

/** Dark cards take the white mark, light cards the plum one. */
const MARK = {
  plum: '/assets/results-quote-mark-white.png',
  navy: '/assets/results-quote-mark-white.png',
  tan: '/assets/results-quote-mark.png',
  ice: '/assets/results-quote-mark.png',
};

/**
 * Pillar two — positioning proof: four client quote cards on a cream sheet
 * over the maroon texture. Lives inside the pillars accordion (PANELS['02']).
 */
export default function PillarTwoProof() {
  return (
    <div className="rqp">
      <div className="rqp__sheet">
        <div className="rqp__grid">
          {PILLAR_TWO_PROOF.cards.map((c) => (
            <article className={`rqp__card rqp__card--${c.variant}`} key={c.name}>
              <img className="rqp__mark rqp__mark--open" src={MARK[c.variant]} alt="" aria-hidden="true" />
              <h4 className="rqp__headline">{c.headline}</h4>
              <p className="rqp__body">{c.body}</p>
              <div className="rqp__who">
                <img className="rqp__avatar" src={c.avatar} alt={c.name} />
                <span>
                  <span className="rqp__name">{c.name}</span>
                  <span className="rqp__role">{c.role}</span>
                </span>
              </div>
              <img className="rqp__mark rqp__mark--close" src={MARK[c.variant]} alt="" aria-hidden="true" />
            </article>
          ))}
        </div>
        <p className="rqp__caption">{PILLAR_TWO_PROOF.caption}</p>
      </div>
    </div>
  );
}
