import type { RealtimeChannel } from "@supabase/supabase-js"
import { createClient } from "./client"
import type { Database, Json } from "./database.types"

type ContinueWatchingRow = Database["public"]["Tables"]["continue_watching"]["Row"]
type WatchlistRow = Database["public"]["Tables"]["watchlist"]["Row"]

export async function getContinueWatching(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("continue_watching")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(20)

  if (error) throw error
  return data as ContinueWatchingRow[]
}

export async function upsertContinueWatching(
  userId: string,
  item: Omit<Database["public"]["Tables"]["continue_watching"]["Insert"], "user_id">,
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("continue_watching")
    .upsert({ ...item, user_id: userId, metadata: (item.metadata ?? {}) as Json }, { onConflict: "user_id,content_key" })
    .select()
    .single()

  if (error) throw error
  return data as ContinueWatchingRow
}

export async function getWatchlist(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false })

  if (error) throw error
  return data as WatchlistRow[]
}

export async function setWatchlistItem(
  userId: string,
  item: Omit<Database["public"]["Tables"]["watchlist"]["Insert"], "user_id">,
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("watchlist")
    .upsert({ ...item, user_id: userId, metadata: (item.metadata ?? {}) as Json }, { onConflict: "user_id,tmdb_id,media_type" })
    .select()
    .single()

  if (error) throw error
  return data as WatchlistRow
}

export async function removeWatchlistItem(userId: string, tmdbId: number, mediaType: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType)

  if (error) throw error
}

export function subscribeToMediaState(
  userId: string,
  onChange: (table: "continue_watching" | "watchlist", payload: unknown) => void,
): RealtimeChannel {
  const supabase = createClient()
  return supabase
    .channel(`media-state:${userId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "continue_watching", filter: `user_id=eq.${userId}` }, (payload) =>
      onChange("continue_watching", payload),
    )
    .on("postgres_changes", { event: "*", schema: "public", table: "watchlist", filter: `user_id=eq.${userId}` }, (payload) =>
      onChange("watchlist", payload),
    )
    .subscribe()
}
