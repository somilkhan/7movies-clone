"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { FocusTrap } from "./FocusTrap"

const quickGenres = [
  { id: 28, name: "Action" }, { id: 35, name: "Comedy" }, { id: 18, name: "Drama" },
  { id: 27, name: "Horror" }, { id: 878, name: "Sci-Fi" }, { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" }, { id: 16, name: "Animation" }, { id: 80, name: "Crime" },
  { id: 14, name: "Fantasy" }, { id: 36, name: "History" }, { id: 99, name: "Documentary" },
]

export function Onboarding() {
  const { hasCompletedOnboarding, setOnboardingComplete, selectedGenres, toggleGenre } = useAppStore()
  if (hasCompletedOnboarding) return null
  const canProceed = selectedGenres.length >= 3
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <FocusTrap isActive={true} onEscape={() => setOnboardingComplete(true)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 w-full max-w-lg rounded-2xl border border-white/[0.08] bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:p-8"
            role="dialog" aria-modal="true" aria-label="Onboarding — pick your favorite genres">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05]">
                <Sparkles size={22} className="text-accent" aria-hidden="true" />
              </div>
              <h2 className="font-grotesk text-2xl font-medium text-white">Pick a few things you love</h2>
              <p className="mt-2 text-sm text-muted">Powers your For You feed — no account needed. Pick 3 or more.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {quickGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id)
                return (
                  <button key={genre.id} onClick={() => toggleGenre(genre.id)}
                    aria-pressed={isSelected}
                    className={`pick-card rounded-xl border px-3 py-3 text-sm font-medium transition-all ${isSelected ? "border-accent bg-white/[0.06] text-white" : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/10 hover:text-white/70"}`}>
                    <span className="flex items-center justify-center gap-1.5">{isSelected && <Check size={12} aria-hidden="true" />}{genre.name}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-muted" aria-live="polite">{selectedGenres.length} selected</p>
              <button onClick={() => setOnboardingComplete(true)} disabled={!canProceed}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100">Get Started</button>
            </div>
          </motion.div>
        </FocusTrap>
      </motion.div>
    </AnimatePresence>
  )
}
