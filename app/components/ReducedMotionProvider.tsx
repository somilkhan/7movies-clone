"use client"

import { createContext, useContext, useEffect, useState } from "react"

const Ctx = createContext(false)

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return <Ctx.Provider value={prefersReducedMotion}>{children}</Ctx.Provider>
}

export const useReducedMotion = () => useContext(Ctx)
