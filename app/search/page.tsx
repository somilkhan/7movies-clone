"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, X, SlidersHorizontal, Star } from "lucide-react"
import { MediaCard } from "@/app/components/MediaCard"
import { useAppStore } from "@/stores/useAppStore"
import { useReducedMotion } from "@/app/components/ReducedMotionProvider"

const filters = ["All", "Movies", "TV", "Relevance", "Top Rated", "New"]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q") || ""
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")
  const { addToSearchHistory } = useAppStore()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!q) { setResults([]); return }
    setLoading(true)
    addToSearchHistory(q)
    fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&page=1`, {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN || ""}`, "Content-Type": "application/json" }
    })
      .then((r) => r.json())
      .then((data) => setResults(data.results?.filter((r: any) => r.title || r.name) || []))
      .finally(() => setLoading(false))
  }, [q, addToSearchHistory])

  const filtered = activeFilter === "All" ? results :
    activeFilter === "Movies" ? results.filter((r: any) => r.media_type === "movie" || r.title) :
    activeFilter === "TV" ? results.filter((r: any) => r.media_type === "tv" || (r.name && !r.title)) :
    results

  return (
    <main className="min-h-screen px-5 pt-6 pb-28">
      <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Search bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <Search size={22} className="text-white/40" aria-hidden="true" />
          <h1 className="flex-1 text-xl font-semibold text-white">{q || "Search"}</h1>
          {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden="true" />}
        </div>

        {/* Filter pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${activeFilter === f ? "bg-white text-black" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="mt-6">
            <p className="mb-3 text-xs text-white/40">{filtered.length} results</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((item, i) => (
                <MediaCard key={item.id} media={item} index={i} variant="grid" />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-20 text-center">
            <Search size={48} className="mx-auto text-white/10" aria-hidden="true" />
            <p className="mt-4 text-white/40">{q ? `No results for "${q}"` : "Start typing to search"}</p>
          </div>
        )}
      </motion.div>
    </main>
  )
}
