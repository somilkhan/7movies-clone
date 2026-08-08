"use client"

import { useState } from "react"
import { Hero } from "./components/Hero"
import { Rail } from "./components/Rail"
import { PickZone } from "./components/PickZone"
import { Footer } from "./components/Footer"
import { MobileNav } from "./components/MobileNav"
import { PreviewModal } from "./components/PreviewModal"
import { ContinueWatchingRail } from "./components/ContinueWatchingRail"
import { useAppStore } from "@/stores/useAppStore"
import {
  useTrendingMovies,
  usePopularMovies,
  useTopRatedMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  usePopularTV,
  useTopRatedTV,
  useDiscoverByGenre,
  useDiscoverTVByGenre,
} from "@/lib/hooks/useTMDB"

const HOME_MOVIE_GENRES = [
  { id: "80", label: "Crime movies" },
  { id: "53", label: "Thriller movies" },
  { id: "9648", label: "Mystery movies" },
  { id: "99", label: "Documentary movies" },
  { id: "10751", label: "Family movies" },
  { id: "10752", label: "War movies" },
  { id: "37", label: "Western movies" },
  { id: "10402", label: "Music movies" },
  { id: "36", label: "History movies" },
  { id: "14", label: "Fantasy movies" },
]

const HOME_TV_GENRES = [
  { id: "80", label: "Crime TV" },
  { id: "9648", label: "Mystery TV" },
  { id: "99", label: "Documentary TV" },
  { id: "10751", label: "Family TV" },
  { id: "10762", label: "Kids TV" },
  { id: "10764", label: "Reality TV" },
  { id: "10768", label: "War & politics TV" },
]

export default function HomePage() {
  const { activeTab } = useAppStore()
  const [previewId, setPreviewId] = useState<number | null>(null)

  const { data: trendingData } = useTrendingMovies("week")
  const { data: popularData } = usePopularMovies()
  const { data: topRatedData } = useTopRatedMovies()
  const { data: nowPlayingData } = useNowPlayingMovies()
  const { data: upcomingData } = useUpcomingMovies()
  const { data: popularTVData } = usePopularTV()
  const { data: topRatedTVData } = useTopRatedTV()

  const trending = trendingData?.results?.slice(0, 12) || []
  const popular = popularData?.results?.slice(0, 12) || []
  const topRated = topRatedData?.results?.slice(0, 12) || []
  const nowPlaying = nowPlayingData?.results?.slice(0, 12) || []
  const upcoming = upcomingData?.results?.slice(0, 12) || []
  const popularTV = popularTVData?.results?.slice(0, 12) || []
  const topRatedTV = topRatedTVData?.results?.slice(0, 12) || []

  const heroMedia = trending[0] || null

  const renderHome = () => (
    <>
      <Hero media={heroMedia} onInfoClick={() => heroMedia && setPreviewId(heroMedia.id)} />
      <ContinueWatchingRail />
      <PickZone />
      <div className="content">
        <Rail title="Made for you" items={trending.slice(0, 8)} ranked />
        <Rail title="Trending Now" items={trending} />
        <Rail title="Popular" items={popular} />
        <Rail title="Top Rated" items={topRated} ranked />
        <Rail title="New releases" items={nowPlaying} />
        <Rail title="Upcoming" items={upcoming} />
        <Rail title="Popular TV" items={popularTV} />
        <Rail title="Top Rated TV" items={topRatedTV} ranked />
        {HOME_MOVIE_GENRES.map((g) => (
          <GenreRail key={g.id} id={g.id} label={g.label} type="movie" />
        ))}
        {HOME_TV_GENRES.map((g) => (
          <GenreRail key={g.id} id={g.id} label={g.label} type="tv" />
        ))}
      </div>
    </>
  )

  const renderMovies = () => (
    <div className="content pt-24">
      <div className="mb-8">
        <h2 className="font-grotesk text-4xl font-medium tracking-tight">Movies</h2>
      </div>
      <div className="card-row mb-12">
        {popular.map((m) => (
          <button
            key={m.id}
            type="button"
            className="media-card"
            onClick={() => window.location.href = `/movie/${m.id}`}
          >
            <div className="poster">
              <img src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ""} alt={m.title || ""} loading="lazy" />
              <span className="card-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg></span>
            </div>
            <div className="card-copy">
              <h4>{m.title}</h4>
              <p>{m.release_date ? new Date(m.release_date).getFullYear() : ""}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderTV = () => (
    <div className="content pt-24">
      <div className="mb-8">
        <h2 className="font-grotesk text-4xl font-medium tracking-tight">TV Shows</h2>
      </div>
      <div className="card-row mb-12">
        {popularTV.map((m) => (
          <button
            key={m.id}
            type="button"
            className="media-card"
            onClick={() => window.location.href = `/tv/${m.id}`}
          >
            <div className="poster">
              <img src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ""} alt={m.name || ""} loading="lazy" />
              <span className="card-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg></span>
            </div>
            <div className="card-copy">
              <h4>{m.name}</h4>
              <p>{m.first_air_date ? new Date(m.first_air_date).getFullYear() : ""}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="tab-view">
        {activeTab === "home" && renderHome()}
        {activeTab === "movies" && renderMovies()}
        {activeTab === "tv" && renderTV()}
      </div>
      {activeTab === "home" && <Footer />}
      <MobileNav />
      {previewId && <PreviewModal id={previewId} type="movie" onClose={() => setPreviewId(null)} />}
    </>
  )
}

function GenreRail({ id, label, type }: { id: string; label: string; type: "movie" | "tv" }) {
  const { data } = type === "movie" ? useDiscoverByGenre(id) : useDiscoverTVByGenre(id)
  const items = data?.results?.slice(0, 12) || []
  if (!items.length) return null
  return <Rail title={label} items={items} />
}
