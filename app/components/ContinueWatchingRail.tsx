"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { MediaCard } from "./MediaCard"

export function ContinueWatchingRail() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { continueWatching, removeFromContinueWatching } = useAppStore()

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener("scroll", checkScroll)
  }, [continueWatching])

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = dir === "left" ? -500 : 500
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (!continueWatching.length) return null

  return (
    <section className="rail continue-watching-rail">
      <div className="rail-heading">
        <h3>Continue Watching</h3>
        <div className="rail-heading-actions desktop-only">
          <span className="rail-scroll-hint">Scroll to explore <ChevronRight size={13} /></span>
        </div>
      </div>

      <div className="rail-mobile-grid">
        {continueWatching.slice(0, 6).map((item) => {
          const media = {
            id: item.id,
            title: item.title,
            name: item.title,
            poster_path: item.poster,
            backdrop_path: item.backdrop,
            media_type: item.type,
            vote_average: 0,
            popularity: 0,
          } as any
          const progress = item.duration > 0 ? Math.min(100, Math.round((item.watched / item.duration) * 100)) : 0
          return (
            <MediaCard
              key={item.id}
              media={media}
              variant="continue"
              progress={progress}
              onRemove={() => removeFromContinueWatching(item.id)}
            />
          )
        })}
      </div>

      <div className="rail-desktop-scroll">
        <div className="rail-row-wrap">
          <button
            type="button"
            className="rail-arrow rail-arrow-left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll Continue Watching left"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="content-scroll" ref={scrollRef}>
            {continueWatching.map((item) => {
              const media = {
                id: item.id,
                title: item.title,
                name: item.title,
                poster_path: item.poster,
                backdrop_path: item.backdrop,
                media_type: item.type,
                vote_average: 0,
                popularity: 0,
              } as any
              const progress = item.duration > 0 ? Math.min(100, Math.round((item.watched / item.duration) * 100)) : 0
              return (
                <div key={item.id} className="scroll-snap-start" style={{ width: "200px" }}>
                  <MediaCard
                    media={media}
                    variant="continue"
                    progress={progress}
                    onRemove={() => removeFromContinueWatching(item.id)}
                  />
                </div>
              )
            })}
          </div>
          <button
            type="button"
            className="rail-arrow rail-arrow-right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll Continue Watching right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
