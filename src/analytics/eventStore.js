/**
 * Event store — mirrors each GA4 event into the RPV dashboard's database
 * (Supabase) so the dashboard can follow one quiz taker from first question
 * to booked call and revenue (GA4 can't join those).
 *
 * Safe by design:
 *  - Fire-and-forget. It never throws and never delays the quiz; if the
 *    database is down, the quiz carries on and only this copy is lost.
 *  - Same on/off switch as GA4: production builds always send; `npm run dev`
 *    only sends when VITE_GA_DEV=true.
 *  - Insert-only. The key below is Supabase's public key (it ships in the
 *    browser like the GA4 and Clarity IDs). Row-level security lets it add
 *    rows but never read, change or delete them.
 *  - Every row is tagged with where it came from (production / preview /
 *    development), so test runs on preview links don't count in the
 *    dashboard's real numbers.
 */
import { utmEventParams, utmState } from './utmSource.js';

const SUPABASE_URL = 'https://vporwmbmkssbktlhwddp.supabase.co';
const SUPABASE_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwb3J3bWJta3NzYmt0bGh3ZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMTEyMjcsImV4cCI6MjEwOTc4NzIyN30.kKQ2CtOsW-yV33tDtaZNl2Sj0g4k1C04lbBHnawOc6Q';
const PRODUCTION_HOST = 'diagnostic.nomadsmarketing.co';

const ENABLED =
  import.meta.env.PROD || import.meta.env.VITE_GA_DEV === 'true';

const SESSION_KEY = 'rpv_session_id';

function sessionId() {
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) ||
        Date.now().toString(36) + Math.random().toString(36).slice(2);
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'no-storage-' + Math.random().toString(36).slice(2, 12);
  }
}

function envName() {
  if (!import.meta.env.PROD) return 'development';
  return window.location.hostname === PRODUCTION_HOST ? 'production' : 'preview';
}

/** Store one event. `params` are the same params sent to GA4. */
export function storeEvent(event, params = {}, email = null) {
  if (!ENABLED || typeof window === 'undefined' || !window.fetch) return;
  try {
    // Every row also carries where the visitor came from (UTM links):
    // first_utm_source / first_utm_medium / utm_source / utm_medium.
    const { sales_model, ...rest } = { ...utmEventParams(utmState), ...params };
    const row = {
      event,
      session_id: sessionId(),
      sales_model: sales_model == null ? null : String(sales_model),
      email: email || null,
      env: envName(),
      page: window.location.pathname.slice(0, 200),
      params: rest,
    };
    window
      .fetch(SUPABASE_URL + '/rest/v1/quiz_events', {
        method: 'POST',
        headers: {
          apikey: SUPABASE_PUBLIC_KEY,
          Authorization: 'Bearer ' + SUPABASE_PUBLIC_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(row),
        keepalive: true,
      })
      .catch(() => {});
  } catch {
    /* never let tracking break the quiz */
  }
}
