import { useEffect, useRef } from 'react';
import './AnswerCheckModal.css';
import './ResumePrompt.css';

/**
 * "Welcome back" — shown over the welcome screen when this browser has a
 * half-finished quiz saved (savedProgress.js). Same card, chip and button
 * language as the impossible-answer check (AnswerCheckModal).
 *
 * Copy is ours, not from a Nomads doc — FLAGGED for Yemi/Alefiya to approve.
 *
 * "Continue where I left off" — reopens the saved screen with every answer.
 * "Start over"                — deletes the saved progress; welcome screen.
 * Escape = continue (the choice that never loses anything).
 */
export default function ResumePrompt({ onContinue, onStartOver }) {
  const continueRef = useRef(null);

  useEffect(() => {
    continueRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onContinue();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onContinue]);

  return (
    <div className="qac qresume" role="presentation">
      <div
        className="qac__card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="qresume-title"
        aria-describedby="qresume-msg"
      >
        <span className="qac__chip">Welcome back</span>

        <p className="qac__msg" id="qresume-title">
          You&rsquo;re part-way through the diagnostic.
        </p>
        <p className="qresume__sub" id="qresume-msg">
          Pick up where you left off, or start again from the beginning.
        </p>

        <div className="qac__btns">
          <button
            type="button"
            ref={continueRef}
            className="q-btn qac__btn qresume__btn--continue"
            onClick={onContinue}
          >
            Continue where I left off
          </button>
          <button type="button" className="q-btn qac__btn" onClick={onStartOver}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
