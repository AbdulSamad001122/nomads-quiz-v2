import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the observed element first scrolls into view, then
 * stays true. Backs the scroll-triggered highlight sweep.
 * (Ported verbatim from rpv-landing-v3.)
 */
export default function useInView({ threshold = 0.2, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(node);
          }
        });
      },
      { threshold, rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
