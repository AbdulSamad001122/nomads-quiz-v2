import { RELATE_QUOTES } from '../copy.js';
import './RelateQuotes.css';

/**
 * Section — "Perhaps you can relate?" (copy doc row 10, quote cards).
 * Pale-ice band with a hard diagonal two-tone split; four rounded quote
 * cards rotating wine → cream → navy → ice, each with the plum comma
 * graphic (masked + recoloured per tone) opening top-left and closing
 * bottom-right beside the attribution.
 */
export default function RelateQuotes() {
  return (
    <section className="rrq">
      <h2 className="rrq__heading">{RELATE_QUOTES.heading}</h2>
      <div className="rrq__grid">
        {RELATE_QUOTES.cards.map((card) => (
          <figure className={`rrq__card rrq__card--${card.tone}`} key={card.tone}>
            <span className="rrq__mark rrq__mark--open" aria-hidden="true" />
            <blockquote className="rrq__quote">
              {card.paras.map((p) => (
                <p key={p.slice(0, 18)}>{p}</p>
              ))}
            </blockquote>
            <figcaption className="rrq__foot">
              <span className="rrq__who">{card.who}</span>
              <span className="rrq__mark rrq__mark--close" aria-hidden="true" />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
