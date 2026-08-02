"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useReducedMotion } from "./ReducedMotionProvider"

export function KeyboardShortcuts() {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      switch (e.key.toLowerCase()) {
        case "k": e.preventDefault(); window.dispatchEvent(new CustomEvent("open-search")); break
        case "escape": e.preventDefault(); window.dispatchEvent(new CustomEvent("close-dialogs")); break
        case "h": e.preventDefault(); router.push("/"); break
        case "w": e.preventDefault(); router.push("/watchlist"); break
        case "s": e.preventDefault(); router.push("/settings"); break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router])

  return null
}
