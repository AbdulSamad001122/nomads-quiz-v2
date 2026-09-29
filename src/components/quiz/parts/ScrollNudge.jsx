import { useEffect, useState } from 'react';
import './ScrollNudge.css';

/**
 * "Keep scrolling ↓" hint bubble (Yemi's follow-along ruling, Sep 29 —
 * option 2+3): a small Golfbays-style floating bubble that tells the taker
 * there's more slide below. Fades in shortly after load and hides for good
 * once they've scrolled most of a viewport. Decorative only: aria-hidden,
 * no pointer events, so it can never block a tap.
 *
 * tone: 'pink' on the maroon/green case studies, 'ice' on the blue advice
 * family — the light fills + thin ink border from the user's reference.
 */
export default function ScrollNudge({ tone = 'ice' }) {
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
      className={`scroll-nudge scroll-nudge--${tone}${hidden ? ' scroll-nudge--hidden' : ''}`}
      aria-hidden="true"
    >
      {/* min-content width wraps this onto two lines (user, Sep 29) */}
      <span className="scroll-nudge__text">Keep scrolling</span>
      {/* triple down-arrow doodle (landing set), recoloured to the dark
          plum #431232 (user, Sep 29) */}
      <img className="scroll-nudge__arrow" src="/assets/scroll-nudge-arrow.png" alt="" />
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
