"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/stores/useAppStore"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { setSearchOpen, setAccountOpen } = useAppStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key.toLowerCase()
      if (k === "k") {
        e.preventDefault()
        setSearchOpen(true)
      } else if (k === "escape") {
        if (document.querySelector("[role='dialog']")) {
          e.preventDefault()
          setSearchOpen(false)
          setAccountOpen(false)
        }
      } else if (k === "h") {
        e.preventDefault()
        router.push("/")
      } else if (k === "w") {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent("open-watchlist"))
      } else if (k === "s") {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent("open-settings"))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router, setSearchOpen, setAccountOpen])

  return null
}
