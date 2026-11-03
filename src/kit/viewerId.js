/**
 * Who the quiz taker is in Kit — for the workshop page.
 *
 * The workshop video on nomadsmarketing.co/workshop (Framer) tags viewers in
 * Kit at 25 / 50 / 75 / 95 % watched (api/workshop-progress.js). It knows who
 * is watching from two link parameters, the same ones Kit adds to links in
 * its emails: ck_subscriber_id (their Kit id) and sh_kit (SHA-256 of their
 * email, so the id can't be faked). The Kit push returns the subscriber id;
 * we keep it with the hashed email, and every workshop link on the results
 * page gets both parameters at the moment it is clicked. The email itself
 * never goes into a link.
 */
const KEY = 'rpv_kit_viewer';
const WORKSHOP_HOST = 'nomadsmarketing.co';
const WORKSHOP_PATH = '/workshop';

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** After a Kit push: remember the taker's Kit id + hashed email. */
export async function saveKitViewer(email, subscriberId, storage = globalThis.localStorage) {
  if (!email || !subscriberId || !storage) return;
  try {
    const sh = await sha256Hex(String(email).trim().toLowerCase());
    storage.setItem(KEY, JSON.stringify({ id: String(subscriberId), sh }));
  } catch {
    /* private mode / storage full: the workshop just won't know them */
  }
}

export function readKitViewer(storage = globalThis.localStorage) {
  try {
    const v = JSON.parse(storage.getItem(KEY) || 'null');
    return v && /^\d+$/.test(v.id) && /^[a-f0-9]{64}$/.test(v.sh) ? v : null;
  } catch {
    return null;
  }
}

/** The workshop link with the two Kit parameters added (other links unchanged). */
export function withKitViewer(href, viewer = readKitViewer()) {
  if (!viewer) return href;
  try {
    const url = new URL(href);
    if (url.hostname.replace(/^www\./, '') !== WORKSHOP_HOST || !url.pathname.startsWith(WORKSHOP_PATH)) return href;
    url.searchParams.set('ck_subscriber_id', viewer.id);
    url.searchParams.set('sh_kit', viewer.sh);
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * Adds the parameters to any workshop link when it is clicked — every button
 * on the results page, including the ones inside the CRPV embed (shadow DOM),
 * without touching each section. Returns a function that removes it.
 */
export function installWorkshopLinkTagging(doc = document) {
  const onClick = (e) => {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [e.target];
    const link = path.find((n) => n && n.tagName === 'A' && n.href);
    if (!link) return;
    const next = withKitViewer(link.href);
    if (next !== link.href) link.href = next;
  };
  doc.addEventListener('click', onClick, true);
  doc.addEventListener('auxclick', onClick, true); // middle-click / open in new tab
  return () => {
    doc.removeEventListener('click', onClick, true);
    doc.removeEventListener('auxclick', onClick, true);
  };
}
