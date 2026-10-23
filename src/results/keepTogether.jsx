/**
 * Keeps one phrase of a label on a single line (e.g. "Game-Plan Call", which
 * would otherwise break after its hyphen) without changing the words. The
 * whole label comes back in ONE span, so inside a flex button it stays a
 * single flex item and wraps as normal text. Only the first occurrence is
 * held together; the rest of the label passes through untouched.
 */
export function keepTogether(text, phrase) {
  const at = phrase && typeof text === 'string' ? text.indexOf(phrase) : -1;
  if (at < 0) return text;
  return (
    <span>
      {text.slice(0, at)}
      <span style={{ whiteSpace: 'nowrap' }}>{phrase}</span>
      {text.slice(at + phrase.length)}
    </span>
  );
}
