import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Workshop video with watch tags — Framer code component for
 * nomadsmarketing.co/workshop (replaces the plain YouTube embed).
 *
 * Plays the YouTube video like a normal embed. When the page link carries
 * Kit's ck_subscriber_id + sh_kit (links in Kit emails, with the two Kit
 * settings on, and the quiz results page's workshop buttons), it tags the
 * viewer in Kit the first time they pass 25 / 50 / 75 / 95 % of the video,
 * through the quiz's Vercel helper (api/workshop-progress.js in the quiz
 * repo). Only parts actually played count: skipping ahead adds nothing and
 * re-watching a part doesn't count twice. Progress is kept in the browser,
 * so a viewer who comes back later carries on from where they were.
 * Without the two link parameters the video still plays; nobody is tagged.
 *
 * In Framer: Assets → Code → New component → paste this file → name it
 * WorkshopVideo → drag it onto the workshop page where the YouTube embed was.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 960
 * @framerIntrinsicHeight 540
 */

const MILESTONES = [25, 50, 75, 95]
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
            localStorage.setItem(VIEWER_KEY, JSON.stringify(v))
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
    const { videoId, endpoint, radius, style } = props
    const hostRef = useRef<HTMLDivElement>(null)
    const onCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (onCanvas || !hostRef.current) return
        let player: any = null
        let timer: any = null
        let gone = false
        let last: number | null = null

        const viewer = readViewer()
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
    }, [videoId, endpoint, onCanvas])

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
}

addPropertyControls(WorkshopVideo, {
    videoId: { type: ControlType.String, title: "YouTube ID", defaultValue: "Zzu1a3robjE" },
    endpoint: {
        type: ControlType.String,
        title: "Helper URL",
        defaultValue: "https://diagnostic.nomadsmarketing.co/api/workshop-progress",
    },
    radius: { type: ControlType.Number, title: "Corner radius", defaultValue: 0, min: 0, max: 60 },
})
