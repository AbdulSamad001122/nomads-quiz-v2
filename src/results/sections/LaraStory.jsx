import { LARA_STORY } from '../copy.js';
import './LaraStory.css';

/**
 * Section — the Lara Acosta story: cream linen left panel (verdict chip,
 * swoosh bullets, plum band) and dark maroon crumpled right panel with the
 * Lara composition image.
 */
export default function LaraStory() {
  return (
    <section className="rls">
      <div className="rls__left">
        <p className="rls__para">{LARA_STORY.para1}</p>

        <span className="rls__chip">{LARA_STORY.chip}</span>

        <p className="rls__para rls__para--tight">{LARA_STORY.para2}</p>

        <ul className="rls__bullets">
          {LARA_STORY.bullets.map((b, i) => (
            <li key={i} className="rls__bullet">
              <img src="/assets/results-icon-nomads-plum.png" alt="" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>

        <p className="rls__para">{LARA_STORY.para3}</p>

        <p className="rls__band">{LARA_STORY.band}</p>
      </div>

      <div className="rls__right">
        <img className="rls__lara" src="/assets/results-lara.webp" alt="Lara Acosta — Forbes 30 Under 30" />
      </div>
    </section>
  );
}
