"use client"

import { Suspense } from "react"
import { Hero } from "./components/Hero"
import { ContentSection } from "./components/ContentSection"
import { ContinueWatching } from "./components/ContinueWatching"
import { Onboarding } from "./components/Onboarding"
import { Navigation } from "./components/Navigation"
import { useAppStore } from "@/stores/useAppStore"
import {
  useTrendingMovies,
  usePopularMovies,
  useTopRatedMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useDiscoverByGenre,
  useDiscoverTVByGenre,
  usePopularTV,
  useTopRatedTV,
} from "@/lib/hooks/useTMDB"

// Genre IDs for movie sections
const MOVIE_GENRES = [
  { id: "28", label: "Action movies" },
  { id: "35", label: "Comedy movies" },
  { id: "18", label: "Drama movies" },
  { id: "27", label: "Horror movies" },
  { id: "878", label: "Sci-Fi movies" },
  { id: "10749", label: "Romance movies" },
  { id: "80", label: "Crime movies" },
  { id: "53", label: "Thriller movies" },
  { id: "9648", label: "Mystery movies" },
  { id: "99", label: "Documentary movies" },
  { id: "10751", label: "Family movies" },
  { id: "14", label: "Fantasy movies" },
  { id: "16", label: "Animation movies" },
  { id: "12", label: "Adventure movies" },
]

// Genre IDs for TV sections
const TV_GENRES = [
  { id: "80", label: "Crime TV" },
  { id: "9648", label: "Mystery TV" },
  { id: "99", label: "Documentary TV" },
  { id: "10751", label: "Family TV" },
  { id: "10762", label: "Kids TV" },
  { id: "10764", label: "Reality TV" },
]

function HomeContent() {
  const { settings } = useAppStore()
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

  const heroMedia = trending[0] || popular[0]

  return (
    <main className="min-h-screen bg-black pb-32">
      {heroMedia && (
        <Hero
          media={heroMedia}
          ambience={settings.ambience}
        />
      )}

      <ContinueWatching />

      <ContentSection title="Trending movies" items={trending} />
      <ContentSection title="Popular movies" items={popular} />
      <ContentSection title="Top rated movies" items={topRated} />
      <ContentSection title="Now playing" items={nowPlaying} />
      <ContentSection title="Upcoming movies" items={upcoming} />

      {/* Genre-based movie sections */}
      {MOVIE_GENRES.map((genre) => (
        <GenreMovieSection key={genre.id} genreId={genre.id} title={genre.label} />
      ))}

      <ContentSection title="Popular TV" items={popularTV} />
      <ContentSection title="Top rated TV" items={topRatedTV} />

      {/* Genre-based TV sections */}
      {TV_GENRES.map((genre) => (
        <GenreTVSection key={genre.id} genreId={genre.id} title={genre.label} />
      ))}
    </main>
  )
}

function GenreMovieSection({ genreId, title }: { genreId: string; title: string }) {
  const { data } = useDiscoverByGenre(genreId, "1")
  const items = data?.results?.slice(0, 12) || []
  return <ContentSection title={title} items={items} />
}

function GenreTVSection({ genreId, title }: { genreId: string; title: string }) {
  const { data } = useDiscoverTVByGenre(genreId, "1")
  const items = data?.results?.slice(0, 12) || []
  return <ContentSection title={title} items={items} />
}

export default function HomePage() {
  return (
    <>
      <Onboarding />
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
      <Navigation />
    </>
  )
}

function HomeSkeleton() {
  return (
    <main className="min-h-screen bg-black pb-32">
      <div className="aspect-[16/9] animate-pulse bg-white/[0.04]" />
      {[...Array(8)].map((_, i) => (
        <section key={i} className="px-5 py-5">
          <div className="mb-3 h-5 w-32 animate-pulse rounded bg-white/[0.04]" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="w-[140px] flex-shrink-0">
                <div className="aspect-[2/3] animate-pulse rounded-xl bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
