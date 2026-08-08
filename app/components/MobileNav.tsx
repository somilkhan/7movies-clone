"use client"

import { useEffect } from "react"
import { Home, Clapperboard, Tv, Search, CircleUserRound } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"

export function MobileNav() {
  const { activeTab, setActiveTab, setSearchOpen, setAccountOpen } = useAppStore()

  useEffect(() => {
    const onOpenSearch = () => setSearchOpen(true)
    const onOpenWatchlist = () => setAccountOpen(true)
    const onOpenSettings = () => setAccountOpen(true)
    window.addEventListener("open-search", onOpenSearch)
    window.addEventListener("open-watchlist", onOpenWatchlist)
    window.addEventListener("open-settings", onOpenSettings)
    return () => {
      window.removeEventListener("open-search", onOpenSearch)
      window.removeEventListener("open-watchlist", onOpenWatchlist)
      window.removeEventListener("open-settings", onOpenSettings)
    }
  }, [setSearchOpen, setAccountOpen])

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "movies", label: "Movies", icon: Clapperboard },
    { id: "tv", label: "TV", icon: Tv },
  ]

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
            <span>{tab.label}</span>
          </button>
        )
      })}
      <button
        type="button"
        className="mobile-nav-item"
        onClick={() => setSearchOpen(true)}
        aria-label="Search"
      >
        <Search size={16} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        className="mobile-nav-item"
        onClick={() => setAccountOpen(true)}
        aria-label="Profile"
      >
        <CircleUserRound size={16} strokeWidth={1.5} />
      </button>
    </nav>
  )
}
