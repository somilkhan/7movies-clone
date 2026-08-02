"use client"

import { motion } from "framer-motion"
import {
  Palette,
  Trash2,
  User,
  LogIn,
  UserPlus,
  MessageCircle,
  Send,
  Shield,
  Film,
} from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { AmbienceTheme } from "@/types"
import { useReducedMotion } from "../components/ReducedMotionProvider"

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    clearSearchHistory,
    searchHistory,
    watchlist,
  } = useAppStore()
  const prefersReducedMotion = useReducedMotion()

  const ambienceOptions: { value: AmbienceTheme; label: string }[] = [
    { value: "subtle", label: "Subtle" },
    { value: "standard", label: "Standard" },
    { value: "vivid", label: "Vivid" },
  ]

  return (
    <main className="min-h-screen bg-black px-4 pb-32 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Bottom Sheet Container */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="relative overflow-hidden rounded-t-card border border-white/[0.06] bg-[#111111]"
          role="dialog"
          aria-modal="true"
          aria-label="Profile and settings"
        >
          {/* Drag Handle */}
          <div className="flex justify-center pb-1 pt-3">
            <div className="drag-handle" aria-hidden="true" />
          </div>

          {/* Profile Header */}
          <div className="px-6 pb-6 pt-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <User size={32} className="text-white/60" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-grotesk text-xl font-medium text-white">
              Guest
            </h2>
            <p className="mt-1 text-sm text-muted">
              Sign in to sync your watchlist across devices
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform active:scale-95">
                <LogIn size={16} aria-hidden="true" />
                Sign In
              </button>
              <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
                <UserPlus size={16} aria-hidden="true" />
                Create Account
              </button>
            </div>
          </div>

          {/* Community Links */}
          <div className="border-t border-white/[0.06] px-6 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Community
            </p>
            <div className="flex gap-3">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.04]"
              >
                <MessageCircle
                  size={16}
                  className="text-[#5865F2]"
                  aria-hidden="true"
                />
                Discord
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.04]"
              >
                <Send size={16} className="text-[#229ED9]" aria-hidden="true" />
                Telegram
              </a>
            </div>
          </div>

          {/* Preferences */}
          <div className="border-t border-white/[0.06] px-6 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
              Preferences
            </p>

            {/* Ambience */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <Palette size={14} className="text-muted" aria-hidden="true" />
                <span className="text-sm text-white/80">Ambience</span>
              </div>
              <div className="flex gap-2" role="radiogroup" aria-label="Ambience intensity">
                {ambienceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSettings({ ambience: option.value })}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                      settings.ambience === option.value
                        ? "bg-white text-black"
                        : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                    }`}
                    role="radio"
                    aria-checked={settings.ambience === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-muted" aria-hidden="true" />
                  <span className="text-sm text-white/80">
                    Spoiler Protection
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateSettings({
                      spoilerProtection: !settings.spoilerProtection,
                    })
                  }
                  className="toggle-switch"
                  data-active={settings.spoilerProtection}
                  aria-label="Toggle spoiler protection"
                >
                  <i aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <Film size={14} className="text-muted" aria-hidden="true" />
                  <span className="text-sm text-white/80">
                    Autoplay Trailers
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateSettings({
                      autoplayTrailers: !settings.autoplayTrailers,
                    })
                  }
                  className="toggle-switch"
                  data-active={settings.autoplayTrailers}
                  aria-label="Toggle autoplay trailers"
                >
                  <i aria-hidden="true" />
                </button>
              </div>

              <button
                onClick={clearSearchHistory}
                disabled={searchHistory.length === 0}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.04] disabled:opacity-40"
              >
                <div className="flex items-center gap-2">
                  <Trash2
                    size={14}
                    className="text-muted"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-white/80">
                    Clear Search History
                  </span>
                </div>
                <span className="text-xs text-muted">
                  {searchHistory.length} items
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.06] px-6 py-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Watchlist</span>
              <span>{watchlist.length} titles</span>
            </div>
            <div className="mt-3 text-center text-[10px] text-white/20">
              7Movies v2.0 · Made with care
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
