/**
 * Keeps one phrase of a label on a single line (e.g. "Game-Plan Call", which
 * would otherwise break after its hyphen) without changing the words. The
 * whole label comes back in ONE span, so inside a flex button it stays a
 * single flex item and wraps as normal text.
 */
export function keepTogether(text, phrase) {
  if (!phrase || !text.includes(phrase)) return text;
  const [before, after] = text.split(phrase);
  return (
    <span>
      {before}
      <span style={{ whiteSpace: 'nowrap' }}>{phrase}</span>
      {after}
    </span>
  );
}
