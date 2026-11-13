/**
 * Which channel sent this visitor (UTM links) — for the RPV dashboard + Kit.
 *
 * Yemi's UTM links (Nov 12) all point at the landing page, e.g.
 *   https://diagnostic.nomadsmarketing.co/opt-in?utm_source=linkedin&utm_medium=social
 * The landing page (/opt-in) and the quiz (/diagnostic-start-now,
 * /diagnostic-results) share one domain, so both read the address bar on load
 * and keep the result in the same browser storage. THIS FILE IS COPIED AS-IS
 * into the landing page repo (src/analytics/utmSource.js) — keep them equal.
 *
 * Two sets, both { source, medium } (Yemi's spec):
 *  - first:  "the first UTMs we ever saw for this browser, never overwritten"
 *            → localStorage, kept for good.
 *  - latest: "the UTMs on the visit where they actually took the quiz"
 *            → sessionStorage, i.e. this visit (this browser tab) only. It
 *            carries over from /opt-in into the quiz and the results page,
 *            and a newer UTM link in the same visit replaces it. A new visit
 *            that came without UTMs (typed address, bookmark, a Framer
 *            pop-up) has no latest touch, so it is never credited to an old
 *            campaign.
 * Only utm_source and utm_medium are read (Yemi: "Just source + medium").
 * Values are reduced to a slug (lowercase a-z 0-9 _ -, max 100 chars), like
 * the popup source. Pop-up links carry ?popup=… and no UTMs, so they're
 * untouched by this.
 *
 * Read fresh on every event, so another tab's newer first touch is seen too.
 * Never throws: with storage blocked, this page load's UTMs still count.
 */
export const UTM_KEY = 'nomadsUtm'; // localStorage: { first }
export const UTM_LATEST_KEY = 'nomadsUtmLatest'; // sessionStorage: { source, medium }
const MAX_LEN = 100;

/** Lowercase slug of a-z 0-9 _ - (other runs become "-"), or null if empty. */
export function utmSlug(value) {
  const v = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_LEN)
    .replace(/-+$/, '');
  return v || null;
}

/** { source, medium } from a query string, or null when it has neither. */
export function readUtm(search) {
  let params;
  try {
    params = new URLSearchParams(search || '');
  } catch {
    return null;
  }
  const source = utmSlug(params.get('utm_source'));
  const medium = utmSlug(params.get('utm_medium'));
  return source || medium ? { source, medium } : null;
}

function clean(touch) {
  if (!touch || typeof touch !== 'object') return null;
  const source = utmSlug(touch.source);
  const medium = utmSlug(touch.medium);
  return source || medium ? { source, medium } : null;
}

function readJson(storage, key) {
  if (!storage) return null;
  try {
    return JSON.parse(storage.getItem(key));
  } catch {
    return null;
  }
}

function writeJson(storage, key, value) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / blocked: this page load still uses them */
  }
}

function browserStorage(name) {
  try {
    return typeof window !== 'undefined' ? window[name] : null;
  } catch {
    return null; // storage blocked
  }
}

/** Saved state: { first, latest } (each { source, medium } or null). */
export function loadUtm({ storage = browserStorage('localStorage'), session = browserStorage('sessionStorage') } = {}) {
  const saved = readJson(storage, UTM_KEY);
  return {
    first: clean(saved && typeof saved === 'object' ? saved.first : null),
    latest: clean(readJson(session, UTM_LATEST_KEY)),
  };
}

/**
 * Reads this page load's UTMs and updates first (only if never set) and
 * latest (this visit). Returns the new { first, latest }.
 */
export function captureUtm({
  search,
  storage = browserStorage('localStorage'),
  session = browserStorage('sessionStorage'),
} = {}) {
  const saved = loadUtm({ storage, session });
  const now = readUtm(search);
  if (!now) return saved;
  const first = saved.first || now;
  if (!saved.first) writeJson(storage, UTM_KEY, { first });
  writeJson(session, UTM_LATEST_KEY, now);
  return { first, latest: now };
}

/** The four event params for the RPV dashboard (only the ones we have). */
export function utmEventParams(state) {
  const out = {};
  if (!state) return out;
  if (state.first?.source) out.first_utm_source = state.first.source;
  if (state.first?.medium) out.first_utm_medium = state.first.medium;
  if (state.latest?.source) out.utm_source = state.latest.source;
  if (state.latest?.medium) out.utm_medium = state.latest.medium;
  return out;
}

/** The four Kit custom fields (keys Yemi asked Nomads to create, Nov 12). */
export function utmKitFields(state) {
  const p = utmEventParams(state);
  const out = {};
  if (p.first_utm_source) out.quiz_taker_first_utm_source = p.first_utm_source;
  if (p.first_utm_medium) out.quiz_taker_first_utm_medium = p.first_utm_medium;
  if (p.utm_source) out.quiz_taker_utm_source = p.utm_source;
  if (p.utm_medium) out.quiz_taker_utm_medium = p.utm_medium;
  return out;
}

// Captured once when the app loads (also the fallback if storage is blocked).
const loaded =
  typeof window === 'undefined' ? { first: null, latest: null } : captureUtm({ search: window.location.search });

/** Current { first, latest }: read fresh from storage, else what this page load saw. */
export function currentUtm() {
  const now = loadUtm();
  return { first: now.first || loaded.first, latest: now.latest || loaded.latest };
}
