"use client"

import { NavPill } from "./NavPill"
import { useAppStore } from "@/stores/useAppStore"

export function Topbar() {
  const { activeTab, setActiveTab, setSearchOpen, setAccountOpen } = useAppStore()

  const tabValue = activeTab === "home" ? "Home" : activeTab === "movies" ? "Movies" : "TV"

  return (
    <header className="topbar">
      <a href="/" className="wordmark">7Movies</a>
      <NavPill
        value={tabValue}
        onChange={(tab) => setActiveTab(tab.toLowerCase())}
        onSearchClick={() => setSearchOpen(true)}
        onAccountClick={() => setAccountOpen(true)}
      />
    </header>
  )
}
