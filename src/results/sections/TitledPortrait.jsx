import './TitledPortrait.css';

/**
 * A client portrait (name art baked into the image) with their title set as
 * plain white text under it — Lara in the Lara story + Pillar One ·
 * Situation 03, David in "Take my Client David". The title is text so it
 * stays sharp and editable.
 *
 * `inset` is where the name art's first letter starts, as a % of the image
 * width, so the title lines up under the name. `className` is the host
 * section's sizing class; `imgClassName` any extra class for the <img>.
 */
export default function TitledPortrait({
  src,
  alt,
  width,
  height,
  title,
  inset,
  className = '',
  imgClassName = '',
}) {
  return (
    <figure className={`rpo ${className}`} style={{ '--rpo-inset': inset }}>
      <img
        className={`rpo__img ${imgClassName}`}
        src={src}
        alt={alt}
        width={width}
        height={height}
      />
      <figcaption className="rpo__title">
        {title.map((line) => (
          <span className="rpo__line" key={line}>
            {line}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
