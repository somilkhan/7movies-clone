"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { WatchlistItem, AmbienceTheme, AppSettings } from "@/types"

interface AppState {
  // Watchlist
  watchlist: WatchlistItem[]
  addToWatchlist: (id: number, mediaType: "movie" | "tv") => void
  removeFromWatchlist: (id: number) => void
  isInWatchlist: (id: number) => boolean

  // Settings
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void

  // Onboarding
  hasCompletedOnboarding: boolean
  setOnboardingComplete: (value: boolean) => void
  selectedGenres: number[]
  toggleGenre: (genreId: number) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchHistory: string[]
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Watchlist
      watchlist: [],
      addToWatchlist: (id, mediaType) =>
        set((state) => ({
          watchlist: state.watchlist.some((item) => item.id === id)
            ? state.watchlist
            : [...state.watchlist, { id, mediaType, addedAt: new Date().toISOString() }],
        })),
      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((item) => item.id !== id),
        })),
      isInWatchlist: (id) => get().watchlist.some((item) => item.id === id),

      // Settings
      settings: {
        ambience: "standard",
        spoilerProtection: true,
        autoplayTrailers: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Onboarding
      hasCompletedOnboarding: false,
      setOnboardingComplete: (value) => set({ hasCompletedOnboarding: value }),
      selectedGenres: [],
      toggleGenre: (genreId) =>
        set((state) => ({
          selectedGenres: state.selectedGenres.includes(genreId)
            ? state.selectedGenres.filter((id) => id !== genreId)
            : [...state.selectedGenres, genreId],
        })),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchHistory: [],
      addToSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: "7movies-storage",
      partialize: (state) => ({
        watchlist: state.watchlist,
        settings: state.settings,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        selectedGenres: state.selectedGenres,
        searchHistory: state.searchHistory,
      }),
    }
  )
)
