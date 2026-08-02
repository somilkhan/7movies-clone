"use client"

import { useTrending, usePopular, useTopRated, useNowPlaying, useMovies } from "@/lib/hooks/useTMDB"
import { Hero } from "@/app/components/Hero"
import { ContentSection } from "@/app/components/ContentSection"
import { ContinueWatching } from "@/app/components/ContinueWatching"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/app/components/ReducedMotionProvider"

export default function HomePage() {
  const { data: trendingData } = useTrending()
  const { data: popularData } = usePopular()
  const { data: topRatedData } = useTopRated()
  const { data: nowPlayingData } = useNowPlaying()
  const { data: actionData } = useMovies({ with_genres: "28", sort_by: "popularity.desc" })
  const { data: comedyData } = useMovies({ with_genres: "35", sort_by: "popularity.desc" })
  const { data: dramaData } = useMovies({ with_genres: "18", sort_by: "popularity.desc" })
  const { data: horrorData } = useMovies({ with_genres: "27", sort_by: "popularity.desc" })
  const { data: scifiData } = useMovies({ with_genres: "878", sort_by: "popularity.desc" })
  const prefersReducedMotion = useReducedMotion()

  const trendingMovies = trendingData?.results?.filter((m: any) => m.media_type === "movie").slice(0, 10) || []
  const trendingTV = trendingData?.results?.filter((m: any) => m.media_type === "tv").slice(0, 10) || []
  const popularMovies = popularData?.results?.slice(0, 10) || []
  const topRatedMovies = topRatedData?.results?.slice(0, 10) || []
  const nowPlayingMovies = nowPlayingData?.results?.slice(0, 10) || []
  const actionMovies = actionData?.results?.slice(0, 10) || []
  const comedyMovies = comedyData?.results?.slice(0, 10) || []
  const dramaMovies = dramaData?.results?.slice(0, 10) || []
  const horrorMovies = horrorData?.results?.slice(0, 10) || []
  const scifiMovies = scifiData?.results?.slice(0, 10) || []

  const heroMedia = trendingMovies[0] || popularMovies[0]

  return (
    <motion.main initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {heroMedia && <Hero media={heroMedia} />}
      <ContinueWatching />
      <ContentSection title="Trending Now" items={trendingMovies} />
      <ContentSection title="Popular" items={popularMovies} />
      <ContentSection title="Top Rated" items={topRatedMovies} />
      <ContentSection title="Now Playing" items={nowPlayingMovies} />
      <ContentSection title="Action" items={actionMovies} />
      <ContentSection title="Comedy" items={comedyMovies} />
      <ContentSection title="Drama" items={dramaMovies} />
      <ContentSection title="Horror" items={horrorMovies} />
      <ContentSection title="Sci-Fi" items={scifiMovies} />
      {trendingTV.length > 0 && <ContentSection title="Trending TV" items={trendingTV} />}
    </motion.main>
  )
}
