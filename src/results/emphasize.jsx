/**
 * Wraps a few key phrases of a copy string in <strong> so they read a touch
 * bolder, without editing the verbatim copy itself. `phrases` are matched
 * literally (first occurrence of each, in text order); anything not listed
 * passes through untouched.
 *
 *   emphasize('sites with 50, 60, 70% bounce rates.', ['50, 60, 70% bounce rates'])
 */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function emphasize(text, phrases = []) {
  if (!phrases.length || !text) return text;
  const re = new RegExp(`(${phrases.map(escapeRe).join('|')})`);
  return text.split(re).map((part, i) =>
    phrases.includes(part) ? (
      <strong key={i} className="results-em">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Keeps the last two words of a heading segment together, so a forced line
 * break before it can't strand the final word alone on a phone ("…promise").
 * Words unchanged; only the wrap point moves.
 */
export function keepLastTwo(text) {
  if (!text) return text;
  const i = text.lastIndexOf(' ', text.lastIndexOf(' ') - 1);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i + 1)}
      <span className="results-nowrap">{text.slice(i + 1)}</span>
    </>
  );
}
