"use client"

import { useEffect } from "react"
import { X, Play, Plus, Check } from "lucide-react"
import { useMovie, useTVDetails, useCredits } from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"
import { getImageUrl, getYear, formatRuntime } from "@/lib/utils"
import Link from "next/link"

export function PreviewModal({ id, type, onClose }: { id: number; type: "movie" | "tv"; onClose: () => void }) {
  const { data: movie } = type === "movie" ? useMovie(id) : { data: null }
  const { data: tv } = type === "tv" ? useTVDetails(String(id)) : { data: null }
  const media = movie || tv
  const { data: credits } = useCredits(id, type)
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore()
  const inList = media ? isInWatchlist(media.id) : false

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onEsc)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onEsc)
      document.body.style.overflow = ""
    }
  }, [onClose])

  if (!media) return null

  const title = (media as any).title || (media as any).name || "Untitled"
  const href = type === "tv" ? `/tv/${id}` : `/movie/${id}`
  const year = getYear((media as any).release_date || (media as any).first_air_date)
  const runtime = (media as any).runtime ? formatRuntime((media as any).runtime) : ""
  const genres = (media as any).genres?.map((g: any) => g.name).join(", ") || ""
  const cast = credits?.cast?.slice(0, 5).map((c: any) => c.name).join(", ") || ""

  return (
    <div className="preview-backdrop" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="preview-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <div className="preview-poster">
          <img src={getImageUrl(media.backdrop_path, "w780")} alt="" />
          <div className="preview-poster-fade" />
          <div className="preview-poster-content">
            <h2>{title}</h2>
            <div className="preview-meta">
              {year} {runtime && `· ${runtime}`} · ★ {(media.vote_average || 0).toFixed(1)}
            </div>
            <div className="preview-actions">
              <Link href={`${href}?autoplay=1`} className="preview-play">
                <Play size={14} fill="currentColor" /> Watch
              </Link>
              <button
                type="button"
                className="preview-list"
                onClick={() => inList ? removeFromWatchlist(media.id) : addToWatchlist(media.id, type)}
              >
                {inList ? <Check size={14} /> : <Plus size={14} />} {inList ? "In List" : "My List"}
              </button>
            </div>
          </div>
        </div>
        <div className="preview-body">
          <p className="preview-desc">{(media as any).overview}</p>
          {genres && <p className="preview-genre">{genres}</p>}
          {cast && <p className="text-[11px] text-muted font-mono"><b className="text-white/70">Cast:</b> {cast}</p>}
        </div>
      </div>
    </div>
  )
}
