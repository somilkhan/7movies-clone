"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Search, User, Tv, Clapperboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchDialog } from "./SearchDialog"

const navItems = [
  { href: "/", label: "Home", isLogo: true },
  { href: "/movies", label: "Movies", icon: Clapperboard },
  { href: "/tv", label: "TV", icon: Tv },
  { label: "Search", icon: Search, isSearch: true },
  { href: "/settings", label: "Profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2" aria-label="Main navigation">
        <div className="flex items-center gap-1 rounded-full bg-[#1a1a1a]/90 px-2 py-2 backdrop-blur-xl border border-white/[0.06]">
          {navItems.map((item) => {
            const isActive = item.href && pathname === item.href
            const Icon = item.icon

            if (item.isLogo) {
              return (
                <Link
                  key="home"
                  href="/"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all",
                    isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
                  )}
                  aria-label="Home"
                  aria-current={isActive ? "page" : undefined}
                >
                  7
                </Link>
              )
            }

            if (item.isSearch) {
              return (
                <button
                  key="search"
                  onClick={() => setSearchOpen(true)}
                  className="flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                  aria-label="Search"
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="text-[9px] font-medium leading-none">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 transition-all",
                  isActive
                    ? "bg-white text-black"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
