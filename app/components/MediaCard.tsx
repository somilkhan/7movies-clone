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

  if (variant === "poster") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="group"
      >
        <Link href={href} className="block" aria-label={`${title}${year ? ` (${year})` : ""}${rating ? `, rated ${rating}` : ""}`}>
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
            <Image
              src={getImageUrl(media.poster_path || media.backdrop_path, "w500")}
              alt={`${title} poster`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
              loading={index < 6 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {rating > 0 && (
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-0.5 text-xs font-semibold text-yellow-400 backdrop-blur-sm">
                <Star size={10} className="fill-yellow-400" aria-hidden="true" />
                {rating}
              </div>
            )}
            <button
              onClick={handleWatchlistToggle}
              className={cn(
                "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200",
                inWatchlist
                  ? "bg-white text-black"
                  : "bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black"
              )}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
            </button>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-medium text-white line-clamp-1">{title}</h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              {year && <span>{year}</span>}
              {media.media_type && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="capitalize">{media.media_type}</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    )
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
            <button
              onClick={handleWatchlistToggle}
              className={cn(
                "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200",
                inWatchlist ? "bg-white text-black" : "bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black"
              )}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-medium text-white line-clamp-1">{title}</h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              {year && <span>{year}</span>}
              {media.media_type && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="capitalize">{media.media_type}</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // backdrop variant
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group relative">
      <Link href={href} className="block" aria-label={`${title}${year ? ` (${year})` : ""}${rating ? `, rated ${rating}` : ""}`}>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface">
          <Image src={getImageUrl(media.backdrop_path || media.poster_path, "w780")}
            alt={`${title} backdrop`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="100vw" loading={index < 3 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-base font-semibold text-white line-clamp-1">{title}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
              {year && <span>{year}</span>}
              {rating > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={10} className="fill-yellow-400" aria-hidden="true" />
                  {rating}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleWatchlistToggle}
            className={cn(
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200",
              inWatchlist ? "bg-white text-black" : "bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black"
            )}
            aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </Link>
    </motion.div>
  )
}
