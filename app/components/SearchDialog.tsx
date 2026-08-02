"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Clock, Mic, Loader2, SlidersHorizontal } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { debounce } from "@/lib/utils"
import { FocusTrap } from "./FocusTrap"
import { MediaCard } from "./MediaCard"

const filters = ["All", "Movies", "TV", "Relevance", "Top Rated", "New"]
const quickSearches = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Anime", "Marvel", "Netflix"]

export function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")
  const inputRef = useRef<HTMLInputElement>(null)
  const { searchHistory, addToSearchHistory, clearSearchHistory } = useAppStore()

  const fetchSuggestions = useCallback(debounce(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&page=1`, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN || ""}`, "Content-Type": "application/json" }
      })
      const data = await res.json()
      const items = data.results?.filter((r: any) => r.title || r.name).slice(0, 12) || []
      setResults(items)
      setSuggestions(items.map((r: any) => r.title || r.name).slice(0, 5))
    } catch { setSuggestions([]); setResults([]) } finally { setLoading(false) }
  }, 300), [])

  useEffect(() => { fetchSuggestions(query) }, [query, fetchSuggestions])
  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100) }
    else { setQuery(""); setSuggestions([]); setResults([]); setActiveFilter("All") }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) { addToSearchHistory(query.trim()); router.push(`/search?q=${encodeURIComponent(query.trim())}`); onClose() }
  }

  const filteredResults = activeFilter === "All" ? results :
    activeFilter === "Movies" ? results.filter((r: any) => r.media_type === "movie" || r.title) :
    activeFilter === "TV" ? results.filter((r: any) => r.media_type === "tv" || r.name && !r.title) :
    results

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl" onClick={onClose}
          role="dialog" aria-modal="true" aria-label="Search movies and TV shows">
          <FocusTrap isActive={isOpen} onEscape={onClose}>
            <div className="mx-auto max-w-4xl px-5 pt-6" onClick={(e) => e.stopPropagation()}>
              {/* Search bar */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                  <Search size={22} className="text-white/40" aria-hidden="true" />
                  <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies, shows, people"
                    className="flex-1 bg-transparent text-xl text-white placeholder:text-white/30 outline-none" aria-label="Search query" />
                  {loading && <Loader2 size={18} className="animate-spin text-white/40" aria-hidden="true" />}
                  {query && !loading && <button type="button" onClick={() => setQuery("")} className="text-white/40 hover:text-white" aria-label="Clear search"><X size={20} /></button>}
                  <button type="button" className="text-white/40 hover:text-white" aria-label="Voice search"><Mic size={20} /></button>
                  <button type="button" onClick={onClose} className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/60 hover:bg-white/20">esc</button>
                </div>
              </form>

              {/* Filter pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${activeFilter === f ? "bg-white text-black" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Results grid */}
              {filteredResults.length > 0 && query.length >= 2 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Results</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {filteredResults.map((item, i) => (
                      <MediaCard key={item.id} media={item} index={i} variant="grid" />
                    ))}
                  </div>
                </div>
              )}

              {/* Trending / Quick searches */}
              {(!query || query.length < 2) && (
                <div className="mt-6">
                  <div className="mb-5">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Trending Now</h3>
                    <div className="flex flex-wrap gap-2">
                      {quickSearches.map((term) => (
                        <button key={term} onClick={() => { addToSearchHistory(term); router.push(`/search?q=${encodeURIComponent(term)}`); onClose() }}
                          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white">{term}</button>
                      ))}
                    </div>
                  </div>
                  {searchHistory.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Recent</h3>
                        <button onClick={clearSearchHistory} className="text-[11px] text-white/40 hover:text-white">Clear</button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.slice(0, 6).map((term) => (
                          <button key={term} onClick={() => { router.push(`/search?q=${encodeURIComponent(term)}`); onClose() }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white">
                            <Clock size={14} className="text-white/30" aria-hidden="true" />{term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
