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
