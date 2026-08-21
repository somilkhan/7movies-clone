"use client"

import { useEffect } from "react"
import { getContinueWatching, getWatchlist, subscribeToMediaState } from "@/lib/supabase/media-state"
import { useAppStore } from "@/stores/useAppStore"
import type { ContinueWatchingItem, WatchlistItem } from "@/types"

function mapContinueWatching(row: Awaited<ReturnType<typeof getContinueWatching>>[number]): ContinueWatchingItem {
  const metadata = row.metadata && typeof row.metadata === "object" && !Array.isArray(row.metadata) ? row.metadata as Record<string, unknown> : {}
  return {
    id: row.tmdb_id,
    type: row.media_type === "tv" || row.media_type === "episode" ? "tv" : "movie",
    title: typeof metadata.title === "string" ? metadata.title : "Continue watching",
    poster: typeof metadata.poster === "string" ? metadata.poster : null,
    backdrop: typeof metadata.backdrop === "string" ? metadata.backdrop : null,
    watched: row.progress_seconds,
    duration: row.duration_seconds ?? 0,
    season: row.season_number ?? undefined,
    episode: row.episode_number ?? undefined,
    episodeName: typeof metadata.episodeName === "string" ? metadata.episodeName : undefined,
    timestamp: Date.parse(row.updated_at) || Date.now(),
  }
}

export function SupabaseMediaSync() {
  const userId = useAppStore((state) => state.cloudUserId)
  const hydrateCloudState = useAppStore((state) => state.hydrateCloudState)
  const localWatchlist = useAppStore((state) => state.watchlist)
  const localContinueWatching = useAppStore((state) => state.continueWatching)

  useEffect(() => {
    if (!userId) return
    let active = true

    const hydrate = async () => {
      try {
        const [watchlist, continueWatching] = await Promise.all([getWatchlist(userId), getContinueWatching(userId)])
        if (!active) return

        const cloudWatchlist: WatchlistItem[] = watchlist.map((item) => ({
          id: item.tmdb_id,
          mediaType: item.media_type as "movie" | "tv",
          addedAt: item.added_at,
        }))

        const mergedWatchlist = cloudWatchlist.length ? cloudWatchlist : localWatchlist
        const mergedContinue = continueWatching.length ? continueWatching.map(mapContinueWatching) : localContinueWatching
        hydrateCloudState(mergedWatchlist, mergedContinue)
      } catch {
        // Keep local state when cloud hydration is unavailable.
      }
    }

    void hydrate()

    const channel = subscribeToMediaState(userId, (table, payload) => {
      if (!active || !payload || typeof payload !== "object") return
      const record = (payload as { new?: Record<string, unknown>; old?: Record<string, unknown> }).new
      if (table === "watchlist" && record?.tmdb_id && record?.media_type) {
        const next = useAppStore.getState().watchlist.filter((item) => item.id !== Number(record.tmdb_id))
        hydrateCloudState([...next, { id: Number(record.tmdb_id), mediaType: record.media_type as "movie" | "tv", addedAt: String(record.added_at ?? new Date().toISOString()) }], useAppStore.getState().continueWatching)
      }
      if (table === "continue_watching" && record?.tmdb_id) {
        hydrateCloudState(useAppStore.getState().watchlist, [...useAppStore.getState().continueWatching.filter((item) => item.id !== Number(record.tmdb_id)), mapContinueWatching(record as never)])
      }
    })

    return () => {
      active = false
      void channel.unsubscribe()
    }
  }, [userId, hydrateCloudState, localContinueWatching, localWatchlist])

  return null
}
