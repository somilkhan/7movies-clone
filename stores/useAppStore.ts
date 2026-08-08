"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { WatchlistItem, ContinueWatchingItem, AmbienceTheme, AppSettings } from "@/types"

interface AppState {
  // Navigation
  activeTab: string
  setActiveTab: (tab: string) => void

  // Dialogs
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  accountOpen: boolean
  setAccountOpen: (open: boolean) => void

  // Watchlist
  watchlist: WatchlistItem[]
  addToWatchlist: (id: number, mediaType: "movie" | "tv") => void
  removeFromWatchlist: (id: number) => void
  isInWatchlist: (id: number) => boolean

  // Continue Watching
  continueWatching: ContinueWatchingItem[]
  addToContinueWatching: (item: ContinueWatchingItem) => void
  removeFromContinueWatching: (id: number) => void
  clearContinueWatching: () => void

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
      // Navigation
      activeTab: "home",
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Dialogs
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
      accountOpen: false,
      setAccountOpen: (open) => set({ accountOpen: open }),

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
      // Continue Watching
      continueWatching: [],
      addToContinueWatching: (item) =>
        set((state) => {
          const filtered = state.continueWatching.filter((c) => c.id !== item.id)
          return { continueWatching: [item, ...filtered].slice(0, 20) }
        }),
      removeFromContinueWatching: (id) =>
        set((state) => ({
          continueWatching: state.continueWatching.filter((c) => c.id !== id),
        })),
      clearContinueWatching: () => set({ continueWatching: [] }),

      // Settings
      settings: {
        ambience: "standard",
        spoilerProtection: true,
        reducedMotion: false,
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
        continueWatching: state.continueWatching,
        settings: state.settings,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        selectedGenres: state.selectedGenres,
        searchHistory: state.searchHistory,
        activeTab: state.activeTab,
      }),
    }
  )
)
