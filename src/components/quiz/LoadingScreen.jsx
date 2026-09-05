import { useEffect } from 'react';
import './QuizScreen.css';
import './LoadingScreen.css';

/**
 * Loading slide (after Q11, before five-metrics) — fancy design per the
 * reference: full-bleed dark texture, keyline frame, compass gif,
 * "Calculating your current and potential Revenue per Visitor" with the
 * Better Brush "R" + cream phrase, and an animated progress bar.
 * Auto-advances after `durationMs`. Slots into the blue → maroon → green
 * rotation — the background comes from the active theme's dark texture.
 */
export default function LoadingScreen({ onDone, durationMs = 1500, theme }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs]);

  return (
    <div
      className="loading-screen"
      style={theme ? { '--ld-bg': `url(${theme.leftBgImage})` } : undefined}
    >
      <div className="ld__top">
        <div className="question-panel__logo-box">
          <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
        </div>
        <span className="ld__top-line" aria-hidden="true" />
      </div>

      <div className="ld__frame">
        <div className="ld__body">
          <img
            className="ld__compass"
            src="/assets/loading-compass.svg"
            alt=""
            aria-hidden="true"
          />
          <h1 className="ld__headline">
            {'Calculating your current and'}
            <br />
            {' potential '}
            <span className="ld__rev">
              <span className="ld__r" aria-hidden="true">
                R
              </span>
              evenue per Visitor
            </span>
          </h1>
          <div
            className="ld__bar"
            role="progressbar"
            aria-label="Calculating"
          >
            <div className="ld__fill" style={{ animationDuration: `${durationMs}ms` }} />
          </div>
        </div>

        <div className="ld__footer">
          <div className="ld__footer-hint" />
          <div className="ld__footer-cell">
            <img src="/assets/nomads-icon.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
