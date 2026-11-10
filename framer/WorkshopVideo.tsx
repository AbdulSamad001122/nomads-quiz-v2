import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Workshop video with watch tags — Framer code component for
 * nomadsmarketing.co/workshop (replaces the plain YouTube embed).
 *
 * Plays the YouTube video like a normal embed. When the page link carries
 * Kit's ck_subscriber_id + sh_kit (links in Kit emails, with the two Kit
 * settings on, and the quiz results page's workshop buttons), it tags the
 * viewer in Kit the first time they pass 25 / 50 / 75 / 90 % of the video
 * (Kit tags "Workshop 25%", "Workshop 50%", "Workshop 75%", "Workshop 90+%"),
 * through the quiz's Vercel helper (api/workshop-progress.js in the quiz
 * repo). Only parts actually played count: skipping ahead adds nothing and
 * re-watching a part doesn't count twice. Progress is kept in the browser,
 * so a viewer who comes back later carries on from where they were.
 * Without the two link parameters the video still plays; nobody is tagged.
 *
 * Each milestone is also sent to GA4 (workshop_progress, percent) and copied to
 * the RPV dashboard's database (Supabase quiz_events, Yemi's request Nov 9):
 * { event: workshop_progress, params: { percent, kit_subscriber_id } }.
 * Fire-and-forget, insert-only public key, never breaks the page; the hashed
 * email is never sent there.
 *
 * In Framer: Assets → Code → New component → paste this file → name it
 * WorkshopVideo → drag it onto the workshop page where the YouTube embed was.
 *
 * Panel (like Framer's own YouTube component): Video (link or id), Autoplay
 * (Off / On / Loop), Mute, Color (progress bar), Fit (16:9 keeps the video's
 * shape and the rest shows Background; Fill stretches the player to the box),
 * Background (transparent by default), Radius, Border, Shadows, Helper URL,
 * RPV dashboard. With Autoplay on, watch time only counts once the sound is
 * on, so a muted autoplay never earns watch tags by itself.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 960
 * @framerIntrinsicHeight 540
 */

const MILESTONES = [25, 50, 75, 90] // last one = Kit tag "Workshop 90+%" (watched 90% and above)
const VIEWER_KEY = "nomads_ws_viewer"
const MAX_STEP = 3 // seconds of video per 1s tick that still count as watching (2x speed + timer jitter)

let ytApi: Promise<any> | null = null
function loadYouTubeApi(): Promise<any> {
    const w = window as any
    if (w.YT && w.YT.Player) return Promise.resolve(w.YT)
    if (!ytApi) {
        ytApi = new Promise((resolve) => {
            const prev = w.onYouTubeIframeAPIReady
            w.onYouTubeIframeAPIReady = () => {
                if (typeof prev === "function") prev()
                resolve(w.YT)
            }
            const s = document.createElement("script")
            s.src = "https://www.youtube.com/iframe_api"
            s.async = true
            document.head.appendChild(s)
        })
    }
    return ytApi
}

/** Who is watching: from the link (saved for later visits) or a saved earlier visit. */
function readViewer(): { id: string; sh: string } | null {
    try {
        const q = new URLSearchParams(window.location.search)
        const id = q.get("ck_subscriber_id")
        const sh = (q.get("sh_kit") || "").toLowerCase()
        if (id && /^\d+$/.test(id) && /^[a-f0-9]{64}$/.test(sh)) {
            const v = { id, sh }
            try {
                localStorage.setItem(VIEWER_KEY, JSON.stringify(v)) // remembered for later visits
            } catch {} // storage blocked: still tag them on this visit
            return v
        }
        const saved = JSON.parse(localStorage.getItem(VIEWER_KEY) || "null")
        return saved && saved.id && saved.sh ? saved : null
    } catch {
        return null
    }
}

/** Fire-and-forget POST that survives the tab closing. */
function send(endpoint: string, data: object) {
    const body = JSON.stringify(data)
    try {
        if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }))) return
    } catch {}
    fetch(endpoint, { method: "POST", body, headers: { "Content-Type": "text/plain" }, keepalive: true, mode: "no-cors" }).catch(() => {})
}

/* ---- RPV dashboard copy (Supabase, insert-only public key — same table as the quiz) ---- */
const RPV_URL = "https://vporwmbmkssbktlhwddp.supabase.co/rest/v1/quiz_events"
const RPV_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwb3J3bWJta3NzYmt0bGh3ZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMTEyMjcsImV4cCI6MjEwOTc4NzIyN30.kKQ2CtOsW-yV33tDtaZNl2Sj0g4k1C04lbBHnawOc6Q"

let memSession = "" // fallback when storage is blocked: one id per page view, not per milestone
function rpvSession(): string {
    try {
        let id = localStorage.getItem("rpv_session_id")
        if (!id) {
            id = (crypto.randomUUID && crypto.randomUUID()) || Date.now().toString(36) + Math.random().toString(36).slice(2)
            localStorage.setItem("rpv_session_id", id)
        }
        return id
    } catch {
        return (memSession = memSession || "no-storage-" + Math.random().toString(36).slice(2, 12))
    }
}

/** Kit id for the dashboard: the verified viewer, else a bare ck_subscriber_id in the link. */
function dashboardKitId(viewer: { id: string } | null): string | null {
    if (viewer) return viewer.id
    try {
        const id = new URLSearchParams(window.location.search).get("ck_subscriber_id") || ""
        return /^\d{1,15}$/.test(id) ? id : null
    } catch {
        return null
    }
}

/** One row per milestone in the dashboard database. Never throws, never waits. */
function storeDashboard(percent: number, kitId: string | null) {
    try {
        const host = window.location.hostname.replace(/^www\./, "")
        fetch(RPV_URL, {
            method: "POST",
            keepalive: true,
            headers: { apikey: RPV_KEY, Authorization: "Bearer " + RPV_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify({
                event: "workshop_progress",
                session_id: rpvSession(),
                sales_model: null,
                email: null,
                env: host === "nomadsmarketing.co" ? "production" : "preview",
                page: window.location.pathname.slice(0, 200),
                params: { percent, kit_subscriber_id: kitId },
            }),
        }).catch(() => {})
    } catch {}
}

/** Merge [a, b] into a sorted list of watched ranges (seconds of video). */
function addRange(ranges: number[][], a: number, b: number): number[][] {
    let s = a, e = b
    const out: number[][] = []
    for (const [x, y] of ranges) {
        if (y < s || x > e) out.push([x, y])
        else {
            s = Math.min(s, x)
            e = Math.max(e, y)
        }
    }
    out.push([s, e])
    return out.sort((p, q) => p[0] - q[0])
}
const watchedSeconds = (ranges: number[][]) => ranges.reduce((t, [x, y]) => t + (y - x), 0)

/** YouTube id from a full link (youtu.be/…, watch?v=…, /embed/…, /shorts/…) or a bare id. */
export function parseVideoId(input: string): string {
    const s = String(input || "").trim()
    if (/^[\w-]{11}$/.test(s)) return s
    const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/)
    return m ? m[1] : ""
}

/** Size of a 16:9 frame that fits inside w × h. */
function fit169(w: number, h: number) {
    if (!w || !h) return { w: 0, h: 0 }
    return w / h > 16 / 9 ? { w: h * (16 / 9), h } : { w, h: w * (9 / 16) }
}

export default function WorkshopVideo(props) {
    const { video, autoplay, mute, color, fit, background, radius, border, shadows, endpoint, dashboard, style } = props
    const videoId = parseVideoId(video) || "Zzu1a3robjE"
    const hostRef = useRef<HTMLDivElement>(null)
    const boxRef = useRef<HTMLDivElement>(null)
    const [box, setBox] = useState({ w: 0, h: 0 })
    const onCanvas = RenderTarget.current() === RenderTarget.canvas

    // measure the component so the video can keep 16:9 inside any size
    useEffect(() => {
        const el = boxRef.current
        if (!el) return
        const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
        measure()
        if (typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        if (onCanvas || !hostRef.current) return
        let player: any = null
        let timer: any = null
        let gone = false
        let last: number | null = null
        const auto = autoplay === "on" || autoplay === "loop"

        const viewer = readViewer()
        const kitId = dashboardKitId(viewer)
        const storeKey = `nomads_ws_${videoId}_${viewer ? viewer.id : "anon"}`
        let progress = { ranges: [] as number[][], sent: [] as number[] }
        try {
            progress = { ...progress, ...JSON.parse(localStorage.getItem(storeKey) || "{}") }
        } catch {}
        const save = () => {
            try {
                localStorage.setItem(storeKey, JSON.stringify(progress))
            } catch {}
        }

        const tick = () => {
            if (!player || typeof player.getCurrentTime !== "function") return
            const playing = player.getPlayerState() === 1
            const t = player.getCurrentTime()
            const duration = player.getDuration()
            // A muted autoplay isn't watching: with Autoplay on, time only counts
            // once the sound is on (the viewer unmuted, or "Mute: No").
            const muted = typeof player.isMuted === "function" && player.isMuted()
            const counts = playing && !(auto && muted)
            // `last` is set only while counting, so this also counts the stretch
            // up to a pause or the end of the video (state 2 / 0 at this tick)
            if (last !== null) {
                const step = t - last
                if (step > 0 && step <= MAX_STEP) progress.ranges = addRange(progress.ranges, last, t)
            }
            last = counts ? t : null
            if (!duration) return
            const percent = (watchedSeconds(progress.ranges) / duration) * 100
            for (const m of MILESTONES) {
                if (percent >= m && !progress.sent.includes(m)) {
                    progress.sent.push(m)
                    if (viewer) send(endpoint, { subscriber_id: viewer.id, sh_kit: viewer.sh, milestone: m })
                    const gtag = (window as any).gtag
                    if (typeof gtag === "function") gtag("event", "workshop_progress", { percent: m })
                    if (dashboard !== false) storeDashboard(m, kitId)
                }
            }
            save()
        }

        loadYouTubeApi().then((YT) => {
            if (gone || !hostRef.current) return
            const el = document.createElement("div")
            hostRef.current.appendChild(el)
            const playerVars: any = {
                rel: 0,
                playsinline: 1,
                modestbranding: 1,
                autoplay: auto ? 1 : 0,
                mute: mute ? 1 : 0,
                color: color === "white" ? "white" : "red",
            }
            if (autoplay === "loop") {
                playerVars.loop = 1
                playerVars.playlist = videoId // YouTube needs this for a single video to loop
            }
            player = new YT.Player(el, {
                videoId,
                width: "100%",
                height: "100%",
                playerVars,
                events: {
                    onReady: (e: any) => {
                        try {
                            if (mute) e.target.mute()
                            if (auto) e.target.playVideo()
                        } catch {}
                    },
                    onStateChange: () => tick(),
                },
            })
            timer = window.setInterval(tick, 1000)
        })

        const onHide = () => tick()
        document.addEventListener("visibilitychange", onHide)
        return () => {
            gone = true
            window.clearInterval(timer)
            document.removeEventListener("visibilitychange", onHide)
            try {
                if (player) player.destroy()
            } catch {}
            if (hostRef.current) hostRef.current.innerHTML = ""
        }
    }, [videoId, autoplay, mute, color, endpoint, dashboard, onCanvas])

    // Frame = the video itself. "16:9" keeps the video's shape and centres it;
    // the rest of the component shows Background (transparent by default).
    const keep = fit !== "fill"
    const frameSize = keep ? fit169(box.w, box.h) : null
    const frameStyle: any = {
        position: "absolute",
        overflow: "hidden",
        background: "#000",
        borderRadius: radius,
        boxShadow: shadows,
        ...(border || {}),
        boxSizing: "border-box",
        ...(keep
            ? frameSize && frameSize.w
                ? { width: frameSize.w, height: frameSize.h, left: (box.w - frameSize.w) / 2, top: (box.h - frameSize.h) / 2 }
                : { left: 0, right: 0, top: "50%", transform: "translateY(-50%)", aspectRatio: "16 / 9" }
            : { inset: 0 }),
    }

    return (
        <div ref={boxRef} style={{ ...style, position: "relative", width: "100%", height: "100%", background }}>
            <div style={frameStyle} data-ws-frame="">
                {onCanvas ? (
                    <img
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                ) : (
                    <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />
                )}
            </div>
        </div>
    )
}

WorkshopVideo.defaultProps = {
    video: "https://youtu.be/Zzu1a3robjE",
    autoplay: "off",
    mute: false,
    color: "red",
    fit: "16:9",
    background: "rgba(0, 0, 0, 0)",
    radius: "0px",
    endpoint: "https://diagnostic.nomadsmarketing.co/api/workshop-progress",
    dashboard: true,
}

addPropertyControls(WorkshopVideo, {
    video: { type: ControlType.String, title: "Video", defaultValue: "https://youtu.be/Zzu1a3robjE", placeholder: "YouTube link or ID" },
    autoplay: {
        type: ControlType.Enum,
        title: "Autoplay",
        options: ["off", "on", "loop"],
        optionTitles: ["Off", "On", "Loop"],
        defaultValue: "off",
    },
    mute: { type: ControlType.Boolean, title: "Mute", defaultValue: false, enabledTitle: "Yes", disabledTitle: "No" },
    color: {
        type: ControlType.Enum,
        title: "Color",
        options: ["red", "white"],
        optionTitles: ["Red", "White"],
        displaySegmentedControl: true,
        defaultValue: "red",
    },
    fit: {
        type: ControlType.Enum,
        title: "Fit",
        options: ["16:9", "fill"],
        optionTitles: ["16:9", "Fill"],
        displaySegmentedControl: true,
        defaultValue: "16:9",
    },
    background: { type: ControlType.Color, title: "Background", defaultValue: "rgba(0, 0, 0, 0)", optional: true },
    radius: { type: ControlType.BorderRadius, title: "Radius", defaultValue: "0px" },
    border: { type: ControlType.Border, title: "Border", optional: true },
    shadows: { type: ControlType.BoxShadow, title: "Shadows" },
    endpoint: {
        type: ControlType.String,
        title: "Helper URL",
        defaultValue: "https://diagnostic.nomadsmarketing.co/api/workshop-progress",
    },
    dashboard: { type: ControlType.Boolean, title: "RPV dashboard", defaultValue: true, enabledTitle: "Send", disabledTitle: "Off" },
})
