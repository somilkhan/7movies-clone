"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, Info, Star } from "lucide-react"
import { Media } from "@/types"
import { getImageUrl, truncate } from "@/lib/utils"
import { useReducedMotion } from "./ReducedMotionProvider"

interface HeroProps {
  media: Media
}

export function Hero({ media }: HeroProps) {
  const title = media.title || media.name || "Untitled"
  const href = media.media_type === "tv" || (media as any).first_air_date
    ? `/tv/${media.id}`
    : `/movie/${media.id}`
  const prefersReducedMotion = useReducedMotion()
  const matchScore = Math.min(Math.round(((media.vote_average || 0) / 10) * 100), 98)
  const year = media.release_date || media.first_air_date
    ? new Date(media.release_date || media.first_air_date!).getFullYear()
    : null

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(media.backdrop_path, "w1280")}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end px-5 pb-16">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Curated for tonight
          </p>
          <h1 className="font-grotesk text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span className="font-medium text-green-400">{matchScore}% Match</span>
            <span className="text-white/30">·</span>
            {year && <span>{year}</span>}
            {year && <span className="text-white/30">·</span>}
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
              {Math.round(media.vote_average || 0)}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white/50">Trending</span>
          </div>
          {media.overview && (
            <p className="mt-3 line-clamp-3 max-w-md text-sm leading-relaxed text-white/60">
              {truncate(media.overview, 180)}
            </p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <Link
              href={`${href}?autoplay=1`}
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <Play size={16} fill="black" aria-hidden="true" />
              Watch now
            </Link>
            <Link
              href={href}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Info size={16} aria-hidden="true" />
              Info
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
