import { TEAM_APPROACH } from '../copy.js';
import './TeamApproach.css';

/**
 * Team approach — QC row 9 (Oct 2026), Alefiya's "Team Approach Section"
 * design. Left: the compass panel, unchanged, pinned while the right side
 * scrolls. Right: the team approach and the old "Your Next $125k/Mo Game
 * Plan" section merged into five cards that stick and pile up as you scroll.
 * Phones: the compass sits on top and the cards stack below, unpinned.
 */
export default function TeamApproach() {
  const c = TEAM_APPROACH;
  return (
    <section className="rta">
      <div className="rta__left">
        <img src="/assets/results-team-compass.webp" alt={c.compassAlt} />
      </div>

      <div className="rta__right">
        <div className="rta__stack">
          <article className="rta__card rta__card--problem" style={{ '--i': 0 }}>
            <span className="rta__kick">{c.problem.kick}</span>
            <h3 className="rta__h3">{c.problem.title}</h3>
            <div className="rta__heads">
              {c.problem.heads.map((h) => (
                <div key={h.variant} className={`rta__head rta__head--${h.variant}`}>
                  <span className="rta__icon" aria-hidden="true" />
                  <span>
                    <b>{h.bold}</b>
                    {h.rest && ` ${h.rest}`}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rta__card rta__card--so" style={{ '--i': 1 }}>
            <span className="rta__kick">{c.so.kick}</span>
            <p className="rta__mystery">
              {c.so.lead} <span>{c.so.accent}</span>
            </p>
          </article>

          <article className="rta__card rta__card--workshop" style={{ '--i': 2 }}>
            <span className="rta__kick">{c.workshop.kick}</span>
            <h3 className="rta__h3">{c.workshop.title}</h3>
            <div className="rta__vs">
              {c.workshop.says.map((s) => (
                <div key={s.who} className="rta__say">
                  <small>{s.who}</small>
                  {s.quote}
                </div>
              ))}
            </div>
            <p className="rta__same">{c.workshop.same}</p>
          </article>

          <article className="rta__card rta__card--plan" style={{ '--i': 3 }}>
            <span className="rta__bg" aria-hidden="true">
              {c.gamePlan.bg}
            </span>
            <span className="rta__kick">{c.gamePlan.kick}</span>
            <h2 className="rta__h3 rta__h3--plan">{c.gamePlan.title}</h2>
            <p className="rta__p">{c.gamePlan.sub}</p>
            <div className="rta__blind">
              {c.gamePlan.cards.map((b) => (
                <div key={b.variant} className={`rta__bl rta__bl--${b.variant}`}>
                  <b>{b.label}</b>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rta__card rta__card--help" style={{ '--i': 4 }}>
            <span className="rta__kick">{c.help.kick}</span>
            <p className="rta__help">
              {c.help.before}
              <mark>{c.help.mark}</mark>
              {c.help.after}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
