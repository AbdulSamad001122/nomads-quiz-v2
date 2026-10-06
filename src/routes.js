/**
 * Public addresses of the quiz on diagnostic.nomadsmarketing.co. The landing
 * project owns the domain and passes these two paths through to this project
 * (see the landing repo's vercel.json); this project's own vercel.json serves
 * them too, so they also work on nomads-quiz.vercel.app. "/" keeps working
 * as the quiz on the vercel.app address.
 */
export const START_PATH = '/diagnostic-start-now';
export const RESULTS_PATH = '/diagnostic-results';

/** 'results' on the results address (trailing slashes ignored), else 'quiz'. */
export function currentRoute(pathname = window.location.pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  return p === RESULTS_PATH ? 'results' : 'quiz';
}
