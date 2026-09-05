/**
 * Microsoft Clarity — heatmaps + session recordings across landing, quiz,
 * and results (one shared session). No per-event work; the tag does it all.
 *
 * Two projects, selected AUTOMATICALLY by build mode so production data stays
 * clean without any manual deletion:
 *   - production build (Vercel deploy) → main production project
 *   - local dev (npm run dev)          → separate dev/testing project
 *
 * Project IDs are public (they ship in the client bundle either way), so
 * they're committed here. VITE_CLARITY_ID overrides both if ever needed.
 */
const PROD_ID = 'y9fadp218h'; // main production project
const DEV_ID = 'yaddz6onmp'; // dev / testing project

const CLARITY_ID =
  import.meta.env.VITE_CLARITY_ID || (import.meta.env.PROD ? PROD_ID : DEV_ID);

export function initClarity() {
  if (!CLARITY_ID) return;
  if (typeof window === 'undefined' || window.clarity) return; // SSR-safe / already loaded

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
}
