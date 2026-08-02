"use client"

import { motion } from "framer-motion"
import { Navigation } from "../components/Navigation"
import { ContentSection } from "../components/ContentSection"
import { usePopularMovies, useTopRatedMovies, useNowPlayingMovies, useUpcomingMovies, useDiscoverByGenre } from "@/lib/hooks/useTMDB"

const GENRES = [
  { id: "28", label: "Action" },
  { id: "35", label: "Comedy" },
  { id: "18", label: "Drama" },
  { id: "27", label: "Horror" },
  { id: "878", label: "Sci-Fi" },
  { id: "10749", label: "Romance" },
  { id: "80", label: "Crime" },
  { id: "53", label: "Thriller" },
  { id: "9648", label: "Mystery" },
  { id: "99", label: "Documentary" },
  { id: "10751", label: "Family" },
  { id: "14", label: "Fantasy" },
  { id: "16", label: "Animation" },
  { id: "12", label: "Adventure" },
]

function GenreSection({ genreId, title }: { genreId: string; title: string }) {
  const { data } = useDiscoverByGenre(genreId, "1")
  const items = data?.results?.slice(0, 12) || []
  return <ContentSection title={title} items={items} />
}

export default function MoviesPage() {
  const { data: popularData } = usePopularMovies()
  const { data: topRatedData } = useTopRatedMovies()
  const { data: nowPlayingData } = useNowPlayingMovies()
  const { data: upcomingData } = useUpcomingMovies()

  const popular = popularData?.results?.slice(0, 12) || []
  const topRated = topRatedData?.results?.slice(0, 12) || []
  const nowPlaying = nowPlayingData?.results?.slice(0, 12) || []
  const upcoming = upcomingData?.results?.slice(0, 12) || []

  return (
    <>
      <main className="min-h-screen bg-black pb-32 pt-6">
        <div className="px-5">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
          >
            Movies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-muted"
          >
            The best films, curated for you
          </motion.p>
        </div>

        <ContentSection title="Popular" items={popular} />
        <ContentSection title="Top Rated" items={topRated} />
        <ContentSection title="Now Playing" items={nowPlaying} />
        <ContentSection title="Upcoming" items={upcoming} />

        {GENRES.map((genre) => (
          <GenreSection key={genre.id} genreId={genre.id} title={genre.label} />
        ))}
      </main>
      <Navigation />
    </>
  )
}
