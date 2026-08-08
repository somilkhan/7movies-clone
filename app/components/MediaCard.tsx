"use client"

import { useState } from "react"
import { Play, Plus, Star, TrendingUp } from "lucide-react"
import { Media } from "@/types"
import { getImageUrl, getYear } from "@/lib/utils"

interface MediaCardProps {
  media: Media
  index?: number
  ranked?: boolean
  rank?: number
  variant?: "rail" | "grid" | "continue" | "portrait"
  progress?: number
  onRemove?: () => void
}

function CardPoster({ path, alt, eager }: { path: string | null; alt: string; eager?: boolean }) {
  const [error, setError] = useState(false)
  const src = path && !error ? getImageUrl(path, "w500") : null

  if (!src) {
    return (
      <div className="card-fallback">
        <span>{alt.slice(0, 2).toUpperCase()}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  )
}

export function MediaCard({ media, index = 0, ranked, rank, variant = "portrait", progress, onRemove }: MediaCardProps) {
  // Guard against undefined/missing ID
  if (!media || !media.id) {
    return null
  }

  const title = media.title || media.name || "Untitled"
  const year = getYear(media.release_date || media.first_air_date)
  const href = media.media_type === "tv" || (media as any).first_air_date ? `/tv/${media.id}` : `/movie/${media.id}`
  const posterPath = media.poster_path || media.backdrop_path
  const rating = media.vote_average ? Math.round(media.vote_average * 10) / 10 : null
  const isTrending = media.popularity && media.popularity > 100

  const handleClick = () => {
    window.location.href = href
  }

  // ── Grid variant (mobile) ──
  if (variant === "grid") {
    return (
      <button
        type="button"
        className="media-card-grid group"
        aria-label={`${title}${year ? ` (${year})` : ""}`}
        onClick={handleClick}
      >
        <div className="media-card-grid-poster">
          <CardPoster path={posterPath} alt={title} eager={index < 4} />
          <div className="media-card-grid-shade" />
          {ranked && rank && (
            <span className="media-card-grid-rank">{String(rank).padStart(2, "0")}</span>
          )}
          {isTrending && (
            <span className="media-card-grid-trending">
              <TrendingUp size={10} />
            </span>
          )}
          <div className="media-card-grid-info">
            <h4>{title}</h4>
            <div className="media-card-grid-meta">
              {year && <span>{year}</span>}
              {rating && (
                <span className="media-card-grid-rating">
                  <Star size={9} fill="currentColor" />
                  {rating}
                </span>
              )}
            </div>
          </div>
          {progress !== undefined && progress > 0 && (
            <div className="media-card-progress-track">
              <div className="media-card-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </button>
    )
  }

  // ── Continue watching variant ──
  if (variant === "continue") {
    return (
      <button
        type="button"
        className="media-card-continue group"
        aria-label={`${title}${year ? ` (${year})` : ""}`}
        onClick={handleClick}
      >
        <div className="media-card-continue-poster">
          <CardPoster path={posterPath} alt={title} eager={index < 4} />
          <div className="media-card-continue-shade" />
          <span className="media-card-continue-play">
            <Play size={16} fill="currentColor" strokeWidth={0} />
          </span>
          {progress !== undefined && progress > 0 && (
            <div className="media-card-progress-track">
              <div className="media-card-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
          {onRemove && (
            <button
              type="button"
              className="media-card-continue-remove"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              aria-label="Remove from continue watching"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
        <div className="media-card-continue-copy">
          <h4>{title}</h4>
          <p>{year}</p>
        </div>
      </button>
    )
  }

  // ── Portrait variant (desktop rails — 2:3 aspect ratio) ──
  if (variant === "portrait") {
    return (
      <button
        type="button"
        className="media-card-portrait group"
        aria-label={`${title}${year ? ` (${year})` : ""}`}
        onClick={handleClick}
      >
        <div className="media-card-portrait-poster">
          <CardPoster path={posterPath} alt={title} eager={index < 4} />

          {/* Bottom gradient — always visible */}
          <div className="media-card-portrait-gradient" />

          {/* Hover overlay */}
          <div className="media-card-portrait-overlay">
            <div className="media-card-portrait-actions">
              <span className="media-card-portrait-play-btn">
                <Play size={14} fill="currentColor" strokeWidth={0} />
              </span>
              <span className="media-card-portrait-add">
                <Plus size={14} />
              </span>
            </div>
            <div className="media-card-portrait-details">
              <h4>{title}</h4>
              <div className="media-card-portrait-meta">
                {year && <span>{year}</span>}
                {rating && (
                  <span className="media-card-portrait-rating">
                    <Star size={10} fill="currentColor" />
                    {rating}
                  </span>
                )}
                {media.media_type === "tv" && (
                  <span className="media-card-portrait-type">Series</span>
                )}
              </div>
            </div>
          </div>

          {/* Rank badge */}
          {ranked && rank && (
            <span className="media-card-portrait-rank">{String(rank).padStart(2, "0")}</span>
          )}

          {/* Trending badge */}
          {isTrending && (
            <span className="media-card-portrait-trending">
              <TrendingUp size={10} />
            </span>
          )}

          {/* Logo overlay */}
          {media.logo_path && (
            <span className="media-card-portrait-logo">
              <img src={getImageUrl(media.logo_path, "w500")} alt="" loading="lazy" />
            </span>
          )}
        </div>

        {/* Card copy below image */}
        <div className="media-card-portrait-copy">
          <h4>{title}</h4>
          <p>{year}</p>
        </div>
      </button>
    )
  }

  // ── Rail variant (legacy 16:9 — kept for compatibility) ──
  return (
    <button
      type="button"
      className="media-card-premium group"
      aria-label={`${title}${year ? ` (${year})` : ""}`}
      onClick={handleClick}
    >
      <div className="media-card-premium-poster">
        <CardPoster path={posterPath} alt={title} eager={index < 4} />
        <div className="media-card-premium-gradient" />
        <div className="media-card-premium-overlay">
          <div className="media-card-premium-actions">
            <span className="media-card-premium-play">
              <Play size={14} fill="currentColor" strokeWidth={0} />
            </span>
            <span className="media-card-premium-add">
              <Plus size={14} />
            </span>
          </div>
          <div className="media-card-premium-details">
            <h4>{title}</h4>
            <div className="media-card-premium-meta">
              {year && <span>{year}</span>}
              {rating && (
                <span className="media-card-premium-rating">
                  <Star size={10} fill="currentColor" />
                  {rating}
                </span>
              )}
              {media.media_type === "tv" && (
                <span className="media-card-premium-type">Series</span>
              )}
            </div>
          </div>
        </div>
        {ranked && rank && (
          <span className="media-card-premium-rank">{String(rank).padStart(2, "0")}</span>
        )}
        {isTrending && (
          <span className="media-card-premium-trending">
            <TrendingUp size={10} />
          </span>
        )}
        {media.logo_path && (
          <span className="media-card-premium-logo">
            <img src={getImageUrl(media.logo_path, "w500")} alt="" loading="lazy" />
          </span>
        )}
      </div>
      <div className="media-card-premium-copy">
        <h4>{title}</h4>
        <p>{year}</p>
      </div>
    </button>
  )
}
