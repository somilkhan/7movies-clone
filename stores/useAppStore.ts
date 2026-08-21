"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { WatchlistItem, ContinueWatchingItem, AppSettings } from "@/types"
import { deleteContinueWatching, removeWatchlistItem, setWatchlistItem, upsertContinueWatching } from "@/lib/supabase/media-state"

interface AppState {
  activeTab: string
  setActiveTab: (tab: string) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  accountOpen: boolean
  setAccountOpen: (open: boolean) => void
  cloudUserId: string | null
  setCloudUserId: (userId: string | null) => void
  hydrateCloudState: (watchlist: WatchlistItem[], continueWatching: ContinueWatchingItem[]) => void
  watchlist: WatchlistItem[]
  addToWatchlist: (id: number, mediaType: "movie" | "tv") => void
  removeFromWatchlist: (id: number) => void
  isInWatchlist: (id: number) => boolean
  continueWatching: ContinueWatchingItem[]
  addToContinueWatching: (item: ContinueWatchingItem) => void
  removeFromContinueWatching: (id: number) => void
  clearContinueWatching: () => void
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
  hasCompletedOnboarding: boolean
  setOnboardingComplete: (value: boolean) => void
  selectedGenres: number[]
  toggleGenre: (genreId: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchHistory: string[]
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: "home",
      setActiveTab: (tab) => set({ activeTab: tab }),
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
      accountOpen: false,
      setAccountOpen: (open) => set({ accountOpen: open }),
      cloudUserId: null,
      setCloudUserId: (userId) => set({ cloudUserId: userId }),
      hydrateCloudState: (watchlist, continueWatching) => set({ watchlist, continueWatching }),
      watchlist: [],
      addToWatchlist: (id, mediaType) => {
        const userId = get().cloudUserId
        const addedAt = new Date().toISOString()
        set((state) => ({ watchlist: state.watchlist.some((item) => item.id === id) ? state.watchlist : [...state.watchlist, { id, mediaType, addedAt }] }))
        if (userId) void setWatchlistItem(userId, { tmdb_id: id, media_type: mediaType, metadata: {} }).catch(() => undefined)
      },
      removeFromWatchlist: (id) => {
        const userId = get().cloudUserId
        const item = get().watchlist.find((entry) => entry.id === id)
        set((state) => ({ watchlist: state.watchlist.filter((entry) => entry.id !== id) }))
        if (userId && item) void removeWatchlistItem(userId, id, item.mediaType).catch(() => undefined)
      },
      isInWatchlist: (id) => get().watchlist.some((item) => item.id === id),
      continueWatching: [],
      addToContinueWatching: (item) => {
        const userId = get().cloudUserId
        set((state) => ({ continueWatching: [item, ...state.continueWatching.filter((entry) => entry.id !== item.id)].slice(0, 20) }))
        if (userId) {
          void upsertContinueWatching(userId, {
            content_key: `${item.type}:${item.id}:${item.season ?? 0}:${item.episode ?? 0}`,
            tmdb_id: item.id,
            media_type: item.type,
            season_number: item.season ?? null,
            episode_number: item.episode ?? null,
            progress_seconds: Math.max(0, Math.floor(item.watched)),
            duration_seconds: item.duration > 0 ? Math.floor(item.duration) : null,
            metadata: { title: item.title, poster: item.poster, backdrop: item.backdrop, episodeName: item.episodeName },
            updated_at: new Date(item.timestamp || Date.now()).toISOString(),
          }).catch(() => undefined)
        }
      },
      removeFromContinueWatching: (id) => {
        const userId = get().cloudUserId
        const item = get().continueWatching.find((entry) => entry.id === id)
        set((state) => ({ continueWatching: state.continueWatching.filter((entry) => entry.id !== id) }))
        if (userId && item) void deleteContinueWatching(userId, `${item.type}:${item.id}:${item.season ?? 0}:${item.episode ?? 0}`).catch(() => undefined)
      },
      clearContinueWatching: () => {
        const userId = get().cloudUserId
        const items = get().continueWatching
        set({ continueWatching: [] })
        if (userId) void Promise.all(items.map((item) => deleteContinueWatching(userId, `${item.type}:${item.id}:${item.season ?? 0}:${item.episode ?? 0}`))).catch(() => undefined)
      },
      settings: { ambience: "standard", spoilerProtection: true, reducedMotion: false, autoplayTrailers: false },
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      hasCompletedOnboarding: false,
      setOnboardingComplete: (value) => set({ hasCompletedOnboarding: value }),
      selectedGenres: [],
      toggleGenre: (genreId) => set((state) => ({ selectedGenres: state.selectedGenres.includes(genreId) ? state.selectedGenres.filter((id) => id !== genreId) : [...state.selectedGenres, genreId] })),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchHistory: [],
      addToSearchHistory: (query) => set((state) => ({ searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10) })),
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: "7movies-storage",
      partialize: (state) => ({ watchlist: state.watchlist, continueWatching: state.continueWatching, settings: state.settings, hasCompletedOnboarding: state.hasCompletedOnboarding, selectedGenres: state.selectedGenres, searchHistory: state.searchHistory, activeTab: state.activeTab }),
    },
  ),
)
