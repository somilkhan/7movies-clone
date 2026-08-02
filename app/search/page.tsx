"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Mic, SlidersHorizontal } from "lucide-react"
import { useSearch } from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"
import { MediaCard } from "../components/MediaCard"
import { Navigation } from "../components/Navigation"
import { useReducedMotion } from "../components/ReducedMotionProvider"
import { cn } from "@/lib/utils"

const FILTERS = ["All", "Movies", "TV", "Relevance", "Top Rated", "New"]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const inputRef = useRef<HTMLInputElement>(null)
  const { addToSearchHistory } = useAppStore()
  const prefersReducedMotion = useReducedMotion()

  const { data: searchData, isLoading } = useSearch(query)
  const results = searchData?.results || []

  const filteredResults = results.filter((item: any) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Movies") return item.media_type === "movie"
    if (activeFilter === "TV") return item.media_type === "tv"
    if (activeFilter === "New") {
      const year = new Date(item.release_date || item.first_air_date).getFullYear()
      return year >= 2024
    }
    return true
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        addToSearchHistory(query.trim())
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [query, addToSearchHistory])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("")
      inputRef.current?.blur()
    }
  }

  return (
    <>
      <main className="min-h-screen bg-black pb-32">
        {/* Search Bar */}
        <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
            <Search size={20} className="text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, shows, people"
              className="flex-1 bg-transparent text-base text-white placeholder:text-muted focus:outline-none"
              aria-label="Search movies, shows, people"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus() }}
                className="rounded-full bg-white/[0.06] p-1.5 text-muted transition-colors hover:bg-white/[0.1] hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              className="rounded-full bg-white/[0.06] p-2 text-muted transition-colors hover:bg-white/[0.1] hover:text-white"
              aria-label="Voice search"
            >
              <Mic size={18} />
            </button>
            <button
              className="rounded-full bg-white/[0.06] p-2 text-muted transition-colors hover:bg-white/[0.1] hover:text-white"
              aria-label="Advanced filters"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  activeFilter === filter
                    ? "bg-white text-black"
                    : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && query.length > 0 ? (
            <motion.div
              key="loading"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 py-8"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-[2/3] animate-pulse rounded-xl bg-white/[0.04]" />
                    <div className="h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : filteredResults.length > 0 ? (
            <motion.div
              key="results"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-5 py-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Results</h2>
                <span className="text-xs text-muted">{filteredResults.length} found</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredResults.map((item: any, i: number) => (
                  <MediaCard key={item.id} media={item} index={i} variant="poster" />
                ))}
              </div>
            </motion.div>
          ) : query.length > 2 ? (
            <motion.div
              key="empty"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-5 py-20 text-center"
            >
              <Search size={48} className="text-white/10" aria-hidden="true" />
              <p className="mt-4 text-lg font-medium text-white">No results found</p>
              <p className="mt-1 text-sm text-muted">
                Try adjusting your search terms
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="trending"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 py-4"
            >
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Trending Now
              </h2>
              <div className="flex flex-wrap gap-2">
                {["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Anime", "Marvel", "Netflix"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Navigation />
    </>
  )
}
