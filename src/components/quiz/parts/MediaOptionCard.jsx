import useLongLabel from './useLongLabel.js';

/**
 * Icon/GIF tile option (2-column grid style):
 * rounded card with a Better-Brush number badge in the top-right,
 * a circular media area (static icon OR animated gif — any image src),
 * a centered label, and a dark footer strip holding the radio indicator.
 * Selected state = card body tints ice while the footer stays dark.
 * Labels wrapping past 2 lines switch to the lighter/smaller style.
 */
export default function MediaOptionCard({
  number,
  label,
  sub,
  media,
  selected,
  onSelect,
}) {
  const { rootRef, labelRef, isLong } = useLongLabel(2, [label]);

  return (
    <button
      type="button"
      ref={rootRef}
      className={`media-option${selected ? ' is-selected' : ''}${isLong ? ' media-option--long' : ''}${sub ? ' media-option--sub' : ''}${media ? '' : ' media-option--nomedia'}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="media-option__number" aria-hidden="true">
        {number}
      </span>
      <span className="media-option__body">
        {media ? (
          <span className="media-option__circle" aria-hidden="true">
            <img src={media} alt="" />
          </span>
        ) : null}
        <span className="media-option__label" ref={labelRef}>
          {label}
          {sub ? <span className="media-option__sub">{sub}</span> : null}
        </span>
      </span>
      <span className="media-option__footer">
        <span className="media-option__radio" aria-hidden="true" />
      </span>
    </button>
  );
}
