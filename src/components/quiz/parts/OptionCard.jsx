import useLongLabel from './useLongLabel.js';

/**
 * One answer option: numbered badge + label + radio indicator.
 * Width hugs its content (like the reference); selected state flips to the
 * theme's dark fill with white text. Labels that wrap past 2 lines switch
 * to the lighter/smaller "long label" style (weight 500, reduced size).
 */
export default function OptionCard({
  number,
  heading,
  label,
  sub,
  iconSrc,
  rich,
  selected,
  onSelect,
}) {
  const { rootRef, labelRef, isLong } = useLongLabel(2, [label]);

  // "rich" cards (Q5): icon header row + multi-paragraph body with bolds
  if (rich) {
    return (
      <button
        type="button"
        className={`option-card option-card--rich${selected ? ' is-selected' : ''}`}
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span className="option-card__richtop">
          <span className="option-card__number" aria-hidden="true">
            {number}
          </span>
          {iconSrc ? (
            <img
              className="option-card__icon"
              src={iconSrc}
              alt=""
              aria-hidden="true"
            />
          ) : null}
          <span className="option-card__radio" aria-hidden="true" />
        </span>
        <span className="option-card__richbody">
          {rich.map((para, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <span className="option-card__para" key={i}>
              {para.map((seg, j) =>
                seg.b ? (
                  // eslint-disable-next-line react/no-array-index-key
                  <strong key={j}>{seg.t}</strong>
                ) : (
                  seg.t
                ),
              )}
            </span>
          ))}
        </span>
      </button>
    );
  }

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
        {heading ? (
          <span className="option-card__heading">{heading}</span>
        ) : null}
        {label}
        {sub ? <span className="option-card__sub">{sub}</span> : null}
      </span>
      <span className="option-card__radio" aria-hidden="true" />
    </button>
  );
}
