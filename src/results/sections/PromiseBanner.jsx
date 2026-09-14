import { PROMISE_BANNER } from '../copy.js';
import './PromiseBanner.css';

/**
 * Section — "So this isn't a hollow …" compass-map banner (opens the
 * "How we calculated your RPV™" story; nav anchor target). Keyline frame,
 * brush-script "hollow", cream highlight span, chip straddling the bottom
 * keyline.
 */
export default function PromiseBanner() {
  return (
    <section className="rpb" id="how-we-calculated">
      <div className="rpb__keyline" aria-hidden="true" />
      <h2 className="rpb__headline">
        <span className="rpb__l1">
          {PROMISE_BANNER.line1Before} <span className="rpb__script">{PROMISE_BANNER.line1Script}</span>
        </span>{' '}
        <br />
        {PROMISE_BANNER.line2Before} <span className="rpb__hl">{PROMISE_BANNER.line2Highlight}</span>{' '}
        {PROMISE_BANNER.line3}
      </h2>
      <p className="rpb__sub">{PROMISE_BANNER.sub}</p>
      <p className="rpb__chip">{PROMISE_BANNER.chip}</p>
    </section>
  );
}
