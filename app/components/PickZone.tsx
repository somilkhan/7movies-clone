"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { useTrendingMovies } from "@/lib/hooks/useTMDB"
import { getImageUrl } from "@/lib/utils"

export function PickZone() {
  const { selectedGenres, toggleGenre } = useAppStore()
  const [dismissed, setDismissed] = useState(false)
  const { data: trendingData } = useTrendingMovies("week")

  const picks = trendingData?.results?.slice(0, 8) || []

  if (dismissed || picks.length === 0) return null

  return (
    <section className="pick-zone">
      <div className="pick-head">
        <div>
          <p className="eyebrow">Make it yours</p>
          <h3>Pick a few things you love</h3>
          <p className="pick-note">
            Powers your For You feed — no account needed. Pick <strong>{Math.max(0, 3 - selectedGenres.length)}</strong> more
          </p>
        </div>
        <button type="button" className="pick-skip" onClick={() => setDismissed(true)}>Skip</button>
      </div>
      <div className="pick-row">
        {picks.map((item) => {
          const selected = selectedGenres.includes(String(item.id))
          return (
            <button
              key={item.id}
              type="button"
              className={`pick-card ${selected ? "picked" : ""}`}
              aria-pressed={selected}
              onClick={() => toggleGenre(String(item.id))}
            >
              <span className="pick-still">
                <img
                  src={item.poster_path ? getImageUrl(item.poster_path, "w500") : ""}
                  alt={item.title || item.name || ""}
                  loading="lazy"
                />
                <span className="pick-fade" />
                <span className="pick-tag">
                  {selected ? <X size={12} /> : <Plus size={12} />}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
