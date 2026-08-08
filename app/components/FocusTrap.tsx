"use client"

import { useEffect, useRef } from "react"

interface FocusTrapProps {
  children: React.ReactNode
  isActive: boolean
  onEscape?: () => void
}

export function FocusTrap({ children, isActive, onEscape }: FocusTrapProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return
    const el = ref.current
    if (!el) return

    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault()
        onEscape()
        return
      }
      if (e.key !== "Tab") return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    first?.focus()
    el.addEventListener("keydown", onKey)
    const orig = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      el.removeEventListener("keydown", onKey)
      document.body.style.overflow = orig
    }
  }, [isActive, onEscape])

  if (!isActive) return <>{children}</>
  return <div ref={ref}>{children}</div>
}
