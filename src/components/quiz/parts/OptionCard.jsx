import useLongLabel from './useLongLabel.js';

/**
 * One answer option: numbered badge + label + radio indicator.
 * Width hugs its content (like the reference); selected state flips to the
 * theme's dark fill with white text. Labels that wrap past 2 lines switch
 * to the lighter/smaller "long label" style (weight 500, reduced size).
 */
export default function OptionCard({ number, label, selected, onSelect }) {
  const { rootRef, labelRef, isLong } = useLongLabel(2, [label]);

  return (
    <button
      type="button"
      ref={rootRef}
      className={`option-card${selected ? ' is-selected' : ''}${isLong ? ' option-card--long' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="option-card__number" aria-hidden="true">
        {number}
      </span>
      <span className="option-card__label" ref={labelRef}>
        {label}
      </span>
      <span className="option-card__radio" aria-hidden="true" />
    </button>
  );
}
