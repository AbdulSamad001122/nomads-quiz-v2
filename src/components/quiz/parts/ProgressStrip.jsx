import { useEffect } from 'react';
import './ProgressStrip.css';

/**
 * Coloured progress strip pinned to the top of every quiz screen — questions
 * AND the educational slides (Alefiya review, 2026-09-17: the taker needs to
 * see the quiz is still running while they read a slide).
 *
 * The percentage comes from the taker's whole journey, not the question
 * number, so it moves on EVERY screen and can never sit frozen while they
 * read two or three slides in a row.
 */
export default function ProgressStrip({ percent, theme }) {
  // Insets the app below the fixed strip (see the CSS) — a body class so it
  // works for every screen root without naming them one by one, and it
  // disappears cleanly on the welcome/results screens where there's no strip.
  useEffect(() => {
    document.body.classList.add('has-qps');
    return () => document.body.classList.remove('has-qps');
  }, []);

  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="qps"
      style={{
        '--qps-fill': theme?.progressFill || '#5d1b4e',
        '--qps-track': theme?.progressTrack || 'rgba(0, 0, 0, 0.16)',
        '--qps-label': theme?.progressLabel || '#152638',
        '--qps-bg': theme?.rightBg || '#f2e6d8',
      }}
    >
      <img
        className="qps__logo"
        src="/assets/nomads-logo-dark.png"
        alt="Nomads"
      />

      <div
        className="qps__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
      >
        <div className="qps__fill" style={{ width: `${clamped}%` }} />
      </div>
      <p className="qps__label">{clamped}% Complete</p>
    </div>
  );
}
