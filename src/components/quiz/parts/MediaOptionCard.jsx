import useLongLabel from './useLongLabel.js';

/**
 * Icon/GIF tile option (2-column grid style):
 * rounded card with a Better-Brush number badge in the top-right,
 * a circular media area (static icon OR animated gif — any image src),
 * a centered label, and a dark footer strip holding the radio indicator.
 * Selected state = card body tints ice while the footer stays dark.
 * Labels wrapping past 2 lines switch to the lighter/smaller style.
 */
export default function MediaOptionCard({ number, label, media, selected, onSelect }) {
  const { rootRef, labelRef, isLong } = useLongLabel(2, [label]);

  return (
    <button
      type="button"
      ref={rootRef}
      className={`media-option${selected ? ' is-selected' : ''}${isLong ? ' media-option--long' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="media-option__number" aria-hidden="true">
        {number}
      </span>
      <span className="media-option__body">
        <span className="media-option__circle" aria-hidden="true">
          {media ? <img src={media} alt="" /> : null}
        </span>
        <span className="media-option__label" ref={labelRef}>
          {label}
        </span>
      </span>
      <span className="media-option__footer">
        <span className="media-option__radio" aria-hidden="true" />
      </span>
    </button>
  );
}
