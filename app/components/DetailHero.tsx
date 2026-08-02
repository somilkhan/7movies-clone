"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Plus, Check, Star, Clock } from "lucide-react"
import { Movie, TVShow } from "@/types"
import { getImageUrl, formatRuntime, getYear, getTrailerKey } from "@/lib/utils"
import { useAppStore } from "@/stores/useAppStore"
import { useReducedMotion } from "./ReducedMotionProvider"

interface DetailHeroProps {
  media: Movie | TVShow
  mediaType: "movie" | "tv"
}

export function DetailHero({ media, mediaType }: DetailHeroProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore()
  const inWatchlist = isInWatchlist(media.id)
  const title = (media as Movie).title || (media as TVShow).name || "Untitled"
  const year = getYear((media as Movie).release_date || (media as TVShow).first_air_date)
  const runtime = (media as Movie).runtime || ((media as TVShow).episode_run_time?.[0] ?? 0)
  const trailerKey = getTrailerKey(media.videos)
  const watchHref = `/watch/${media.id}?type=${mediaType}${trailerKey ? `&trailer=${trailerKey}` : ""}`
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative">
      <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden sm:h-[55vh] sm:min-h-[400px] md:h-[60vh]">
        <Image
          src={getImageUrl(media.backdrop_path, "w1280")}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 to-transparent" />
      </div>
      <div className="relative -mt-24 px-4 pb-8 sm:-mt-28 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-6 md:flex-row">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 self-center md:self-auto"
          >
            <div className="relative aspect-[2/3] w-[130px] overflow-hidden rounded-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:w-[160px] md:w-[180px] lg:w-[200px]">
              <Image
                src={getImageUrl(media.poster_path, "w500")}
                alt={`${title} poster`}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 pt-2 text-center sm:pt-4 md:text-left"
          >
            <h1 className="font-grotesk text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-muted sm:mt-3 sm:gap-3 sm:text-sm md:justify-start">
              {year && <span>{year}</span>}
              {runtime > 0 && (
                <>
                  <span className="hidden h-1 w-1 rounded-full bg-muted/50 sm:inline" />
                  <span className="flex items-center gap-1">
                    <Clock size={12} aria-hidden="true" />
                    {formatRuntime(runtime)}
                  </span>
                </>
              )}
              {media.vote_average > 0 && (
                <>
                  <span className="hidden h-1 w-1 rounded-full bg-muted/50 sm:inline" />
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    {media.vote_average.toFixed(1)}
                  </span>
                </>
              )}
              {media.genres?.slice(0, 3).map((g) => (
                <span key={g.id} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] sm:text-xs">{g.name}</span>
              ))}
            </div>
            {media.tagline && (
              <p className="mt-2 text-xs italic text-white/50 sm:mt-3 sm:text-sm">&ldquo;{media.tagline}&rdquo;</p>
            )}
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/70 sm:mt-4 sm:text-sm md:text-base">
              {media.overview || "No overview available."}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3 md:justify-start">
              <Link href={watchHref}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-105 active:scale-95 sm:px-6 sm:py-3 sm:text-sm">
                <Play size={14} fill="black" aria-hidden="true" />
                Watch Now
              </Link>
              <button onClick={() => inWatchlist ? removeFromWatchlist(media.id) : addToWatchlist(media.id, mediaType)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:px-5 sm:py-3 sm:text-sm"
                aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
                {inWatchlist ? <><Check size={14} aria-hidden="true" />In Watchlist</> : <><Plus size={14} aria-hidden="true" />Add to List</>}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
