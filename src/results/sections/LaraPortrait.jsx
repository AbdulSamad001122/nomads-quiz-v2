import { LARA_TITLE } from '../copy.js';
import './LaraPortrait.css';

/**
 * Lara Acosta's portrait with her full title set as text under her name —
 * shared by the Lara story and Pillar One · Situation 03. The image carries
 * the name art only; the title lives here so it stays sharp and editable.
 * `className` is the host section's sizing class (rls__lara / rpt__lara).
 */
export default function LaraPortrait({ className = '' }) {
  return (
    <figure className={`rlp ${className}`}>
      <img
        className="rlp__img"
        src="/assets/results-lara.webp"
        alt="Lara Acosta"
        width="839"
        height="976"
      />
      <figcaption className="rlp__title">
        {LARA_TITLE.map((line) => (
          <span className="rlp__line" key={line}>
            {line}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
