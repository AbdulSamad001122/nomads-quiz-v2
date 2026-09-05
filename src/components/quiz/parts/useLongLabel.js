import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Detects when an option label wraps past `maxLines` at its BASE font style,
 * so the card can switch to a lighter/smaller "long label" style.
 *
 * The measurement always happens at base style: a `data-measuring` attribute
 * on the card briefly forces base font metrics (see QuizScreen.css), which
 * prevents the classic feedback loop where shrinking the text reduces the
 * line count and flips the style back. Runs before paint (no flicker), and
 * re-measures on resize + once fonts finish loading.
 *
 * Returns { rootRef, labelRef, isLong }.
 */
export default function useLongLabel(maxLines = 2, deps = []) {
  const rootRef = useRef(null);
  const labelRef = useRef(null);
  const [isLong, setIsLong] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const root = rootRef.current;
      const label = labelRef.current;
      if (!root || !label) return;
      root.setAttribute('data-measuring', '1');
      const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
      const lines = lineHeight
        ? Math.round(label.getBoundingClientRect().height / lineHeight)
        : 1;
      root.removeAttribute('data-measuring');
      setIsLong(lines > maxLines);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener('resize', measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { rootRef, labelRef, isLong };
}
