"use client"

import { use, useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Play, SkipForward, SkipBack, Monitor, Maximize, Loader2, Server, ChevronDown, Wifi, WifiOff, Zap, Shield, PictureInPicture, Keyboard, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useMovieDetails, useTVDetails, useSeasonDetails, useSimilar } from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"
import { getImageUrl, getYear } from "@/lib/utils"
import { MediaCard } from "@/app/components/MediaCard"

export interface ServerOption {
  id: string
  name: string
  label: string
  quality: string
  badge?: "fast" | "hd" | "reliable" | "adfree" | "4k"
  url: (id: string, s?: number, e?: number) => string
  blockAds: boolean
  requiresProxy: boolean
}

const MOVIE_SERVERS: ServerOption[] = [
  { id: "filmu", name: "FilmU", label: "4K · 36+", quality: "4K", badge: "4k", url: (id: string) => `/api/proxy/filmu?id=${id}&type=movie`, blockAds: true, requiresProxy: true },
  { id: "netmirror", name: "NetMirror", label: "HD · Fast", quality: "1080p", badge: "fast", url: (id: string) => `/api/proxy/netmirror?id=${id}&type=movie`, blockAds: false, requiresProxy: true },
  { id: "vidrift", name: "VidRift", label: "Fast", quality: "720p", badge: "fast", url: (id: string) => `https://vidsrc.xyz/embed/movie/${id}`, blockAds: false, requiresProxy: false },
  { id: "superembed", name: "SuperEmbed", label: "HD", quality: "1080p", badge: "hd", url: (id: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, blockAds: false, requiresProxy: false },
  { id: "2embed", name: "2Embed", label: "Reliable", quality: "720p", badge: "reliable", url: (id: string) => `https://www.2embed.cc/embed/${id}`, blockAds: false, requiresProxy: false },
]

const TV_SERVERS: ServerOption[] = [
  { id: "filmu", name: "FilmU", label: "4K · 36+", quality: "4K", badge: "4k", url: (id: string, s: number = 1, e: number = 1) => `/api/proxy/filmu?id=${id}&type=tv&s=${s}&e=${e}`, blockAds: true, requiresProxy: true },
  { id: "netmirror", name: "NetMirror", label: "HD · Fast", quality: "1080p", badge: "fast", url: (id: string, s: number = 1, e: number = 1) => `/api/proxy/netmirror?id=${id}&type=tv&s=${s}&e=${e}`, blockAds: false, requiresProxy: true },
  { id: "vidrift", name: "VidRift", label: "Fast", quality: "720p", badge: "fast", url: (id: string, s: number = 1, e: number = 1) => `https://vidsrc.xyz/embed/tv/${id}/${s}-${e}`, blockAds: false, requiresProxy: false },
  { id: "superembed", name: "SuperEmbed", label: "HD", quality: "1080p", badge: "hd", url: (id: string, s: number = 1, e: number = 1) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`, blockAds: false, requiresProxy: false },
  { id: "2embed", name: "2Embed", label: "Reliable", quality: "720p", badge: "reliable", url: (id: string, s: number = 1, e: number = 1) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, blockAds: false, requiresProxy: false },
]

const BADGE_ICONS: Record<string, React.ReactNode> = {
  "4k": <Zap size={10} />,
  fast: <Wifi size={10} />,
  hd: <Monitor size={10} />,
  reliable: <Shield size={10} />,
  adfree: <WifiOff size={10} />,
}

const BADGE_COLORS: Record<string, string> = {
  "4k": "#f5c518",
  fast: "#4ade80",
  hd: "#60a5fa",
  reliable: "#a78bfa",
  adfree: "#fb923c",
}

function CookieRefreshModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (cookies: string) => void }) {
  const [cookies, setCookies] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!cookies.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/proxy/netmirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookies: cookies.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        onSubmit(cookies.trim())
        onClose()
      }
    } catch (e) {
      /* ignore */
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="nm-cookie-overlay" onClick={onClose}>
      <div className="nm-cookie-panel" onClick={(e) => e.stopPropagation()}>
        <h3>NetMirror Cookies Expired</h3>
        <p>Paste your fresh cookies from DevTools &gt; Application &gt; Cookies &gt; net77.cc</p>
        <textarea
          value={cookies}
          onChange={(e) => setCookies(e.target.value)}
          placeholder="t_hash_p=...; user_token=...; SE...=..."
          rows={4}
        />
        <div className="nm-cookie-actions">
          <button type="button" className="nm-cookie-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="nm-cookie-save" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save Cookies"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "movie"
  const initialSeason = Number(searchParams.get("s") || "1")
  const initialEpisode = Number(searchParams.get("e") || "1")

  const servers = type === "tv" ? TV_SERVERS : MOVIE_SERVERS

  const [mounted, setMounted] = useState(false)
  const [serverIdx, setServerIdx] = useState(() => {
    if (typeof window === "undefined") return 0
    const saved = localStorage.getItem("7movies-preferred-server")
    const idx = servers.findIndex((s) => s.id === saved)
    return idx >= 0 ? idx : 0
  })
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [seasonNum, setSeasonNum] = useState(initialSeason)
  const [episodeNum, setEpisodeNum] = useState(initialEpisode)
  const [iframeLoading, setIframeLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerWrapRef = useRef<HTMLDivElement>(null)
  const serverDropdownRef = useRef<HTMLDivElement>(null)

  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPip, setIsPip] = useState(false)

  const [nmVideoUrl, setNmVideoUrl] = useState<string | null>(null)
  const [nmShowCookieModal, setNmShowCookieModal] = useState(false)
  const [nmNetflixId, setNmNetflixId] = useState("")

  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToContinueWatching } = useAppStore()

  const { data: movie, isLoading: movieLoading } = useMovieDetails(type === "movie" ? id : "")
  const { data: tv, isLoading: tvLoading } = useTVDetails(type === "tv" ? id : "")
  const { data: season } = useSeasonDetails(type === "tv" ? id : "", String(seasonNum))
  const { data: similar } = useSimilar(Number(id), type as "movie" | "tv")

  const isLoading = type === "movie" ? movieLoading : tvLoading
  const media = type === "movie" ? movie : tv
  const title = type === "movie" ? movie?.title : tv?.name
  const year = getYear(type === "movie" ? movie?.release_date : tv?.first_air_date)
  const posterPath = media?.poster_path
  const overview = media?.overview
  const genres = media?.genres?.map((g: any) => g.name).join(" · ")
  const inList = media ? isInWatchlist(media.id) : false

  const currentServer = servers[serverIdx]
  const embedUrl = type === "tv"
    ? currentServer.url(id, seasonNum, episodeNum)
    : currentServer.url(id)
  const isFilmU = currentServer.id === "filmu"
  const isNetMirror = currentServer.id === "netmirror"

  const seasons = type === "tv" ? tv?.seasons?.filter((s: any) => s.season_number > 0) || [] : []
  const episodes = season?.episodes || []
  const currentEpIndex = episodes.findIndex((ep: any) => ep.episode_number === episodeNum)
  const hasNextEp = currentEpIndex >= 0 && currentEpIndex < episodes.length - 1
  const hasPrevEp = currentEpIndex > 0

  const similarItems = similar?.results?.slice(0, 12) || []

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isNetMirror) {
      setNmVideoUrl(null)
      return
    }

    const netflixId = nmNetflixId || id
    const fetchNetMirror = async () => {
      setIframeLoading(true)
      setServerError(null)
      try {
        const url = type === "tv"
          ? `/api/proxy/netmirror?id=${netflixId}&type=tv&s=${seasonNum}&e=${episodeNum}`
          : `/api/proxy/netmirror?id=${netflixId}&type=movie`
        const res = await fetch(url)
        const data = await res.json()

        if (data.error === "COOKIES_EXPIRED" || data.error === "COOKIES_MISSING") {
          setNmShowCookieModal(true)
          setServerError("NetMirror cookies expired. Click refresh to update.")
          setIframeLoading(false)
          return
        }

        if (data.error) {
          setServerError(data.message || data.error)
          setIframeLoading(false)
          return
        }

        if (data.hash) {
          setNmVideoUrl(data.sources?.[0]?.url || data.hash)
        }
        setIframeLoading(false)
      } catch (err: any) {
        setServerError(`NetMirror error: ${err.message}`)
        setIframeLoading(false)
      }
    }

    fetchNetMirror()
  }, [isNetMirror, id, nmNetflixId, type, seasonNum, episodeNum])

  const handleServerChange = useCallback((idx: number) => {
    setServerIdx(idx)
    setIframeLoading(true)
    setServerError(null)
    setNmVideoUrl(null)
    localStorage.setItem("7movies-preferred-server", servers[idx].id)
  }, [servers])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (serverDropdownRef.current && !serverDropdownRef.current.contains(e.target as Node)) {
        setServerDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleIframeError = useCallback(() => {
    setIframeLoading(false)
    setServerError(`Failed to load ${currentServer.name}. Try another server.`)
  }, [currentServer])

  useEffect(() => {
    if (!media) return
    addToContinueWatching({
      id: media.id,
      type: type as "movie" | "tv",
      title: title || "Untitled",
      poster: posterPath || null,
      backdrop: media.backdrop_path || null,
      watched: 0,
      duration: type === "movie" ? (media as any).runtime || 120 : (episodes[currentEpIndex]?.runtime || 45),
      season: type === "tv" ? seasonNum : undefined,
      episode: type === "tv" ? episodeNum : undefined,
      episodeName: type === "tv" ? episodes[currentEpIndex]?.name : undefined,
      timestamp: Date.now(),
    })
  }, [media, type, title, posterPath, seasonNum, episodeNum, currentEpIndex, episodes, addToContinueWatching])

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.origin.includes("filmu.in")) return
      if (e.data?.type === "SYNC_HISTORY") {
        const d = e.data.data
        const existing = JSON.parse(localStorage.getItem("7movies-continue") || "[]")
        const filtered = existing.filter((item: any) => item.id !== d.media_id)
        filtered.unshift({ id: d.media_id, type: d.media_type, title: d.title, poster: d.poster, watched: d.watched, duration: d.duration, season: d.season, episode: d.episode, timestamp: Date.now() })
        localStorage.setItem("7movies-continue", JSON.stringify(filtered.slice(0, 20)))
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    if (!isFilmU || !iframeRef.current) return
    const iframe = iframeRef.current
    const blockAds = () => {
      if (!iframe.contentWindow) return
      ;[{ type: "CONFIG", ads: false, premium: true }, { type: "SET_CONFIG", enableAds: false }, { type: "DISABLE_ADS" }, { type: "PLAYER_CONFIG", ads: false }].forEach((cfg) => {
        iframe.contentWindow?.postMessage(cfg, "*")
      })
    }
    blockAds()
    const t1 = setTimeout(blockAds, 2000)
    const t2 = setTimeout(blockAds, 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isFilmU, embedUrl])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key.toLowerCase()
      if (k === "f") {
        e.preventDefault()
        playerWrapRef.current?.requestFullscreen?.()
      } else if (k === "arrowright" && type === "tv" && hasNextEp) {
        e.preventDefault()
        setEpisodeNum(episodes[currentEpIndex + 1].episode_number)
      } else if (k === "arrowleft" && type === "tv" && hasPrevEp) {
        e.preventDefault()
        setEpisodeNum(episodes[currentEpIndex - 1].episode_number)
      } else if (k === "?") {
        e.preventDefault()
        setShowShortcuts((s) => !s)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [type, hasNextEp, hasPrevEp, currentEpIndex, episodes])

  const goNextEp = useCallback(() => {
    if (hasNextEp) setEpisodeNum(episodes[currentEpIndex + 1].episode_number)
  }, [hasNextEp, currentEpIndex, episodes])

  const goPrevEp = useCallback(() => {
    if (hasPrevEp) setEpisodeNum(episodes[currentEpIndex - 1].episode_number)
  }, [hasPrevEp, currentEpIndex, episodes])

  const toggleFullscreen = useCallback(() => {
    const el = playerWrapRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  const togglePip = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setIsPip(false)
      } else if (iframeRef.current) {
        setIsPip(true)
      }
    } catch {
      // PiP not supported
    }
  }, [])

  if (isLoading || !media) {
    return (
      <div className="watch-page">
        <div className="watch-page-head skeleton" style={{ height: 60, borderRadius: 8, marginBottom: 20 }} />
        <div className="watch-player-wrap skeleton" style={{ aspectRatio: "16/9", borderRadius: 12 }} />
      </div>
    )
  }

  const playerUrl = isNetMirror && nmVideoUrl ? nmVideoUrl : embedUrl

  return (
    <div className="watch-page">
      <div className="watch-page-head">
        <Link href={type === "tv" ? `/tv/${id}` : `/movie/${id}`} className="watch-back">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="watch-title-meta">
          <h1>{title}</h1>
          {type === "tv" && (
            <span className="watch-ep-label">S{seasonNum} E{episodeNum}</span>
          )}
        </div>
        <div className="watch-head-actions">
          <button
            type="button"
            className="watch-list-btn"
            onClick={() => inList ? removeFromWatchlist(media.id) : addToWatchlist(media.id, type as "movie" | "tv")}
          >
            {inList ? "✓ In List" : "+ My List"}
          </button>
        </div>
      </div>

      {isNetMirror && (
        <div className="nm-id-bar">
          <span>Netflix ID:</span>
          <input
            type="text"
            value={nmNetflixId}
            onChange={(e) => setNmNetflixId(e.target.value)}
            placeholder={`TMDB ID ${id} (or enter Netflix ID)`}
          />
          <button
            type="button"
            onClick={() => setNmShowCookieModal(true)}
            title="Refresh cookies"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      <div className="watch-player-wrap" ref={playerWrapRef}>
        {iframeLoading && (
          <div className="watch-player-loading">
            <Loader2 size={32} className="animate-spin" />
            <span>Loading player...</span>
          </div>
        )}
        {mounted && (
          <iframe
            ref={iframeRef}
            src={playerUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy={isNetMirror ? "origin" : "no-referrer"}
            onLoad={() => { setIframeLoading(false); setServerError(null) }}
            onError={handleIframeError}
            style={{ opacity: iframeLoading ? 0 : 1 }}
          />
        )}
      </div>

      <div className="watch-controls-bar">
        <div className="watch-server-pills">
          {servers.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`watch-server-pill ${serverIdx === i ? "active" : ""}`}
              onClick={() => handleServerChange(i)}
              title={`${s.name} — ${s.quality}${s.blockAds ? " · No Ads" : ""}`}
            >
              <Monitor size={12} />
              <span>{s.name}</span>
              <small>{s.label}</small>
              {s.badge && (
                <span
                  className="server-badge"
                  style={{ color: BADGE_COLORS[s.badge] }}
                >
                  {BADGE_ICONS[s.badge]}
                </span>
              )}
              {s.blockAds && <span className="server-badge adfree">Ad-Free</span>}
            </button>
          ))}
        </div>

        <div className="watch-server-dropdown-wrap" ref={serverDropdownRef}>
          <button
            type="button"
            className="watch-server-dropdown-trigger"
            onClick={() => setServerDropdownOpen((o) => !o)}
          >
            <Server size={14} />
            <span>{currentServer.name}</span>
            <small>{currentServer.quality}</small>
            <ChevronDown size={14} className={serverDropdownOpen ? "rotate-180" : ""} />
          </button>
          {serverDropdownOpen && (
            <div className="watch-server-dropdown">
              {servers.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={`watch-server-dropdown-item ${serverIdx === i ? "active" : ""}`}
                  onClick={() => { handleServerChange(i); setServerDropdownOpen(false) }}
                >
                  <span className="watch-server-dropdown-name">
                    {s.name}
                    {s.badge && (
                      <span style={{ color: BADGE_COLORS[s.badge], marginLeft: 6 }}>
                        {BADGE_ICONS[s.badge]}
                      </span>
                    )}
                  </span>
                  <span className="watch-server-dropdown-meta">
                    {s.quality}
                    {s.blockAds && <span className="server-badge adfree">Ad-Free</span>}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {serverError && (
          <div className="watch-server-error">
            <WifiOff size={14} />
            <span>{serverError}</span>
          </div>
        )}

        <div className="watch-player-actions">
          {type === "tv" && (
            <>
              <button type="button" className="watch-ctrl-btn" onClick={goPrevEp} disabled={!hasPrevEp} aria-label="Previous episode">
                <SkipBack size={16} />
              </button>
              <button type="button" className="watch-ctrl-btn" onClick={goNextEp} disabled={!hasNextEp} aria-label="Next episode">
                <SkipForward size={16} />
              </button>
            </>
          )}
          <button
            type="button"
            className="watch-ctrl-btn"
            onClick={togglePip}
            aria-label="Picture in picture"
            title="Picture in Picture"
          >
            <PictureInPicture size={16} />
          </button>
          <button
            type="button"
            className="watch-ctrl-btn"
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
            title="Fullscreen (F)"
          >
            <Maximize size={16} />
          </button>
          <button
            type="button"
            className="watch-ctrl-btn"
            onClick={() => setShowShortcuts((s) => !s)}
            aria-label="Keyboard shortcuts"
            title="Shortcuts (?)"
          >
            <Keyboard size={16} />
          </button>
        </div>
      </div>

      {showShortcuts && (
        <div className="watch-shortcuts-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="watch-shortcuts-panel" onClick={(e) => e.stopPropagation()}>
            <h3>Keyboard Shortcuts</h3>
            <div className="watch-shortcuts-grid">
              <div className="watch-shortcut-row"><kbd>F</kbd><span>Toggle Fullscreen</span></div>
              <div className="watch-shortcut-row"><kbd>←</kbd><span>Previous Episode</span></div>
              <div className="watch-shortcut-row"><kbd>→</kbd><span>Next Episode</span></div>
              <div className="watch-shortcut-row"><kbd>?</kbd><span>Toggle This Help</span></div>
            </div>
            <button type="button" className="watch-shortcuts-close" onClick={() => setShowShortcuts(false)}>Close</button>
          </div>
        </div>
      )}

      {nmShowCookieModal && (
        <CookieRefreshModal
          onClose={() => setNmShowCookieModal(false)}
          onSubmit={(cookies) => {
            localStorage.setItem("7movies-nm-cookies", cookies)
            window.location.reload()
          }}
        />
      )}

      <div className="watch-info-grid">
        <div className="watch-info-main">
          {posterPath && (
            <img
              src={getImageUrl(posterPath, "w300")}
              alt={title}
              className="watch-info-poster"
              loading="lazy"
            />
          )}
          <div className="watch-info-copy">
            <div className="watch-info-meta">
              {year && <span>{year}</span>}
              {type === "tv" && tv?.number_of_seasons && <span>{tv.number_of_seasons} Seasons</span>}
              <span>★ {media.vote_average?.toFixed(1)}</span>
              {genres && <span>{genres}</span>}
            </div>
            <p className="watch-info-overview">{overview}</p>
          </div>
        </div>

        {type === "tv" && episodes.length > 0 && (
          <div className="watch-episodes">
            <div className="watch-episodes-head">
              <h3>Episodes</h3>
              <select
                value={seasonNum}
                onChange={(e) => { setSeasonNum(Number(e.target.value)); setEpisodeNum(1) }}
              >
                {seasons.map((s: any) => (
                  <option key={s.season_number} value={s.season_number}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="watch-episodes-list">
              {episodes.map((ep: any) => (
                <button
                  key={ep.id}
                  type="button"
                  className={`watch-ep-item ${episodeNum === ep.episode_number ? "active" : ""}`}
                  onClick={() => setEpisodeNum(ep.episode_number)}
                >
                  <div className="watch-ep-thumb">
                    {ep.still_path ? (
                      <img src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name} loading="lazy" />
                    ) : (
                      <div className="watch-ep-noimg"><Play size={14} /></div>
                    )}
                  </div>
                  <div className="watch-ep-info">
                    <span className="watch-ep-num">E{ep.episode_number}</span>
                    <span className="watch-ep-name">{ep.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {similarItems.length > 0 && (
        <section className="watch-similar">
          <h2>More Like This</h2>
          <div className="content-scroll">
            {similarItems.map((item: any, i: number) => (
              <div key={item.id} className="scroll-snap-start rail-card-wrap">
                <MediaCard media={item} index={i} variant="portrait" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
