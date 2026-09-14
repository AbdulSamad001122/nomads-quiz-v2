import { useState } from 'react';
import AnswerCheckModal from './components/quiz/AnswerCheckModal.jsx';
import { impossibleCheck } from './calc/validation.js';

/**
 * DEV ONLY — `?check=subs` / `?check=email` — the impossible-answer
 * confirmation on its own, so it can be reviewed without walking the quiz.
 * The messages come from impossibleCheck, exactly as the real screens get
 * them, so this preview can never drift from what a taker sees.
 */
const CASES = {
  subs: {
    qid: 'q8',
    resolved: { q7: 4000, q8: 75000 },
    title: 'Q8 · more new subscribers than visitors',
    detail: 'Fires leaving Q8 when subscribers/month ≥ visitors/month. Here: 75,000 subscribers from 4,000 visitors.',
  },
  email: {
    qid: 'q11',
    resolved: { q2: 810000, q11: 1750000 },
    title: 'Q11 · more email revenue than total revenue',
    detail: 'Fires leaving Q11 when email revenue > total revenue. Here: $1,750,000 from email on $810,000 total.',
  },
};

export default function DevAnswerCheck({ which }) {
  const c = CASES[which] || CASES.subs;
  const trip = impossibleCheck(c.qid, c.resolved);
  const [open, setOpen] = useState(true);
  const [choice, setChoice] = useState(null);

  const pick = (label) => {
    setChoice(label);
    setOpen(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#152638',
        color: '#e4fbff',
        fontFamily: "'Roboto Mono', monospace",
        padding: '48px clamp(20px, 6vw, 80px)',
      }}
    >
      <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', margin: 0 }}>
        Impossible-answer check <span style={{ opacity: 0.5, fontSize: 14 }}>(dev harness — not shipped)</span>
      </h1>
      <p style={{ fontSize: 14, marginTop: 10 }}>{c.title}</p>
      <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.75, maxWidth: 680 }}>{c.detail}</p>
      <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.75, maxWidth: 680 }}>
        Message and button labels are verbatim from Quiz Logics.docx · Manual entry &amp;
        validation. In the real quiz, “Keep my answers” also clamps the value at its ceiling
        and tags the Kit record unverified.
      </p>

      {choice ? (
        <p style={{ marginTop: 26, fontSize: 14 }}>
          You picked <strong style={{ color: '#fff' }}>{choice}</strong>.{' '}
          <button
            type="button"
            onClick={() => { setChoice(null); setOpen(true); }}
            style={{
              fontFamily: "'Roboto Mono', monospace", fontSize: 13, cursor: 'pointer',
              background: '#cae1f4', color: '#152638', border: 'none', padding: '6px 14px',
            }}
          >
            Show it again ↻
          </button>
        </p>
      ) : null}

      <p style={{ marginTop: 30, fontSize: 13, opacity: 0.6 }}>
        Other case:{' '}
        <a href={which === 'email' ? '/?check=subs' : '/?check=email'} style={{ color: '#e4fbff' }}>
          {which === 'email' ? 'subscribers vs visitors' : 'email revenue vs total revenue'}
        </a>
        {'  ·  '}
        <a href="/?slides" style={{ color: '#e4fbff' }}>back to the slide gallery</a>
      </p>

      {open ? (
        <AnswerCheckModal
          message={trip.message}
          onBack={() => pick('Go back and check')}
          onKeep={() => pick('Keep my answers')}
        />
      ) : null}
    </div>
  );
}
