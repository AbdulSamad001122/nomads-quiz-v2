import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Left-aligns a centered heading once it wraps to `threshold`+ lines.
 * Returns [ref, leftAlign] — attach the ref to the heading and add a
 * left-align class when the flag is true.
 */
export default function useLeftAlignOnWrap(threshold) {
  const ref = useRef(null);
  const [leftAlign, setLeftAlign] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
      const lines = Math.round(el.getBoundingClientRect().height / lineHeight);
      setLeftAlign(lines >= threshold);
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [threshold]);

  return [ref, leftAlign];
}
