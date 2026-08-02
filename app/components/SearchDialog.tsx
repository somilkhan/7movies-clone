"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Clock, TrendingUp, Mic, Loader2 } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { debounce } from "@/lib/utils"
import { FocusTrap } from "./FocusTrap"

export function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { searchHistory, addToSearchHistory, clearSearchHistory } = useAppStore()

  const fetchSuggestions = useCallback(debounce(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return }
    setLoading(true)
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&page=1`, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN || ""}`, "Content-Type": "application/json" }
      })
      const data = await res.json()
      setSuggestions(data.results?.filter((r: any) => r.title || r.name).map((r: any) => r.title || r.name).slice(0, 5) || [])
    } catch { setSuggestions([]) } finally { setLoading(false) }
  }, 300), [])

  useEffect(() => { fetchSuggestions(query) }, [query, fetchSuggestions])
  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); document.body.style.overflow = "hidden" }
    else { document.body.style.overflow = ""; setQuery(""); setSuggestions([]) }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])
  useEffect(() => { const handleOpen = () => onClose(); window.addEventListener("open-search", handleOpen); return () => window.removeEventListener("open-search", handleOpen) }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) { addToSearchHistory(query.trim()); router.push(`/search?q=${encodeURIComponent(query.trim())}`); onClose() }
  }
  const quickSearches = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Anime", "Marvel", "Netflix"]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 pt-[15vh] backdrop-blur-md" onClick={onClose}
          role="dialog" aria-modal="true" aria-label="Search movies and TV shows">
          <FocusTrap isActive={isOpen} onEscape={onClose}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-xl px-4" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-surface p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  <Search size={20} className="text-muted" aria-hidden="true" />
                  <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies, shows, anime..."
                    className="flex-1 bg-transparent text-base text-white placeholder:text-muted outline-none" aria-label="Search query" />
                  {loading && <Loader2 size={16} className="animate-spin text-muted" aria-hidden="true" />}
                  {query && !loading && <button type="button" onClick={() => setQuery("")} className="text-muted hover:text-white" aria-label="Clear search"><X size={18} /></button>}
                  <button type="button" className="text-muted hover:text-white" aria-label="Voice search"><Mic size={18} /></button>
                </div>
              </form>
              {suggestions.length > 0 && query.length >= 2 && (
                <div className="mt-2 rounded-xl border border-white/[0.06] bg-surface/90 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => { addToSearchHistory(s); router.push(`/search?q=${encodeURIComponent(s)}`); onClose() }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white">
                      <Search size={14} className="text-muted" aria-hidden="true" />{s}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4 rounded-2xl border border-white/[0.06] bg-surface/90 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                <div className="mb-5">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted"><TrendingUp size={12} aria-hidden="true" />Trending</h3>
                  <div className="flex flex-wrap gap-2">
                    {quickSearches.map((term) => (
                      <button key={term} onClick={() => { addToSearchHistory(term); router.push(`/search?q=${encodeURIComponent(term)}`); onClose() }}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white">{term}</button>
                    ))}
                  </div>
                </div>
                {searchHistory.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted"><Clock size={12} aria-hidden="true" />Recent</h3>
                      <button onClick={clearSearchHistory} className="text-[11px] text-muted hover:text-white">Clear</button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.slice(0, 6).map((term) => (
                        <button key={term} onClick={() => { router.push(`/search?q=${encodeURIComponent(term)}`); onClose() }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white">
                          <Clock size={14} className="text-muted" aria-hidden="true" />{term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
