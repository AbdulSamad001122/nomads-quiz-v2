import { useEffect, useRef } from 'react';
import './TidyCalEmbed.css';

/**
 * Live TidyCal booking widget — replaces the static Calendly mock image in
 * the two booking sections (Yemi's "Embed Calendar" doc comments, embed code
 * supplied Sep 19). Same dynamic-script pattern as GA4/Clarity (ga.js).
 *
 * embed.js scans the DOM for .tidycal-embed divs when it executes, so it has
 * to run AFTER the div mounts. Both booking sections mount in the same
 * ResultsPage render, so one script execution initialises both; the
 * module-level flag stops the second instance from loading it twice. If a
 * div is ever remounted empty after the script already ran, a fresh <script>
 * tag re-executes the (browser-cached) file, which re-scans.
 */
const SRC = 'https://asset-tidycal.b-cdn.net/js/embed.js';
let scanScheduled = false;

function scheduleScan() {
  if (scanScheduled) return;
  scanScheduled = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = SRC;
  s.onload = () => {
    scanScheduled = false;
  };
  s.onerror = () => {
    scanScheduled = false;
  };
  document.body.appendChild(s);
}

// embed.js REPLACES the .tidycal-embed div with the widget's <iframe>
// (verified in the browser: the iframe takes over the class + a fixed
// height). React must not own a node another script swaps out — unmounting
// would throw removeChild on a vanished child — so the div goes in as raw
// innerHTML and React only ever reconciles the .rtcal wrapper.
const EMBED_HTML =
  '<div class="tidycal-embed" data-path="alefiya/crpv-game-plan-call"></div>';

export default function TidyCalEmbed() {
  const el = useRef(null);

  useEffect(() => {
    // after mount: if the widget's iframe isn't in this wrapper yet,
    // (re-)run the scanner
    if (el.current && !el.current.querySelector('iframe')) scheduleScan();
  }, []);

  return (
    <div
      ref={el}
      className="rtcal"
      dangerouslySetInnerHTML={{ __html: EMBED_HTML }}
    />
  );
}
