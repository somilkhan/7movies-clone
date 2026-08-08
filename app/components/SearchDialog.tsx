"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, Trash2 } from "lucide-react"
import { useSearch } from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"
import { MediaCard } from "./MediaCard"

const FILTERS = ["All", "Movies", "TV", "New"]

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useSearch(query)
  const results = data?.results || []

  const { searchHistory, addToSearchHistory, clearSearchHistory } = useAppStore()

  const filtered = results.filter((item: any) => {
    if (filter === "All") return true
    if (filter === "Movies") return item.media_type === "movie"
    if (filter === "TV") return item.media_type === "tv"
    if (filter === "New") {
      const y = new Date(item.release_date || item.first_air_date).getFullYear()
      return y >= 2024
    }
    return true
  })

  // Add to history when user has typed a query and results loaded
  useEffect(() => {
    if (query.length > 1 && !isLoading && filtered.length > 0) {
      addToSearchHistory(query)
    }
  }, [query, isLoading, filtered.length, addToSearchHistory])

  useEffect(() => {
    inputRef.current?.focus()
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [onClose])

  const handleHistoryClick = (q: string) => {
    setQuery(q)
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog search-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head search-dialog-head">
          <Search size={18} className="text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies, shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="dialog-body search-dialog-body">
          <div className="search-chips">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`search-chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          {isLoading && query.length > 1 && (
            <div className="search-browse-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
              ))}
            </div>
          )}
          {query.length > 1 && !isLoading && filtered.length === 0 && (
            <p className="px-5 py-4 text-sm text-muted">No results found</p>
          )}
          {query.length > 1 && (
            <div className="search-browse-grid">
              {filtered.slice(0, 12).map((item: any, i: number) => (
                <MediaCard key={item.id} media={item} index={i} />
              ))}
            </div>
          )}
          {query.length <= 1 && searchHistory.length > 0 && (
            <>
              <div className="search-section-label flex items-center justify-between">
                <span>Recent searches</span>
                <button
                  type="button"
                  className="search-clear-history"
                  onClick={clearSearchHistory}
                  aria-label="Clear search history"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="search-history-list">
                {searchHistory.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    className="search-history-item"
                    onClick={() => handleHistoryClick(q)}
                  >
                    <Clock size={14} className="text-muted" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {query.length <= 1 && searchHistory.length === 0 && (
            <>
              <div className="search-section-label">Trending</div>
              <div className="search-browse-grid">
                {results.slice(0, 8).map((item: any, i: number) => (
                  <MediaCard key={item.id} media={item} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
