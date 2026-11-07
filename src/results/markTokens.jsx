import { Fragment } from 'react';
import { fill } from './resolveTokens.js';

/**
 * Fills a copy template like `fill`, but wraps the taker-specific figures in
 * a highlight so they read as "based on your answers" (2.0 FINAL RP QC #8,
 * Alefiya: "all the numbers that are logic-based, like those that are coming
 * from their inputs, shall have a green or red, or a number that shows that
 * it is based on the numbers that they put in").
 *
 * `marks` is a list of [piece, className]: `piece` is a literal part of the
 * template (it may contain {{tokens}}, e.g. '{{email_percentage}}%'); each
 * occurrence renders as <span className={className}>…</span>. The words stay
 * exactly the template's.
 */
export function markTokens(template, tokens, marks) {
  let parts = [{ s: template, cls: null }];
  for (const [piece, cls] of marks) {
    parts = parts.flatMap((p) => {
      if (p.cls) return [p];
      const out = [];
      p.s.split(piece).forEach((seg, i) => {
        if (i) out.push({ s: piece, cls });
        if (seg) out.push({ s: seg, cls: null });
      });
      return out;
    });
  }
  return parts.map((p, i) =>
    p.cls ? (
      <span key={i} className={p.cls}>
        {fill(p.s, tokens)}
      </span>
    ) : (
      <Fragment key={i}>{fill(p.s, tokens)}</Fragment>
    ),
  );
}
