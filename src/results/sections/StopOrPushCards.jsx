import { STOP_OR_PUSH_NEW } from '../copy.js';
import { fill } from '../resolveTokens.js';
import HighlightSweep from '../../components/primitives/HighlightSweep.jsx';
import './StopOrPushCards.css';

/* the check-circle in the green "per visitor" boxes (her design) */
function Tick() {
  return (
    <svg className="rsn__tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="12" />
      <path d="M6.8 12.4l3.4 3.4 7-7.2" />
    </svg>
  );
}

/**
 * 2.0 FINAL RP QC #4 (Alefiya, Nov 4, doc row 5 + image 04): the simpler
 * "You can stop at $1.5M. Or push all 5 metrics to their max." — two cards
 * joined by "Buuuuuut…", her words and layout, brand colours. "Keep the copy
 * and the visuals this simple. The current version feels really overwhelming
 * because there's a lot of microcopy there."
 *
 * DRAFT: shown under the current section so the two can be compared
 * (user, Nov 6); the old cards are removed once this one is approved. The
 * bars below the cards (#5) are not part of this change.
 */
export default function StopOrPushCards({ tokens }) {
  const c = STOP_OR_PUSH_NEW;
  const t = (s) => fill(s, tokens);
  const rightBig = t(c.rightBig);
  return (
    <section className="rsn" aria-label={`${c.head1Before} ${c.head1Hl} ${c.head2}`}>
      <div className="rsn__inner">
        <h2 className="rsn__headline">
          <span className="rsn__line">
            {c.head1Before}{' '}
            <HighlightSweep tone="iceblue" className="rsn__hl">
              {c.head1Hl}
            </HighlightSweep>
          </span>
          <span className="rsn__line">{c.head2}</span>
        </h2>

        <div className="rsn__steps">
          <div className="rsn__card rsn__card--stop">
            <p className="rsn__say">{c.leftIntro}</p>
            <div className="rsn__pair">
              <span className="rsn__box rsn__box--now">
                <b>{tokens.current_rpv}</b>
                <small>{c.perVisitor}</small>
              </span>
              <span className="rsn__to">{c.leftTo}</span>
            </div>
            <span className="rsn__box rsn__box--goal">
              <b>
                <Tick />
                {tokens.goal_rpv}
              </b>
              <small>{c.perVisitor}</small>
            </span>
            <p className="rsn__say">{c.leftAdd}</p>
            {/* each big figure is as large as its card allows (its length) */}
            <p className="rsn__big" style={{ '--rsn-len': c.leftBig.length }}>
              {c.leftBig}
              <small>{c.perYear}</small>
            </p>
            <hr className="rsn__rule" />
            <p className="rsn__p">
              {c.leftMonthBefore} <b>{c.leftMonthBold}</b> {c.leftMonthAfter}
            </p>
            <p className="rsn__p rsn__nope">
              <mark>{c.leftNope}</mark>
            </p>
          </div>

          <div className="rsn__but">
            <svg className="rsn__arrow" viewBox="0 0 48 32" aria-hidden="true" focusable="false">
              <path d="M4 16h36M27 5l13 11-13 11" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>{c.but}</p>
          </div>

          <div className="rsn__card rsn__card--max">
            <p className="rsn__say">{c.rightIntro}</p>
            <span className="rsn__box rsn__box--goal rsn__box--max">
              <b>
                <Tick />
                {tokens.max_rpv}
              </b>
              <small>{c.perVisitor}</small>
            </span>
            <p className="rsn__say">{c.rightAdd}</p>
            <p className="rsn__big rsn__big--max" style={{ '--rsn-len': rightBig.length }}>
              {rightBig}
              <small>{c.perYear}</small>
            </p>
            <hr className="rsn__rule" />
            {/* no multiple to show (max barely above today): no empty line */}
            {tokens.max_multiple && <p className="rsn__times">{t(c.rightTimes)}</p>}
            <span className="rsn__yep">{c.yep}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
