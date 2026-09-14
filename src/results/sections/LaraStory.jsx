import { LARA_STORY } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import './LaraStory.css';

/**
 * Section — the Lara Acosta story: cream linen left panel (verdict chip,
 * plum swoosh bullets, plum band — laptop-width block, centred on wide) and
 * dark maroon crumpled right panel with the Lara composition image.
 */
const em = (text) => emphasize(text, LARA_STORY.bold);

export default function LaraStory() {
  return (
    <section className="rls">
      <div className="rls__left">
        <div className="rls__left-inner">
          <p className="rls__para">{em(LARA_STORY.para1)}</p>

          <span className="rls__chip">{LARA_STORY.chip}</span>

          <p className="rls__para rls__para--tight">{em(LARA_STORY.para2)}</p>

          <ul className="rls__bullets">
            {LARA_STORY.bullets.map((b, i) => (
              <li key={i} className="rls__bullet">
                <span className="rls__bullet-icon" aria-hidden="true" />
                <span>{em(b)}</span>
              </li>
            ))}
          </ul>

          <p className="rls__para">{em(LARA_STORY.para3)}</p>

          <p className="rls__band">{LARA_STORY.band}</p>
        </div>
      </div>

      <div className="rls__right">
        <img className="rls__lara" src="/assets/results-lara.webp" alt="Lara Acosta — Forbes 30 Under 30" />
      </div>
    </section>
  );
}
