/**
 * Which channel sent this visitor (UTM links) — for the RPV dashboard + Kit.
 *
 * Yemi's UTM links (Nov 12) all point at the landing page, e.g.
 *   https://diagnostic.nomadsmarketing.co/opt-in?utm_source=linkedin&utm_medium=social
 * The landing page (/opt-in) and the quiz (/diagnostic-start-now,
 * /diagnostic-results) share one domain, so both read the address bar on load
 * and keep the result in the same localStorage key. THIS FILE IS COPIED AS-IS
 * into the landing page repo (src/analytics/utmSource.js) — keep them equal.
 *
 * Two sets, both { source, medium }:
 *  - first:  the first UTMs this browser ever arrived with. Never overwritten.
 *  - latest: the UTMs of the most recent visit that had any (a later visit
 *            with no UTMs — typed address, bookmark — keeps it). So when they
 *            take the quiz, "latest" is the channel that brought them back.
 * Only utm_source and utm_medium are read (Yemi: "Just source + medium").
 * Values are reduced to a slug (lowercase a-z 0-9 _ -, max 100 chars), like
 * the popup source. Pop-up links carry ?popup=… and no UTMs, so they're
 * untouched by this.
 *
 * Never throws: with storage blocked the UTMs of this page load still count.
 */
export const UTM_KEY = 'nomadsUtm';
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

function load(storage) {
  if (!storage) return { first: null, latest: null };
  try {
    const raw = JSON.parse(storage.getItem(UTM_KEY));
    return raw && typeof raw === 'object'
      ? { first: clean(raw.first), latest: clean(raw.latest) }
      : { first: null, latest: null };
  } catch {
    return { first: null, latest: null };
  }
}

function browserStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // storage blocked
  }
}

/**
 * Reads this page load's UTMs, updates the saved first/latest, and returns
 * { first, latest } (each { source, medium } or null).
 */
export function captureUtm({ search, storage = browserStorage() } = {}) {
  const saved = load(storage);
  const now = readUtm(search);
  if (!now) return saved;
  const next = { first: saved.first || now, latest: now };
  if (storage) {
    try {
      storage.setItem(UTM_KEY, JSON.stringify(next));
    } catch {
      /* storage full / blocked: this page load still uses them */
    }
  }
  return next;
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

/** This page load's first/latest UTMs (captured once, when the app loads). */
export const utmState =
  typeof window === 'undefined' ? { first: null, latest: null } : captureUtm({ search: window.location.search });
