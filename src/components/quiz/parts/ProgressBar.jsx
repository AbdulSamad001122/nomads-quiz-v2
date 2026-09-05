/** Thin progress track + "X% Complete" label, bottom of the answer panel. */
export default function ProgressBar({ percent }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress__fill" style={{ width: `${clamped}%` }} />
      </div>
      <p className="progress__label">{clamped}% Complete</p>
    </div>
  );
}
