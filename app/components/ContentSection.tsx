"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Media } from "@/types"
import { MediaCard } from "./MediaCard"
import { cn } from "@/lib/utils"

interface ContentSectionProps {
  title: string
  subtitle?: string
  media: Media[]
  variant?: "poster" | "backdrop"
  className?: string
}

export function ContentSection({ title, subtitle, media, variant = "poster", className }: ContentSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = variant === "poster" ? 350 : 650
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  if (!media?.length) return null

  return (
    <section className={cn("relative py-4 sm:py-6", className)}>
      {/* Header */}
      <div className="mb-3 flex items-end justify-between px-4 sm:mb-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="font-grotesk text-lg font-medium tracking-tight text-white sm:text-xl md:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">{subtitle}</p>
          )}
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <button
            onClick={() => scroll("left")}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="scroll-snap-x scrollbar-hide flex gap-2.5 overflow-x-auto px-4 sm:gap-3 sm:px-6 lg:px-8"
      >
        {media.map((item, index) => (
          <MediaCard key={item.id} media={item} index={index} variant={variant} />
        ))}
      </div>
    </section>
  )
}
