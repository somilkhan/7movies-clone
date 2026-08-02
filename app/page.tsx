"use client"

import { useState } from "react"
import { Hero } from "./components/Hero"
import { ContentSection } from "./components/ContentSection"
import { ContinueWatching } from "./components/ContinueWatching"
import {
  useTrendingMovies, usePopularMovies, useTopRatedMovies, useNowPlayingMovies,
  useTrendingTV, usePopularTV, useAnime,
} from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"

function SkeletonSection() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 h-7 w-40 rounded bg-white/[0.05] skeleton" />
      <div className="flex gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[2/3] w-[140px] sm:w-[160px] flex-shrink-0 rounded-card bg-white/[0.05] skeleton" />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const { hasCompletedOnboarding } = useAppStore()

  const { data: trendingMovies, isLoading: t1 } = useTrendingMovies("week")
  const { data: popularMovies, isLoading: t2 } = usePopularMovies()
  const { data: topRatedMovies, isLoading: t3 } = useTopRatedMovies()
  const { data: nowPlaying, isLoading: t4 } = useNowPlayingMovies()
  const { data: trendingTV, isLoading: t5 } = useTrendingTV("week")
  const { data: popularTV, isLoading: t6 } = usePopularTV()
  const { data: anime, isLoading: t7 } = useAnime()

  const isLoading = t1 || t2 || t3 || t4 || t5 || t6 || t7
  const heroMedia = trendingMovies?.results?.[0] || popularMovies?.results?.[0]

  const genreFilters = [
    { id: 28, name: "Action" }, { id: 35, name: "Comedy" }, { id: 18, name: "Drama" },
    { id: 27, name: "Horror" }, { id: 878, name: "Sci-Fi" }, { id: 10749, name: "Romance" }, { id: 16, name: "Animation" },
  ]

  return (
    <main>
      {heroMedia && <Hero media={heroMedia} />}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setSelectedGenre(null)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${selectedGenre === null ? "bg-white text-black" : "border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white"}`}>All</button>
          {genreFilters.map((g) => (
            <button key={g.id} onClick={() => setSelectedGenre(g.id)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${selectedGenre === g.id ? "bg-white text-black" : "border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white"}`}>{g.name}</button>
          ))}
        </div>
      </div>
      {hasCompletedOnboarding && <ContinueWatching />}
      {isLoading ? (
        <><SkeletonSection /><SkeletonSection /><SkeletonSection /></>
      ) : (
        <>
          <ContentSection title="Trending Now" subtitle="Most popular this week" media={trendingMovies?.results?.slice(0, 15) || []} />
          <ContentSection title="New Releases" subtitle="Fresh in theaters" media={nowPlaying?.results?.slice(0, 15) || []} />
          <ContentSection title="Popular Movies" media={popularMovies?.results?.slice(0, 15) || []} />
          <ContentSection title="Top Rated" subtitle="Critically acclaimed" media={topRatedMovies?.results?.slice(0, 15) || []} />
          <ContentSection title="Trending Series" media={trendingTV?.results?.slice(0, 15) || []} />
          <ContentSection title="Popular TV Shows" media={popularTV?.results?.slice(0, 15) || []} />
          <ContentSection title="Anime" subtitle="From Japan" media={anime?.results?.slice(0, 15) || []} />
        </>
      )}
    </main>
  )
}
