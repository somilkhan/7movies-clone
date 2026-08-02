"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, Heart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchDialog } from "./SearchDialog"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { label: "Search", icon: Search, isSearch: true },
  { href: "/watchlist", label: "Watchlist", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50" aria-label="Main navigation">
        <div className="glass border-t border-white/[0.08]">
          <div className="mx-auto flex max-w-md items-center justify-around px-1 py-1.5 sm:px-2 sm:py-2">
            {navItems.map((item) => {
              const isActive = item.href && (pathname === item.href || pathname?.startsWith(item.href + "/"))
              const Icon = item.icon

              if (item.isSearch) {
                return (
                  <button
                    key="search"
                    onClick={() => setSearchOpen(true)}
                    className="relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-white/40 transition-colors duration-200 hover:text-white/70 sm:gap-1 sm:px-4 sm:py-2"
                    aria-label="Open search"
                  >
                    <Icon size={20} strokeWidth={1.5} className="sm:h-[22px] sm:w-[22px]" aria-hidden="true" />
                    <span className="text-[9px] font-medium tracking-wide sm:text-[10px]">{item.label}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors duration-200 sm:gap-1 sm:px-4 sm:py-2",
                    isActive
                      ? "text-white"
                      : "text-white/40 hover:text-white/70"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className="sm:h-[22px] sm:w-[22px]" aria-hidden="true" />
                  <span className="text-[9px] font-medium tracking-wide sm:text-[10px]">{item.label}</span>
                  {isActive && (
                    <span className="absolute -top-[1px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-white sm:w-5" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
