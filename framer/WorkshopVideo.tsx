import { useEffect, useRef } from "react"
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

export default function WorkshopVideo(props) {
    const { videoId, endpoint, radius, dashboard, style } = props
    const hostRef = useRef<HTMLDivElement>(null)
    const onCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (onCanvas || !hostRef.current) return
        let player: any = null
        let timer: any = null
        let gone = false
        let last: number | null = null

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
            // `last` is set only while playing, so this also counts the stretch
            // up to a pause or the end of the video (state 2 / 0 at this tick)
            if (last !== null) {
                const step = t - last
                if (step > 0 && step <= MAX_STEP) progress.ranges = addRange(progress.ranges, last, t)
            }
            last = playing ? t : null
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
            player = new YT.Player(el, {
                videoId,
                width: "100%",
                height: "100%",
                playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
                events: { onStateChange: () => tick() },
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
    }, [videoId, endpoint, dashboard, onCanvas])

    return (
        <div
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: radius,
                overflow: "hidden",
                background: "#000",
            }}
        >
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
    )
}

WorkshopVideo.defaultProps = {
    videoId: "Zzu1a3robjE",
    endpoint: "https://diagnostic.nomadsmarketing.co/api/workshop-progress",
    radius: 0,
    dashboard: true,
}

addPropertyControls(WorkshopVideo, {
    videoId: { type: ControlType.String, title: "YouTube ID", defaultValue: "Zzu1a3robjE" },
    endpoint: {
        type: ControlType.String,
        title: "Helper URL",
        defaultValue: "https://diagnostic.nomadsmarketing.co/api/workshop-progress",
    },
    radius: { type: ControlType.Number, title: "Corner radius", defaultValue: 0, min: 0, max: 60 },
    dashboard: { type: ControlType.Boolean, title: "RPV dashboard", defaultValue: true, enabledTitle: "Send", disabledTitle: "Off" },
})
