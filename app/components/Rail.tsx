"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Media } from "@/types"
import { MediaCard } from "./MediaCard"

interface RailProps {
  title: string
  items?: Media[]
  scrollIndicator?: boolean
  ranked?: boolean
}

const SCROLL_AMOUNT = 600

export function Rail({ title, items, scrollIndicator = true, ranked = false }: RailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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
  }, [items])

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  const hasItems = items && items.length > 0

  return (
    <section className="rail">
      <div className="rail-heading">
        <h3>{title}</h3>
        {scrollIndicator && hasItems && (
          <div className="rail-heading-actions desktop-only">
            <span className="rail-scroll-hint">Scroll to explore <ChevronRight size={13} /></span>
          </div>
        )}
      </div>

      {/* Mobile: hidden, desktop: horizontal scroll */}
      <div className="rail-mobile-grid">
        {hasItems ? (
          items.slice(0, 6).map((item, i) => (
            <MediaCard key={item.id} media={item} index={i} ranked={ranked} rank={i + 1} variant="grid" />
          ))
        ) : (
          [...Array(4)].map((_, i) => (
            <div key={i} className="media-card-grid skeleton-card">
              <div className="media-card-grid-poster skeleton" />
            </div>
          ))
        )}
      </div>

      {/* Desktop + Mobile: horizontal scroll with portrait cards */}
      <div className="rail-desktop-scroll">
        <div className="rail-row-wrap">
          {hasItems && (
            <>
              <button
                type="button"
                className="rail-arrow rail-arrow-left"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label={`Scroll ${title} left`}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="content-scroll" ref={scrollRef}>
                {items.map((item, i) => (
                  <div key={item.id} className="scroll-snap-start rail-card-wrap">
                    <MediaCard media={item} index={i} ranked={ranked} rank={i + 1} variant="portrait" />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="rail-arrow rail-arrow-right"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label={`Scroll ${title} right`}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {!hasItems && (
            <div className="content-scroll" ref={scrollRef}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="scroll-snap-start rail-card-wrap">
                  <div className="media-card-portrait skeleton-card">
                    <div className="media-card-portrait-poster skeleton" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
