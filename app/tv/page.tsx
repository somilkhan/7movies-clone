"use client"

import { motion } from "framer-motion"
import { Navigation } from "../components/Navigation"
import { ContentSection } from "../components/ContentSection"
import { useTrendingTV, usePopularTV, useTopRatedTV, useDiscoverTVByGenre } from "@/lib/hooks/useTMDB"

const TV_GENRES = [
  { id: "80", label: "Crime" },
  { id: "9648", label: "Mystery" },
  { id: "99", label: "Documentary" },
  { id: "10751", label: "Family" },
  { id: "10762", label: "Kids" },
  { id: "10764", label: "Reality" },
  { id: "10768", label: "War & Politics" },
  { id: "18", label: "Drama" },
  { id: "35", label: "Comedy" },
  { id: "10759", label: "Action & Adventure" },
]

function GenreSection({ genreId, title }: { genreId: string; title: string }) {
  const { data } = useDiscoverTVByGenre(genreId, "1")
  const items = data?.results?.slice(0, 12) || []
  return <ContentSection title={title} items={items} />
}

export default function TVPage() {
  const { data: trendingData } = useTrendingTV("week")
  const { data: popularData } = usePopularTV()
  const { data: topRatedData } = useTopRatedTV()

  const trending = trendingData?.results?.slice(0, 12) || []
  const popular = popularData?.results?.slice(0, 12) || []
  const topRated = topRatedData?.results?.slice(0, 12) || []

  return (
    <>
      <main className="min-h-screen bg-black pb-32 pt-6">
        <div className="px-5">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
          >
            TV Shows
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-muted"
          >
            Binge-worthy series and more
          </motion.p>
        </div>

        <ContentSection title="Trending" items={trending} />
        <ContentSection title="Popular" items={popular} />
        <ContentSection title="Top Rated" items={topRated} />

        {TV_GENRES.map((genre) => (
          <GenreSection key={genre.id} genreId={genre.id} title={genre.label} />
        ))}
      </main>
      <Navigation />
    </>
  )
}
