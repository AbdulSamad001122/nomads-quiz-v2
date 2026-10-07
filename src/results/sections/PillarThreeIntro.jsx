import { PILLAR_THREE_INTRO } from '../copy.js';
import './PillarThreeIntro.css';

/**
 * Pillar three — opening split: cream copy panel ("Pillar 03" chip, the
 * doc's heading, the tagline, the opening paragraph) and the dark panel
 * with the "THE TIMELINE" title (coded) over the Jobs-to-be-Done
 * timeline image.
 * Lives inside the pillars accordion (PANELS['03']).
 */
export default function PillarThreeIntro() {
  const p = PILLAR_THREE_INTRO;

  return (
    <div className="r3i">
      <div className="r3i__left">
        <div className="r3i__body">
          <span className="r3i__chip">{p.chip}</span>
          <h3 className="r3i__headline">{p.headline}</h3>
          <h4 className="r3i__lead">{p.lead}</h4>
          <p className="r3i__para">{p.para}</p>
        </div>
      </div>

      <div className="r3i__right">
        <div className="r3i__figure">
          <h4 className="r3i__art-title">{p.imageTitle}</h4>
          <img
            className="r3i__art"
            src="/assets/results-p3-timeline-journey.webp"
            alt={p.imageAlt}
            width="1120"
            height="808"
          />
        </div>
      </div>
    </div>
  );
}
