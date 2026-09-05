import useInView from '../../hooks/useInView.js';
import './HighlightSweep.css';

/**
 * Scroll-triggered highlight wipe, ported verbatim from rpv-landing-v3:
 * the wrapped phrase gets a colored box that sweeps in from the left as
 * the heading scrolls into view, and the text switches to the revealed
 * color exactly under the sweep edge. Copy is untouched — children
 * render verbatim.
 *
 * `tone` picks the background/foreground pair (see HighlightSweep.css).
 */
export default function HighlightSweep({ children, tone = 'plum', className = '' }) {
  const [ref, inView] = useInView();

  return (
    <span
      ref={ref}
      className={`hl-sweep hl-sweep--${tone} ${className} ${inView ? 'hl-sweep--in' : ''}`}
    >
      <span className="hl-sweep__text">{children}</span>
    </span>
  );
}

/** Sweep tone that reads correctly on each quiz theme's dark panel. */
export function sweepToneFor(themeName) {
  return themeName === 'maroon' ? 'cream4' : 'iceblue';
}
