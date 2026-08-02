"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Loader2 } from "lucide-react"
import { useQueries } from "@tanstack/react-query"
import { useAppStore } from "@/stores/useAppStore"
import { MediaCard } from "./MediaCard"
import { Media } from "@/types"

async function fetchMediaDetails(id: number, mediaType: "movie" | "tv"): Promise<Media | null> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_TOKEN || ""}`, {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN || ""}`, "Content-Type": "application/json" }
    })
    if (!res.ok) return null
    const data = await res.json()
    return { ...data, media_type: mediaType }
  } catch { return null }
}

export function WatchlistGrid() {
  const { watchlist } = useAppStore()
  const queries = useQueries({
    queries: watchlist.map((item) => ({
      queryKey: ["watchlist-item", item.id, item.mediaType],
      queryFn: () => fetchMediaDetails(item.id, item.mediaType),
      enabled: watchlist.length > 0,
    })),
  })
  const items = useMemo(() => queries.map((q) => q.data).filter((d): d is Media => d !== null && d !== undefined), [queries])
  const isLoading = queries.some((q) => q.isLoading)

  if (watchlist.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03]"><Heart size={24} className="text-muted" /></div>
        <h2 className="mt-4 font-grotesk text-xl font-medium text-white">Your watchlist is empty</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">Start adding movies and shows you want to watch. Tap the + button on any card.</p>
      </div>
    )
  }
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-grotesk text-2xl font-medium text-white sm:text-3xl">Watchlist</h1>
      <p className="mt-1 text-sm text-muted">{watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved</p>
      {isLoading ? (
        <div className="mt-12 flex items-center justify-center"><Loader2 size={28} className="animate-spin text-muted" /></div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((media, index) => (
              <motion.div key={media.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}>
                <MediaCard media={media} index={index} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
