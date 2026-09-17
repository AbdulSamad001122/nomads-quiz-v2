import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Left-aligns a centered heading once it wraps to `threshold`+ lines.
 * Returns [ref, leftAlign, boxWidth] — attach the ref to the heading and add
 * a left-align class when the flag is true.
 *
 * boxWidth is the heading's rendered box width. Headings here are centred
 * max-width blocks, so anything that wants to line up with the heading's
 * text edge (the in-frame Continue button) has to match that box rather than
 * the container's padding edge — and measuring it beats duplicating the
 * `max-width: NNch` + font stack in a second rule that then drifts.
 */
export default function useLeftAlignOnWrap(threshold) {
  const ref = useRef(null);
  const [leftAlign, setLeftAlign] = useState(false);
  const [boxWidth, setBoxWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight);
      const rect = el.getBoundingClientRect();
      setLeftAlign(Math.round(rect.height / lineHeight) >= threshold);
      setBoxWidth(Math.round(rect.width));
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

  return [ref, leftAlign, boxWidth];
}
