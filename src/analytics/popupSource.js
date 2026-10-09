/**
 * Which website popup sent this visitor to the quiz.
 *
 * Popup buttons on nomadsmarketing.co (Framer) open the quiz as
 *   /diagnostic-start-now?popup=97&page=home&type=inline
 * (the Framer tracking script adds page + type to the designer's ?popup=97).
 *
 * Read ONCE when the app loads: when the taker finishes, the address bar is
 * replaced with /diagnostic-results (no query) before quiz_complete fires.
 * The source is also remembered next to the saved results, so a reloaded or
 * reopened /diagnostic-results page (whose results CTAs still send cta_click)
 * keeps it. Each finished attempt overwrites it; a finish that didn't come
 * from a popup removes it; it's only used while those results still reopen.
 *
 * Values come from the address bar, so they're reduced to the same slug the
 * Framer script sends (lowercase a-z 0-9 _ -, max 100 chars = GA4's limit).
 */
import { currentRoute } from '../routes.js';
import { restoreSavedResults } from '../results/restoreResults.js';

export const SOURCE_KEY = 'nomadsPopupSource';
const MAX_LEN = 100;

/** Lowercase slug of a-z 0-9 _ - (other runs become "-"), or null if empty. */
export function slug(value) {
  const v = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_LEN)
    .replace(/-+$/, '');
  return v || null;
}

function fromParts(popup, page, type) {
  const p = slug(popup);
  return p ? { popup: p, page: slug(page), type: slug(type) } : null;
}

/** { popup, page, type } from a query string, or null when no popup. */
export function readPopupSource(search) {
  let params;
  try {
    params = new URLSearchParams(search || '');
  } catch {
    return null;
  }
  return fromParts(params.get('popup'), params.get('page'), params.get('type'));
}

function browserStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // storage blocked
  }
}

function loadRemembered(storage) {
  if (!storage) return null;
  try {
    const raw = JSON.parse(storage.getItem(SOURCE_KEY));
    return raw && typeof raw === 'object' ? fromParts(raw.popup, raw.page, raw.type) : null;
  } catch {
    return null;
  }
}

/**
 * The source for this page load: the address bar's ?popup=…, or — on a
 * reopened /diagnostic-results page — the one remembered with the results.
 * The remembered one is only used when those results really reopen (the same
 * check SavedResultsRoute makes): once they're cleared, expired or no longer
 * valid, the visit is sent to the start and must not carry an old popup.
 */
export function resolvePopupSource({
  search,
  pathname,
  storage,
  resultsReopen = () => restoreSavedResults({ storage }) != null,
}) {
  const fromUrl = readPopupSource(search);
  if (fromUrl) return fromUrl;
  if (currentRoute(pathname) !== 'results') return null;
  const remembered = loadRemembered(storage);
  if (!remembered) return null;
  try {
    return resultsReopen() ? remembered : null;
  } catch {
    return null;
  }
}

export const popupSource =
  typeof window === 'undefined'
    ? null
    : resolvePopupSource({
        search: window.location.search,
        pathname: window.location.pathname,
        storage: browserStorage(),
      });

/** Call when results are saved: keeps this attempt's source with them. */
export function rememberPopupSource({ source = popupSource, storage = browserStorage() } = {}) {
  if (!storage) return;
  try {
    if (source) storage.setItem(SOURCE_KEY, JSON.stringify(source));
    else storage.removeItem(SOURCE_KEY);
  } catch {
    /* storage blocked / full: results still show, attribution just isn't kept */
  }
}

/** GA4 params for a source (names match the GA4 custom dimensions). */
export function popupGaParams(source) {
  if (!source) return {};
  const out = { popup_id: source.popup };
  if (source.page) out.page = source.page;
  if (source.type) out.popup_type = source.type;
  return out;
}
