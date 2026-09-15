/**
 * THE dev-harness switch for deployed builds (?results, ?slides, ?check,
 * ?copy, ?preview, ?loading, ?goto).
 *
 *   true  → those routes work on the LIVE site: anyone who knows the params
 *           can open the full result page and the slide gallery without
 *           taking the quiz and without leaving an email.
 *   false → deployed builds serve only the real quiz; the harness code is
 *           tree-shaken out of the bundle entirely.
 *
 * User decision 2026-09-16: keep it ON while the team reviews on the live
 * URL — flip to false BEFORE LAUNCH (one line, then push). Local dev
 * (localhost) always has the harness regardless of this flag.
 */
export const DEV_ROUTES_ENABLED = true;
