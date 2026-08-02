"use client"

import { motion } from "framer-motion"
import { Palette, Eye, Play, Trash2, ChevronRight } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { AmbienceTheme } from "@/types"

export default function SettingsPage() {
  const { settings, updateSettings, clearSearchHistory, searchHistory, watchlist } = useAppStore()

  const ambienceOptions: { value: AmbienceTheme; label: string; description: string }[] = [
    { value: "subtle", label: "Subtle", description: "Barely visible ambient glow" },
    { value: "standard", label: "Standard", description: "Balanced ambient lighting" },
    { value: "vivid", label: "Vivid", description: "Strong purple ambient glow" },
  ]

  return (
    <main className="min-h-screen px-4 py-8 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Settings</p>
          <h1 className="mt-2 font-grotesk text-4xl font-medium text-white sm:text-5xl md:text-6xl">
            Preferences
          </h1>
        </motion.div>

        {/* Ambience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-muted" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Ambience</h2>
          </div>
          <p className="mt-1 text-sm text-white/50">Adjust the background ambient glow intensity.</p>

          <div className="mt-4 space-y-2">
            {ambienceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSettings({ ambience: option.value })}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  settings.ambience === option.value
                    ? "border-white/20 bg-white/[0.04]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{option.label}</p>
                  <p className="text-xs text-muted">{option.description}</p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 transition-colors ${
                    settings.ambience === option.value
                      ? "border-white bg-white"
                      : "border-white/20"
                  }`}
                >
                  {settings.ambience === option.value && (
                    <div className="m-1 h-2.5 w-2.5 rounded-full bg-black" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Spoiler Protection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-muted" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Spoilers</h2>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div>
              <p className="text-sm font-medium text-white">Spoiler Protection</p>
              <p className="text-xs text-muted">Blur episode stills until hovered</p>
            </div>
            <button
              onClick={() => updateSettings({ spoilerProtection: !settings.spoilerProtection })}
              className="toggle-switch"
              data-active={settings.spoilerProtection}
            >
              <i />
            </button>
          </div>
        </motion.section>

        {/* Autoplay */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2">
            <Play size={16} className="text-muted" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Playback</h2>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div>
              <p className="text-sm font-medium text-white">Autoplay Trailers</p>
              <p className="text-xs text-muted">Auto-play trailers on detail pages</p>
            </div>
            <button
              onClick={() => updateSettings({ autoplayTrailers: !settings.autoplayTrailers })}
              className="toggle-switch"
              data-active={settings.autoplayTrailers}
            >
              <i />
            </button>
          </div>
        </motion.section>

        {/* Data */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-muted" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">Data</h2>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={clearSearchHistory}
              disabled={searchHistory.length === 0}
              className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors hover:border-white/10 disabled:opacity-40"
            >
              <div>
                <p className="text-sm font-medium text-white">Clear Search History</p>
                <p className="text-xs text-muted">{searchHistory.length} searches saved</p>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>

            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div>
                <p className="text-sm font-medium text-white">Watchlist Items</p>
                <p className="text-xs text-muted">{watchlist.length} titles saved</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
