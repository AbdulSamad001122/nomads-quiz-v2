import { STOP_OR_PUSH, CTA } from '../copy.js';
import { fill } from '../resolveTokens.js';
import { stairsSteps } from '../stairs.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './StopOrPush.css';

/**
 * The end of the "stop at $1.5M / push to the max" story: the scepticism
 * block ("It is a stretch, which is why nobody gets there in one jump", only
 * when the max is beyond 3× today — Cap Logic, Nov 4) and the workshop note +
 * button. It sits right under StopOrPushCards (2.0 FINAL RP QC #4 + #5, her
 * simpler two cards and bars), which replaced this section's old cards and
 * bars once approved (Nov 7).
 *
 * ResultsPage renders this only for non-capped takers: capped takers
 * (Blocks 5–7, which include a max that isn't above the goal) read their
 * capped card instead — Cap Logic step 7: "hide this section and show
 * blocks 5, 6, and 7 instead".
 */
export default function StopOrPush({ result, tokens }) {
  const c = STOP_OR_PUSH;
  const t = (s) => fill(s, tokens);
  const btnWords = c.button.split(' ');
  const btnLast = btnWords.pop();
  const btnHead = btnWords.join(' ');
  const stairs = stairsSteps(c.stairs, result.capped.maxMultiple);
  const stairsLabel = fill(c.stairsLabel, Object.fromEntries(stairs.map((s, i) => [`s${i}`, s.x])));

  return (
    <section className="rso rso--tail">
      <div className="rso__inner">
        {result.capped.showStretch && (
          <div className="rso__real">
            <div>
              <div className="rso__who">
                <img src="/assets/results-alefiya-headshot.webp" alt={c.whoName} width="192" height="192" />
                <div>
                  <b>{c.whoName}</b>
                  <small>{c.whoRole}</small>
                </div>
              </div>
              <span className="rso__eyebrow rso__eyebrow--chip">{t(c.realEyebrow)}</span>
              <h3 className="rso__real-head">{c.realHead}</h3>
              <p className="rso__real-p">{c.realP1}</p>
              <p className="rso__real-p">{emphasize(c.realP2, [c.realP2Bold])}</p>
            </div>
            {/* bars and captions in two rows, so every bar stands on the same
                baseline however long its caption wraps (user, Oct 30) */}
            <div className="rso__stairs" role="img" aria-label={stairsLabel}>
              <div className="rso__stairs-row rso__stairs-row--bars">
                {stairs.map((s, i) => (
                  <div key={s.cap} className={`rso__st rso__st--${i}`}>
                    {i === 0 && <span className="rso__st-lab">{s.x}</span>}
                    <div className="rso__blk" style={{ height: `${s.height}px` }}>
                      {i === 0 ? null : s.x}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rso__stairs-row">
                {stairs.map((s, i) => (
                  <span key={s.cap} className={`rso__cap rso__cap--${i}`}>
                    {s.cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="rso__next">
          <p>{c.next}</p>
          {/* TODO: real workshop URL — the "Watch the Workshop" page (QC item 8) */}
          <a className="rso__btn" href={CTA.workshop.href} {...(CTA.workshop.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : null)} onClick={() => ga.ctaClick(CTA.workshop.id)}>
            {/* the arrow hugs the last word, so it never strands alone */}
            <span>
              {btnHead}{' '}
              <span className="rso__nowrap">
                {btnLast}
                <span aria-hidden="true">{' '}→</span>
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
