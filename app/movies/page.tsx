"use client"

import { usePopular, useTopRated, useNowPlaying } from "@/lib/hooks/useTMDB"
import { ContentSection } from "@/app/components/ContentSection"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/app/components/ReducedMotionProvider"

export default function MoviesPage() {
  const { data: popularData } = usePopular()
  const { data: topRatedData } = useTopRated()
  const { data: nowPlayingData } = useNowPlaying()
  const prefersReducedMotion = useReducedMotion()

  const popularMovies = popularData?.results?.slice(0, 12) || []
  const topRatedMovies = topRatedData?.results?.slice(0, 12) || []
  const nowPlayingMovies = nowPlayingData?.results?.slice(0, 12) || []

  return (
    <motion.main className="pt-6 pb-28" initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="px-5 mb-6">
        <h1 className="text-2xl font-bold text-white">Movies</h1>
        <p className="mt-1 text-sm text-white/40">The best films, curated for you</p>
      </div>
      <ContentSection title="Now Playing" items={nowPlayingMovies} />
      <ContentSection title="Popular" items={popularMovies} />
      <ContentSection title="Top Rated" items={topRatedMovies} />
    </motion.main>
  )
}
