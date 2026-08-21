"use client"

import { useEffect } from "react"
import { X, Monitor, MessageCircle, Send, Cloud, CloudOff } from "lucide-react"
import { useAppStore } from "@/stores/useAppStore"
import { useSupabaseSession } from "./SupabaseSessionProvider"

export default function AccountDialog({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings, watchlist, clearSearchHistory } = useAppStore()
  const { user, ready } = useSupabaseSession()

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [onClose])

  const cloudActive = ready && Boolean(user)

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog account-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="account-dialog-topline">
          <h2>Profile</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <p className="account-dialog-sub">Your preferences and synced activity</p>

        <div className="px-5 pb-2">
          <div className="flex items-center gap-3 mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              {cloudActive ? <Cloud size={18} className="text-accent" /> : <CloudOff size={18} className="text-muted" />}
            </div>
            <div className="min-w-0">
              <strong className="text-sm text-white block">{cloudActive ? "Cloud sync active" : ready ? "Local mode" : "Connecting…"}</strong>
              <small className="text-[10px] text-muted font-mono">
                {cloudActive ? "Watchlist & Continue Watching sync automatically" : "Your local data remains available"}
              </small>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-row-label">Ambience</div>
              <div className="settings-row-desc">Background glow intensity</div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {(["standard", "dark", "midnight", "warm"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateSettings({ ambience: a })}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-grotesk border ${settings.ambience === a ? "bg-paper text-black border-paper" : "border-white/14 text-aaa bg-transparent"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-row-label">Spoiler Protection</div>
              <div className="settings-row-desc">Blur episode details</div>
            </div>
            <button type="button" className={`toggle-track ${settings.spoilerProtection ? "active" : ""}`} onClick={() => updateSettings({ spoilerProtection: !settings.spoilerProtection })} aria-label="Toggle spoiler protection">
              <span className="toggle-thumb" />
            </button>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-row-label">Autoplay Trailers</div>
              <div className="settings-row-desc">Auto-play on hover</div>
            </div>
            <button type="button" className={`toggle-track ${settings.autoplayTrailers ? "active" : ""}`} onClick={() => updateSettings({ autoplayTrailers: !settings.autoplayTrailers })} aria-label="Toggle autoplay trailers">
              <span className="toggle-thumb" />
            </button>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-row-label">Clear Search History</div>
              <div className="settings-row-desc">Remove all past searches</div>
            </div>
            <button type="button" onClick={clearSearchHistory} className="text-[11px] text-muted hover:text-white transition-colors">
              Clear
            </button>
          </div>

          <div className="flex gap-3 mt-4 mb-2">
            <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5865F2]/15 text-[#5865F2] text-[11px] font-grotesk">
              <MessageCircle size={14} /> Discord
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#229ED9]/15 text-[#229ED9] text-[11px] font-grotesk">
              <Send size={14} /> Telegram
            </a>
          </div>
        </div>

        <div className="account-footer">
          <span>{watchlist.length} in watchlist</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  )
}
