"use client"

import { useRouter } from "next/navigation"
import { Play, Plus, Check, ArrowLeft } from "lucide-react"
import { useMovieDetails, useSimilar } from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"
import { getImageUrl, getYear, formatRuntime } from "@/lib/utils"
import { MediaCard } from "@/app/components/MediaCard"

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  if (!id || id === "undefined") {
    return (
      <div className="detail-page">
        <div className="detail-hero" style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
          <p style={{ color: "#888" }}>Invalid movie ID</p>
        </div>
      </div>
    )
  }
  const router = useRouter()
  const { data: movie, isLoading } = useMovieDetails(id)
  const { data: similar } = useSimilar(Number(id), "movie")
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore()
  const inList = movie ? isInWatchlist(movie.id) : false

  if (isLoading || !movie) {
    return (
      <div className="detail-page">
        <div className="detail-hero-skeleton skeleton" style={{ height: "60vh", minHeight: 400 }} />
      </div>
    )
  }

  const year = getYear(movie.release_date)
  const similarMovies = similar?.results?.slice(0, 12) || []
  const backdrop = movie.backdrop_path
  const logo = movie.images?.logos?.find((l: any) => l.iso_639_1 === "en") || movie.images?.logos?.[0]
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
            <img src={logoUrl} alt={movie.title} className="detail-hero-logo" />
          ) : (
            <h1>{movie.title}</h1>
          )}
          <div className="detail-hero-meta">
            {year && <span>{year}</span>}
            {movie.runtime ? <span>{formatRuntime(movie.runtime)}</span> : null}
            <span>★ {movie.vote_average?.toFixed(1)}</span>
            {movie.genres?.length ? <span>{movie.genres.map((g: any) => g.name).join(" · ")}</span> : null}
          </div>
          <p className="detail-hero-overview">{movie.overview}</p>
          <div className="detail-hero-actions">
            <a href={`/watch/${id}?type=movie`} className="primary-btn">
              <Play size={16} fill="currentColor" /> Play
            </a>
            <button type="button" className="secondary-btn" onClick={() => inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id, "movie")}>
              {inList ? <Check size={16} /> : <Plus size={16} />} My List
            </button>
          </div>
        </div>
      </div>

      {similarMovies.length > 0 && (
        <section className="detail-section">
          <h2 className="detail-section-title">More Like This</h2>
          <div className="content-scroll">
            {similarMovies.map((m, i) => (
              <div key={m.id} className="scroll-snap-start rail-card-wrap">
                <MediaCard media={m} index={i} variant="portrait" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
