"use client"

import { useEffect } from "react"
import { getContinueWatching, getWatchlist, subscribeToMediaState } from "@/lib/supabase/media-state"
import { useAppStore } from "@/stores/useAppStore"
import type { ContinueWatchingItem, WatchlistItem } from "@/types"

type MediaRecord = Record<string, unknown>

function mapContinueWatchingRecord(row: MediaRecord): ContinueWatchingItem {
  const metadata = row.metadata && typeof row.metadata === "object" && !Array.isArray(row.metadata) ? row.metadata as MediaRecord : {}
  const mediaType = String(row.media_type ?? "movie")
  return {
    id: Number(row.tmdb_id),
    type: mediaType === "tv" || mediaType === "episode" ? "tv" : "movie",
    title: typeof metadata.title === "string" ? metadata.title : "Continue watching",
    poster: typeof metadata.poster === "string" ? metadata.poster : null,
    backdrop: typeof metadata.backdrop === "string" ? metadata.backdrop : null,
    watched: Number(row.progress_seconds ?? 0),
    duration: Number(row.duration_seconds ?? 0),
    season: typeof row.season_number === "number" ? row.season_number : undefined,
    episode: typeof row.episode_number === "number" ? row.episode_number : undefined,
    episodeName: typeof metadata.episodeName === "string" ? metadata.episodeName : undefined,
    timestamp: typeof row.updated_at === "string" ? Date.parse(row.updated_at) || Date.now() : Date.now(),
  }
}

export function SupabaseMediaSync() {
  const userId = useAppStore((state) => state.cloudUserId)
  const hydrateCloudState = useAppStore((state) => state.hydrateCloudState)

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
        const cloudContinue = continueWatching.map(mapContinueWatchingRecord)
        const state = useAppStore.getState()
        hydrateCloudState(cloudWatchlist.length ? cloudWatchlist : state.watchlist, cloudContinue.length ? cloudContinue : state.continueWatching)
      } catch {
        // Keep local state when cloud hydration is unavailable.
      }
    }

    void hydrate()

    const channel = subscribeToMediaState(userId, (table, payload) => {
      if (!active || !payload || typeof payload !== "object") return
      const event = payload as { eventType?: string; new?: MediaRecord; old?: MediaRecord }
      const record = event.eventType === "DELETE" ? event.old : event.new
      if (!record) return

      const state = useAppStore.getState()
      if (table === "watchlist" && record.tmdb_id && record.media_type) {
        const id = Number(record.tmdb_id)
        const next = state.watchlist.filter((item) => item.id !== id)
        if (event.eventType !== "DELETE") {
          next.push({ id, mediaType: String(record.media_type) as "movie" | "tv", addedAt: String(record.added_at ?? new Date().toISOString()) })
        }
        hydrateCloudState(next, state.continueWatching)
      }

      if (table === "continue_watching" && record.tmdb_id) {
        const id = Number(record.tmdb_id)
        const next = state.continueWatching.filter((item) => item.id !== id)
        if (event.eventType !== "DELETE") next.unshift(mapContinueWatchingRecord(record))
        hydrateCloudState(state.watchlist, next.slice(0, 20))
      }
    })

    return () => {
      active = false
      void channel.unsubscribe()
    }
  }, [userId, hydrateCloudState])

  return null
}
