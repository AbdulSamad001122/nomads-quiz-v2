import { useEffect, useRef } from 'react';
import './AnswerCheckModal.css';

/**
 * The doc's impossible-answer confirmation (Quiz Logics.docx · Manual entry &
 * validation). Fires on advancing when two answers contradict each other.
 *
 * Both the message and the two button labels are VERBATIM from the doc, which
 * also defines what each button does:
 *   "Go back and check" — returns, answer preserved
 *   "Keep my answers"   — advances, clamps at ceiling, tags the record unverified
 *
 * The doc gives no heading for this, so the sentence is the heading.
 */
export default function AnswerCheckModal({ message, onBack, onKeep }) {
  const backRef = useRef(null);

  // Focus the safe choice, and let Escape act as "go back and check" — both
  // routes preserve the answer, so Escape can never lose what they typed.
  useEffect(() => {
    backRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  return (
    <div className="qac" role="presentation">
      <div
        className="qac__card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="qac-msg"
      >
        <span className="qac__chip">Quick check</span>

        <p className="qac__msg" id="qac-msg">
          {message}
        </p>

        <div className="qac__btns">
          <button
            type="button"
            ref={backRef}
            className="q-btn qac__btn qac__btn--back"
            onClick={onBack}
          >
            Go back and check
          </button>
          <button type="button" className="q-btn qac__btn qac__btn--keep" onClick={onKeep}>
            Keep my answers
          </button>
        </div>
      </div>
    </div>
  );
}
