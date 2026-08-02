"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Plus, Info, Star } from "lucide-react"
import { Media } from "@/types"
import { getImageUrl, truncate } from "@/lib/utils"
import { useAppStore } from "@/stores/useAppStore"
import { useReducedMotion } from "./ReducedMotionProvider"

interface HeroProps {
  media: Media
}

export function Hero({ media }: HeroProps) {
  const { addToWatchlist, isInWatchlist } = useAppStore()
  const inWatchlist = isInWatchlist(media.id)
  const title = media.title || media.name || "Untitled"
  const href = media.media_type === "tv" || (media as any).first_air_date
    ? `/tv/${media.id}`
    : `/movie/${media.id}`
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative h-[75vh] min-h-[420px] w-full overflow-hidden sm:h-[80vh] sm:min-h-[500px] md:h-[85vh]">
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(media.backdrop_path, "w1280")}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(129,99,164,0.15),transparent_60%)]" />
      </div>
      <div className="hero-fade absolute inset-0" />
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm sm:text-[10px]">
                {media.media_type === "tv" ? "Series" : "Movie"}
              </span>
              {media.vote_average > 0 && (
                <span className="flex items-center gap-1 text-xs text-white/70 sm:text-sm">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  {media.vote_average.toFixed(1)}
                </span>
              )}
            </div>
            <h1 className="font-grotesk text-3xl font-medium leading-[0.95] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              {title}
            </h1>
            {media.overview && (
              <p className="mt-3 line-clamp-2 max-w-lg text-xs leading-relaxed text-white/60 sm:mt-4 sm:text-sm md:text-base sm:line-clamp-3">
                {truncate(media.overview, 160)}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              <Link
                href={`${href}?autoplay=1`}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-105 active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
              >
                <Play size={14} fill="black" aria-hidden="true" />
                Watch Now
              </Link>
              <button
                onClick={() => addToWatchlist(media.id, media.media_type || "movie")}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:px-5 sm:py-3 sm:text-sm"
                aria-label={inWatchlist ? "In watchlist" : "Add to watchlist"}
              >
                {inWatchlist ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" className="sm:h-4 sm:w-4" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus size={14} className="sm:h-4 sm:w-4" aria-hidden="true" />
                    Add to List
                  </>
                )}
              </button>
              <Link
                href={href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:h-11 sm:w-11"
                aria-label="More info"
              >
                <Info size={14} className="sm:h-4 sm:w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
