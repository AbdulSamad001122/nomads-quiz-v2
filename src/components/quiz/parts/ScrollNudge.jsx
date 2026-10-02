import { useEffect, useState } from 'react';
import './ScrollNudge.css';

/**
 * "KEEP SCROLLING" hint bubble (Yemi's follow-along ruling, Sep 29 —
 * option 2+3), rebuilt to the user's Sep 30 reference: solid navy message
 * bubble fixed at the bottom-right (position per the user's screenshot),
 * white Kilimanjaro caps on two lines, the triple-arrow doodle beside
 * "KEEP", a flick doodle off the top-left corner. One design on every
 * slide family now — callers still pass the old `tone` prop; it's ignored.
 * Fades in shortly after load and hides for good once they've scrolled
 * most of a viewport. Decorative only: aria-hidden, no pointer events,
 * so it can never block a tap.
 */
export default function ScrollNudge() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hidden) return undefined;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.9) setHidden(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [hidden]);

  return (
    <div
      className={`scroll-nudge${hidden ? ' scroll-nudge--hidden' : ''}`}
      aria-hidden="true"
    >
      <img className="scroll-nudge__flick" src="/assets/scroll-nudge-flick-white.png" alt="" />
      <span className="scroll-nudge__line scroll-nudge__line--keep">
        Keep
        {/* triple down-arrow doodle (landing set), white cut */}
        <img className="scroll-nudge__arrow" src="/assets/scroll-nudge-arrow-white.png" alt="" />
      </span>
      <span className="scroll-nudge__line">scrolling</span>
    </div>
  );
}

/**
 * Top "Follow along" click (Yemi option 3): smooth-scrolls to the section
 * after the one holding the button, instead of advancing the quiz. The end
 * CTA is what moves to the next question now.
 */
export function scrollToNextSection(e) {
  e.currentTarget
    .closest('section')
    ?.nextElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
