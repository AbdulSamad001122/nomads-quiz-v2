import useLongLabel from './useLongLabel.js';

/**
 * One answer option: numbered badge + label + radio indicator.
 * Width hugs its content (like the reference); selected state flips to the
 * theme's dark fill with white text. Labels that wrap past 2 lines switch
 * to the lighter/smaller "long label" style (weight 500, reduced size).
 * With `desc` (Q5) the label is a bold title over a lighter description line.
 * `mark` = words inside the label shown with a marker highlight; `media` = a
 * small icon on the right of the text (Q13, Quiz QC Oct 31).
 */
function withMark(label, mark) {
  const at = mark ? label.indexOf(mark) : -1;
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <mark className="option-card__mark">{mark}</mark>
      {label.slice(at + mark.length)}
    </>
  );
}

export default function OptionCard({
  number,
  heading,
  label,
  desc,
  sub,
  mark,
  media,
  selected,
  onSelect,
}) {
  const { rootRef, labelRef, isLong } = useLongLabel(2, [label]);

  return (
    <button
      type="button"
      ref={rootRef}
      className={`option-card${selected ? ' is-selected' : ''}${isLong ? ' option-card--long' : ''}${desc ? ' option-card--desc' : ''}`}
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
        {desc ? (
          <>
            <span className="option-card__title">{label}</span>
            <span className="option-card__desc">{desc}</span>
          </>
        ) : (
          withMark(label, mark)
        )}
        {sub ? <span className="option-card__sub">{sub}</span> : null}
      </span>
      {media ? (
        <span className="option-card__icon" aria-hidden="true">
          <img src={media} alt="" />
        </span>
      ) : null}
      <span className="option-card__radio" aria-hidden="true" />
    </button>
  );
}
