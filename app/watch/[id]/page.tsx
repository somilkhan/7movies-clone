"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Share2, Heart, Check } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/stores/useAppStore"
import { saveContinueWatching } from "@/app/components/ContinueWatching"
import { useEffect } from "react"
import { useReducedMotion } from "@/app/components/ReducedMotionProvider"

export default function WatchPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "movie"
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore()
  const inWatchlist = isInWatchlist(Number(params.id))
  const embedUrl = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    saveContinueWatching({ id: Number(params.id), mediaType: type as "movie" | "tv", title: "Now Playing", posterPath: null, progress: 0 })
  }, [params.id, type])

  return (
    <main className="min-h-screen">
      <motion.div initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}
        className="glass fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3">
        <Link href={type === "tv" ? `/tv/${params.id}` : `/movie/${params.id}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
          aria-label="Go back">
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10" aria-label="Share">
            <Share2 size={16} aria-hidden="true" />
          </button>
          <button onClick={() => inWatchlist ? removeFromWatchlist(Number(params.id)) : addToWatchlist(Number(params.id), type as "movie" | "tv")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
            aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
            {inWatchlist ? <Check size={16} aria-hidden="true" /> : <Heart size={16} aria-hidden="true" />}
          </button>
        </div>
      </motion.div>
      <div className="relative aspect-video w-full bg-black pt-12 sm:pt-14">
        <iframe src={embedUrl} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Video Player" />
      </div>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-grotesk text-xl font-medium text-white sm:text-2xl">Now Playing</h1>
          <p className="mt-2 text-sm text-muted">Replace the embed URL with your licensed video player. This is a placeholder.</p>
          <div className="mt-4 rounded-xl bg-surface p-4">
            <p className="font-mono text-xs text-muted">Embed URL:</p>
            <code className="mt-1 block break-all text-xs text-white/50">{embedUrl}</code>
          </div>
        </div>
      </div>
    </main>
  )
}
