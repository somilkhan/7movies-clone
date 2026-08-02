"use client"

import { use } from "react"
import { motion } from "framer-motion"
import { Play, Plus, Check, Star, Clock, Calendar, ChevronDown, Download, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMovie, useCredits, useSimilar, useMovieVideos } from "@/lib/hooks/useTMDB"
import { useAppStore } from "@/stores/useAppStore"
import { getImageUrl, getYear, formatRuntime } from "@/lib/utils"
import { DetailHero } from "@/app/components/DetailHero"
import { CastList } from "@/app/components/CastList"
import { ContentSection } from "@/app/components/ContentSection"
import { Navigation } from "@/app/components/Navigation"
import { toast } from "@/app/components/Toast"
import { cn } from "@/lib/utils"

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: movie, isLoading } = useMovie(Number(id))
  const { data: credits } = useCredits(Number(id), "movie")
  const { data: similar } = useSimilar(Number(id), "movie")
  const { data: videos } = useMovieVideos(Number(id))
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore()

  const inWatchlist = movie ? isInWatchlist(movie.id) : false

  const handleWatchlistToggle = () => {
    if (!movie) return
    if (inWatchlist) {
      removeFromWatchlist(movie.id)
      toast(`Removed "${movie.title}" from watchlist`, "info")
    } else {
      addToWatchlist(movie.id, "movie")
      toast(`Added "${movie.title}" to watchlist`, "success")
    }
  }

  if (isLoading || !movie) {
    return (
      <main className="min-h-screen bg-black">
        <div className="aspect-[16/9] animate-pulse bg-white/[0.04]" />
        <div className="px-5 py-8">
          <div className="h-8 w-3/4 animate-pulse rounded bg-white/[0.04]" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-white/[0.04]" />
        </div>
      </main>
    )
  }

  const year = getYear(movie.release_date)
  const trailer = videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")
  const trailerKey = trailer?.key

  return (
    <>
      <main className="min-h-screen bg-black pb-32">
        <DetailHero media={movie} trailerKey={trailerKey} />

        {/* Info */}
        <section className="px-5 py-6" aria-label="Movie information">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} aria-hidden="true" />
                  {year}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={14} aria-hidden="true" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} className="fill-yellow-400" aria-hidden="true" />
                  {Math.round(movie.vote_average * 10) / 10}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genres?.map((genre: any) => (
                <Link
                  key={genre.id}
                  href={`/movies?genre=${genre.id}`}
                  className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-white/70 transition-colors hover:bg-white/[0.06]"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              {movie.overview}
            </p>

            <div className="mt-5 flex gap-3">
              <Link
                href={`/watch/${id}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-black transition-transform active:scale-95"
              >
                <Play size={16} fill="black" aria-hidden="true" />
                Watch Now
              </Link>
              <button
                onClick={handleWatchlistToggle}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors",
                  inWatchlist
                    ? "border-white/20 bg-white text-black"
                    : "border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                )}
                aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {inWatchlist ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Plus size={16} aria-hidden="true" />
                )}
                {inWatchlist ? "In Watchlist" : "My List"}
              </button>
            </div>
          </div>
        </section>

        {/* Stream Server */}
        <section className="px-5 py-4" aria-label="Stream">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                Server
              </label>
              <button className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white">
                <span>VidRift · stable · fast</span>
                <ChevronDown size={16} className="text-muted" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                  VidRift · Stream
                </p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  PREPARING YOUR STREAM
                </h3>
                <p className="mt-1 text-sm text-muted">Locating a server</p>
                <div className="mt-4 h-1 w-64 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-white/20" />
                </div>
                <div className="mt-2 flex w-64 justify-between text-[10px] text-muted">
                  <span>INITIALIZING</span>
                  <span>0%</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-3">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-sm font-medium text-white">
                <Download size={16} />
                Download
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-sm font-medium text-white">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </section>

        {/* Cast */}
        {credits?.cast && credits.cast.length > 0 && (
          <CastList cast={credits.cast} />
        )}

        {/* Similar */}
        {similar?.results && similar.results.length > 0 && (
          <ContentSection title="More Like This" items={similar.results.slice(0, 12)} />
        )}
      </main>
      <Navigation />
    </>
  )
}
