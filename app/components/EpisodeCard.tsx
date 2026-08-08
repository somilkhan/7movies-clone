"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Play, Clock, EyeOff } from "lucide-react"
import { Episode } from "@/types"
import { getImageUrl, formatRuntime } from "@/lib/utils"
import { useAppStore } from "@/stores/useAppStore"
import { useState } from "react"

interface EpisodeCardProps {
  episode: Episode
  index: number
}

export function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const { settings } = useAppStore()
  const [revealed, setRevealed] = useState(false)
  const isSpoilerProtected = settings.spoilerProtection && episode.episode_number > 1
  const shouldBlur = isSpoilerProtected && !revealed

  const toggleReveal = () => setRevealed(true)

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex gap-4 rounded-xl bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
      <div className="relative aspect-video w-[140px] flex-shrink-0 overflow-hidden rounded-lg sm:w-[180px]">
        <Image src={getImageUrl(episode.still_path, "w500")} alt={shouldBlur ? "Spoiler protected still" : `${episode.name} still`}
          fill className={`object-cover transition-all duration-300 group-hover:scale-105 ${shouldBlur ? "blur-[8px] brightness-50" : ""}`} sizes="180px" />
        {shouldBlur && (
          <button onClick={toggleReveal} onKeyDown={(e) => e.key === "Enter" && toggleReveal()}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-colors hover:bg-black/30"
            role="button" aria-label="Reveal spoiler" tabIndex={0}>
            <EyeOff size={20} className="text-white/60" aria-hidden="true" /><span className="mt-1 text-[10px] text-white/50">Tap to reveal</span>
          </button>
        )}
        {!shouldBlur && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"><Play size={14} fill="white" className="text-white" aria-hidden="true" /></div>
          </div>
        )}
        {episode.runtime && !shouldBlur && (
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[10px] text-white/80"><Clock size={8} aria-hidden="true" />{formatRuntime(episode.runtime)}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center py-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted">E{String(episode.episode_number).padStart(2, "0")}</span>
          <h4 className={`text-sm font-medium ${shouldBlur ? "blur-[4px] select-none" : "text-white/90"}`}>{shouldBlur ? "Episode title hidden" : episode.name}</h4>
        </div>
        <p className={`mt-1 line-clamp-2 text-xs leading-relaxed ${shouldBlur ? "blur-[3px] select-none" : "text-white/40"}`}>
          {shouldBlur ? "Overview hidden to avoid spoilers. Tap the image to reveal." : (episode.overview || "No description available.")}
        </p>
        {episode.air_date && !shouldBlur && <p className="mt-1.5 text-[10px] text-muted">{new Date(episode.air_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>}
      </div>
    </motion.div>
  )
}
