import { useEffect, useRef, useState } from 'react';
import './WorkshopVideo.css';

/**
 * The workshop video ("What's Holding Your Revenue Back?", Alefiya's YouTube
 * channel) in the frame the thumbnail placeholder used to fill. Shared by
 * the red-metrics section and the workshop invite (user, Oct 7).
 *
 * It plays by itself once it scrolls into view and pauses when it scrolls
 * out. Browsers only allow that with the sound off, so it starts muted and
 * the YouTube controls let the viewer turn the sound on. Once the viewer
 * takes over (plays or pauses it, turns the sound on, goes fullscreen) or it
 * ends, the page stops playing and pausing it by itself. Visitors whose
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
    let readyTimer = null;
    let inView = false; // reached the play line (half visible) since last leaving
    let ratio = canObserve ? 0 : 1; // latest visible share of the frame
    let viewerControl = false; // the viewer took over, or it ended
    let playAsked = false; // we asked it to play and it hasn't started yet
    let ourPauseAt = -Infinity; // when we last paused it ourselves
    let lastWidth = window.innerWidth;
    let widthChangedAt = -Infinity; // phone turned / window resized sideways

    // YouTube swaps this element for its iframe. It lives in a slot React
    // renders empty, so React never touches what YouTube puts there.
    const mount = document.createElement('div');
    slot.appendChild(mount);

    const ourPauseRecent = () => Date.now() - ourPauseAt < 1500;
    const fullscreen = () => !!(document.fullscreenElement || document.webkitFullscreenElement);

    const takeOver = () => {
      viewerControl = true;
      playAsked = false;
    };

    const play = () => {
      if (autoplay && playerReady && inView && !viewerControl) {
        playAsked = true;
        player.playVideo();
      }
    };

    const pauseNow = () => {
      playAsked = false;
      ourPauseAt = Date.now();
      player.pauseVideo();
    };

    // scroll-out pause, also before the player has reported a play we asked for
    const pause = () => {
      if (!playerReady || viewerControl) return;
      // fullscreen or turning the phone reflows the page; that isn't a scroll
      if (fullscreen() || Date.now() - widthChangedAt < 1000) return;
      // the viewer turned the sound on: it's theirs now
      if (typeof player.isMuted === 'function' && !player.isMuted()) {
        takeOver();
        return;
      }
      const S = window.YT.PlayerState;
      const state = player.getPlayerState();
      if (playAsked || state === S.PLAYING || state === S.BUFFERING) pauseNow();
    };

    const clearReadyTimer = () => {
      if (readyTimer) clearTimeout(readyTimer);
      readyTimer = null;
    };

    const create = () => {
      if (created) return;
      created = true;
      // YouTube never got going (script or player blocked, or stalled): the
      // thumbnail becomes a link to the video instead of a dead image
      readyTimer = setTimeout(() => {
        if (!cancelled && !playerReady) setFailed(true);
      }, 15000);
      loadYouTubeApi()
        .then((YT) => {
          if (cancelled) return;
          const S = YT.PlayerState;
          player = new YT.Player(mount, {
            videoId: WORKSHOP_VIDEO_ID,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { mute: 1, playsinline: 1, rel: 0, modestbranding: 1 },
            events: {
              onReady: () => {
                if (cancelled) return;
                clearReadyTimer();
                const iframe = player.getIframe();
                if (iframe) iframe.title = VIDEO_TITLE;
                playerReady = true;
                setFailed(false);
                setReady(true);
                play();
              },
              onError: () => {
                if (cancelled) return;
                clearReadyTimer();
                setReady(false);
                setFailed(true);
              },
              onStateChange: (e) => {
                if (e.data === S.PLAYING || e.data === S.BUFFERING) {
                  if (playAsked) {
                    // a play we asked for can land after a fast scroll has
                    // already taken the frame off screen: stop it there
                    if (ratio < PAUSE_BELOW && !fullscreen()) {
                      pauseNow();
                      return;
                    }
                    if (e.data === S.PLAYING) playAsked = false;
                  } else if (e.data === S.PLAYING && !ourPauseRecent()) {
                    // a play we didn't ask for: the viewer (or their media
                    // keys, or picture-in-picture) is in charge now
                    takeOver();
                  }
                  if (e.data === S.PLAYING) ourPauseAt = -Infinity;
                } else if (e.data === S.PAUSED) {
                  // the viewer's pause, unless it was ours or the browser's
                  // (hidden tab, or the frame off screen). Our pause counts
                  // for the first PAUSED only, so a viewer pause right after
                  // still sticks.
                  const ours = ourPauseRecent();
                  ourPauseAt = -Infinity;
                  if (!ours && !document.hidden && (ratio >= PAUSE_BELOW || fullscreen())) {
                    takeOver();
                  }
                } else if (e.data === S.ENDED) {
                  takeOver();
                }
              },
            },
          });
        })
        .catch(() => {
          if (cancelled) return;
          clearReadyTimer();
          setFailed(true);
        });
    };

    // the viewer made this video fullscreen: it's theirs now
    const onFullscreen = () => {
      const iframe = player && typeof player.getIframe === 'function' && player.getIframe();
      const el = document.fullscreenElement || document.webkitFullscreenElement;
      if (iframe && el === iframe) takeOver();
    };
    // a sideways resize (turning the phone) reflows the page under a
    // fullscreen video; the visibility change it causes isn't a scroll
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        widthChangedAt = Date.now();
      }
    };
    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('webkitfullscreenchange', onFullscreen);
    window.addEventListener('resize', onResize);
    const removeListeners = () => {
      document.removeEventListener('fullscreenchange', onFullscreen);
      document.removeEventListener('webkitfullscreenchange', onFullscreen);
      window.removeEventListener('resize', onResize);
    };

    if (!canObserve) {
      create();
      return () => {
        cancelled = true;
        clearReadyTimer();
        removeListeners();
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
      (entries) => {
        // several updates can queue up on a busy page: the last is current
        const entry = entries[entries.length - 1];
        ratio = entry.intersectionRatio;
        // a frame taller than a short screen can never be half visible, so
        // filling half the screen counts as well
        const shown =
          ratio >= PLAY_AT || entry.intersectionRect.height >= window.innerHeight * PLAY_AT;
        if (shown) {
          inView = true;
          play();
        } else if (ratio < PAUSE_BELOW) {
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
      clearReadyTimer();
      removeListeners();
      loadObserver.disconnect();
      viewObserver.disconnect();
      if (player && typeof player.destroy === 'function') player.destroy();
      slot.replaceChildren();
    };
  }, []);

  // while the thumbnail covers the player (loading, or YouTube failed), keep
  // the hidden player out of the tab order and away from screen readers
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    slot.inert = !ready;
    if (ready) slot.removeAttribute('aria-hidden');
    else slot.setAttribute('aria-hidden', 'true');
  }, [ready]);

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
      {failed && !ready && (
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
