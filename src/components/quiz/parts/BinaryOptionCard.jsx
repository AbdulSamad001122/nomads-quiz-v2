const ICONS = {
  tick: '/assets/tick-blue.png',
  cross: '/assets/cross-blue.png',
};

/**
 * Yes/No (binary) answer option:
 * a Better-Brush letter badge OUTSIDE the pill, then a fully-rounded pill
 * holding a large ice icon circle (tick/cross) + label + radio indicator.
 * Selected state = theme dark fill with white text (same as list options).
 */
export default function BinaryOptionCard({ letter, label, icon, selected, onSelect }) {
  return (
    <div className="binary-option">
      <span className="binary-option__letter" aria-hidden="true">
        {letter}
      </span>
      <button
        type="button"
        className={`binary-option__pill${selected ? ' is-selected' : ''}`}
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span className="binary-option__icon" aria-hidden="true">
          <img src={ICONS[icon]} alt="" />
        </span>
        <span className="binary-option__label">{label}</span>
        <span className="binary-option__radio" aria-hidden="true" />
      </button>
    </div>
  );
}
