import { useEffect, useRef, useState } from 'react';
import './WorkshopVideo.css';

/**
 * The workshop video ("What's Holding Your Revenue Back?", Alefiya's YouTube
 * channel) in the frame the thumbnail placeholder used to fill. Shared by
 * the red-metrics section and the workshop invite (user, Oct 7).
 *
 * It plays by itself once it scrolls into view and pauses when it scrolls
 * out. Browsers only allow that with the sound off, so it starts muted and
 * the YouTube controls let the viewer turn the sound on. If the viewer
 * pauses it (or it ends), scrolling back doesn't restart it. Visitors whose
 * device asks for reduced motion get the player without the autoplay.
 *
 * The thumbnail stays on top until the player is ready, so the frame looks
 * the same as before while YouTube loads; the section's own class
 * (rmw__thumb / rwk__thumb) keeps the frame's size, border and corners.
 */
export const WORKSHOP_VIDEO_ID = 'Zzu1a3robjE';
const VIDEO_TITLE = 'What’s Holding Your Revenue Back?';
const WATCH_URL = `https://www.youtube.com/watch?v=${WORKSHOP_VIDEO_ID}`;

// play once at least half the video is on screen; pause below a quarter
const PLAY_AT = 0.5;
const PAUSE_BELOW = 0.25;

let apiPromise = null;

/** Loads YouTube's IFrame Player API once for the whole page. */
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('YouTube player failed to load'));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export default function WorkshopVideo({ className = '', posterAlt = '' }) {
  const frameRef = useRef(null);
  const slotRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const slot = slotRef.current;
    if (!frame || !slot) return undefined;

    const canObserve = typeof IntersectionObserver !== 'undefined';
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autoplay = canObserve && !reduceMotion;

    let cancelled = false;
    let created = false;
    let player = null;
    let playerReady = false;
    let inView = false;
    let viewerStopped = false; // the viewer paused it, or it ended
    let ourPause = false; // the next PAUSED event is our scroll-out pause

    // YouTube swaps this element for its iframe. It lives in a slot React
    // renders empty, so React never touches what YouTube puts there.
    const mount = document.createElement('div');
    slot.appendChild(mount);

    const play = () => {
      if (autoplay && playerReady && inView && !viewerStopped) player.playVideo();
    };

    const pause = () => {
      if (!playerReady) return;
      const YT = window.YT;
      const state = player.getPlayerState();
      if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
        ourPause = true;
        player.pauseVideo();
      }
    };

    const create = () => {
      if (created) return;
      created = true;
      loadYouTubeApi()
        .then((YT) => {
          if (cancelled) return;
          player = new YT.Player(mount, {
            videoId: WORKSHOP_VIDEO_ID,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { mute: 1, playsinline: 1, rel: 0, modestbranding: 1 },
            events: {
              onReady: () => {
                if (cancelled) return;
                const iframe = player.getIframe();
                if (iframe) iframe.title = VIDEO_TITLE;
                playerReady = true;
                setReady(true);
                play();
              },
              onStateChange: (e) => {
                if (e.data === YT.PlayerState.PLAYING) {
                  viewerStopped = false;
                } else if (e.data === YT.PlayerState.PAUSED) {
                  if (ourPause) ourPause = false;
                  else viewerStopped = true;
                } else if (e.data === YT.PlayerState.ENDED) {
                  viewerStopped = true;
                }
              },
            },
          });
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    if (!canObserve) {
      create();
      return () => {
        cancelled = true;
        if (player && typeof player.destroy === 'function') player.destroy();
        slot.replaceChildren();
      };
    }

    // start loading a little before the frame arrives, so it can play the
    // moment it's on screen
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadObserver.disconnect();
          create();
        }
      },
      { rootMargin: '600px 0px' }
    );

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        // a frame taller than a short screen can never be half visible, so
        // filling half the screen counts as well
        const shown =
          entry.intersectionRatio >= PLAY_AT ||
          entry.intersectionRect.height >= window.innerHeight * PLAY_AT;
        if (shown) {
          inView = true;
          play();
        } else if (entry.intersectionRatio < PAUSE_BELOW) {
          inView = false;
          pause();
        }
      },
      { threshold: [0, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    loadObserver.observe(frame);
    viewObserver.observe(frame);

    return () => {
      cancelled = true;
      loadObserver.disconnect();
      viewObserver.disconnect();
      if (player && typeof player.destroy === 'function') player.destroy();
      slot.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={['wv', ready && 'wv--ready', className].filter(Boolean).join(' ')}
    >
      <div ref={slotRef} className="wv__slot" />
      <img
        className="wv__poster"
        src="/assets/results-workshop-video-thumb.webp"
        alt={ready ? '' : posterAlt}
        aria-hidden={ready ? 'true' : undefined}
        width="2080"
        height="1170"
      />
      {failed && (
        <a
          className="wv__fallback"
          href={WATCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch “${VIDEO_TITLE}” on YouTube`}
        />
      )}
    </div>
  );
}
