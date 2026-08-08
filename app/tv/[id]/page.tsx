"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Plus, Check, ArrowLeft } from "lucide-react"
import { useTVDetails, useSeasonDetails, useSimilar } from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"
import { getImageUrl, getYear } from "@/lib/utils"
import { MediaCard } from "@/app/components/MediaCard"

export default function TVDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  if (!id || id === "undefined") {
    return (
      <div className="detail-page">
        <div className="detail-hero" style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
          <p style={{ color: "#888" }}>Invalid TV show ID</p>
        </div>
      </div>
    )
  }
  const router = useRouter()
  const { data: tv, isLoading } = useTVDetails(id)
  const { data: similar } = useSimilar(Number(id), "tv")
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore()
  const inList = tv ? isInWatchlist(tv.id) : false

  const [seasonNum, setSeasonNum] = useState(1)
  const { data: season } = useSeasonDetails(id, String(seasonNum))

  if (isLoading || !tv) {
    return (
      <div className="detail-page">
        <div className="detail-hero-skeleton skeleton" style={{ height: "60vh", minHeight: 400 }} />
      </div>
    )
  }

  const year = getYear(tv.first_air_date)
  const seasons = tv.seasons?.filter((s: any) => s.season_number > 0) || []
  const episodes = season?.episodes || []
  const similarShows = similar?.results?.slice(0, 12) || []
  const backdrop = tv.backdrop_path
  const logo = tv.images?.logos?.find((l: any) => l.iso_639_1 === "en") || tv.images?.logos?.[0]
  const logoUrl = logo ? getImageUrl(logo.file_path, "w500") : null

  return (
    <div className="detail-page">
      <div className="detail-hero" style={backdrop ? { backgroundImage: `url(${getImageUrl(backdrop, "original")})` } : {}}>
        <div className="detail-hero-shade" />
        <div className="detail-hero-content">
          <button type="button" className="detail-back" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </button>
          {logoUrl ? (
            <img src={logoUrl} alt={tv.name} className="detail-hero-logo" />
          ) : (
            <h1>{tv.name}</h1>
          )}
          <div className="detail-hero-meta">
            {year && <span>{year}</span>}
            {tv.number_of_seasons && <span>{tv.number_of_seasons} seasons</span>}
            <span>★ {tv.vote_average?.toFixed(1)}</span>
          </div>
          <p className="detail-hero-overview">{tv.overview}</p>
          <div className="detail-hero-actions">
            <a href={`/watch/${id}?type=tv`} className="primary-btn">
              <Play size={16} fill="currentColor" /> Play
            </a>
            <button type="button" className="secondary-btn" onClick={() => inList ? removeFromWatchlist(tv.id) : addToWatchlist(tv.id, "tv")}>
              {inList ? <Check size={16} /> : <Plus size={16} />} My List
            </button>
          </div>
        </div>
      </div>

      {episodes.length > 0 && (
        <section className="detail-section">
          <div className="detail-episodes-head">
            <span className="detail-section-label">Popular</span>
            <div className="detail-season-wrap">
              <span className="detail-season-label">Season</span>
              <select value={seasonNum} onChange={(e) => setSeasonNum(Number(e.target.value))} className="detail-season-select">
                {seasons.map((s: any) => (
                  <option key={s.season_number} value={s.season_number}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="detail-episodes-list">
            {episodes.map((ep: any) => (
              <a key={ep.id} href={`/watch/${id}?type=tv&s=${seasonNum}&e=${ep.episode_number}`} className="detail-ep-card">
                <div className="detail-ep-thumb">
                  {ep.still_path ? (
                    <img src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name} loading="lazy" />
                  ) : (
                    <div className="detail-ep-noimg">{ep.episode_number}</div>
                  )}
                </div>
                <div className="detail-ep-info">
                  <h4>{ep.episode_number}. {ep.name}</h4>
                  <span>{ep.runtime ? `${ep.runtime}m` : "43m"}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {similarShows.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-section-title">More Like This</h2>
          <div className="content-scroll">
            {similarShows.map((s, i) => (
              <div key={s.id} className="scroll-snap-start rail-card-wrap">
                <MediaCard media={s} index={i} variant="portrait" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
