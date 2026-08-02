"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Plus, Check } from "lucide-react"
import { Media } from "@/types"
import { getImageUrl, getYear } from "@/lib/utils"
import { useAppStore } from "@/stores/useAppStore"
import { toast } from "@/app/components/Toast"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  media: Media
  index?: number
  variant?: "poster" | "grid" | "backdrop"
}

export function MediaCard({ media, index = 0, variant = "poster" }: MediaCardProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore()
  const inWatchlist = isInWatchlist(media.id)
  const title = media.title || media.name || "Untitled"
  const year = getYear(media.release_date || media.first_air_date)
  const rating = Math.round(media.vote_average || 0)
  const href = media.media_type === "tv" || (media as any).first_air_date ? `/tv/${media.id}` : `/movie/${media.id}`

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (inWatchlist) { removeFromWatchlist(media.id); toast(`Removed "${title}" from watchlist`, "info") }
    else { addToWatchlist(media.id, media.media_type || "movie"); toast(`Added "${title}" to watchlist`, "success") }
  }

  if (variant === "grid") {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}
        className="group relative">
        <Link href={href} className="block" aria-label={`${title}${year ? ` (${year})` : ""}${rating ? `, rated ${rating}` : ""}`}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface">
            <Image src={getImageUrl(media.backdrop_path || media.poster_path, "w500")}
              alt={`${title} poster`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" loading={index < 6 ? "eager" : "lazy"} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {rating > 0 && (
              <div className="absolute left-2 top-2 flex items-center gap-1 text-xs font-semibold text-yellow-400">
                <Star size={12} className="fill-yellow-400" aria-hidden="true" />
                {rating}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h3 className="truncate text-sm font-semibold text-white">{title}</h3>
            <p className="mt-0.5 text-xs text-white/50">{year || "Coming soon"}</p>
          </div>
        </Link>
        <button onClick={handleWatchlistToggle}
          aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
          className={cn("absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
            inWatchlist ? "bg-white text-black" : "bg-black/40 text-white opacity-0 backdrop-blur-sm group-hover:opacity-100 hover:bg-white/20")}>
          {inWatchlist ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : <Plus size={14} strokeWidth={2} aria-hidden="true" />}
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex-shrink-0 scroll-snap-start">
      <Link href={href} className="block" aria-label={`${title}${year ? ` (${year})` : ""}${rating ? `, rated ${rating}` : ""}`}>
        <div className={cn("media-card relative overflow-hidden rounded-card bg-surface", variant === "poster" ? "w-[140px] sm:w-[160px] md:w-[180px]" : "w-[260px] sm:w-[300px] md:w-[340px]")}>
          <div className={cn("relative overflow-hidden", variant === "poster" ? "aspect-[2/3]" : "aspect-video")}>
            <Image src={getImageUrl(variant === "poster" ? media.poster_path : media.backdrop_path, variant === "poster" ? "w500" : "w780")}
              alt={`${title} poster`} fill className="poster-img object-cover" sizes={variant === "poster" ? "180px" : "340px"} loading={index < 6 ? "eager" : "lazy"} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {rating > 0 && <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm"><Star size={10} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />{rating}</div>}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"><svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg></div>
            </div>
          </div>
          <div className="p-2.5">
            <h3 className="truncate text-[13px] font-medium text-white/90">{title}</h3>
            <p className="mt-0.5 text-[11px] text-muted">{year || "Coming soon"}</p>
          </div>
        </div>
      </Link>
      <button onClick={handleWatchlistToggle} aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
        className={cn("absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
          inWatchlist ? "bg-white text-black" : "bg-black/40 text-white opacity-0 backdrop-blur-sm group-hover:opacity-100 hover:bg-white/20")}>
        {inWatchlist ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : <Plus size={14} strokeWidth={2} aria-hidden="true" />}
      </button>
    </motion.div>
  )
}
