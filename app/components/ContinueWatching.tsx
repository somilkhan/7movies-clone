"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Play, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"

interface ContinueItem {
  id: number
  mediaType: "movie" | "tv"
  title: string
  posterPath: string | null
  progress: number
  timestamp: number
}

export function ContinueWatching() {
  const [items, setItems] = useState<ContinueItem[]>([])
  useEffect(() => {
    const stored = localStorage.getItem("7movies-continue")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const sorted = Object.values(parsed as Record<string, ContinueItem>).sort((a: any, b: any) => b.timestamp - a.timestamp).slice(0, 10)
        setItems(sorted)
      } catch { setItems([]) }
    }
  }, [])
  const removeItem = (id: number) => {
    const stored = localStorage.getItem("7movies-continue")
    if (stored) { const parsed = JSON.parse(stored); delete parsed[id]; localStorage.setItem("7movies-continue", JSON.stringify(parsed)); setItems((prev) => prev.filter((i) => i.id !== id)) }
  }
  if (items.length === 0) return null
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="mb-4 font-grotesk text-xl font-medium text-white sm:text-2xl">Continue Watching</h2>
      <div className="scroll-snap-x scrollbar-hide flex gap-3 overflow-x-auto">
        {items.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative flex-shrink-0 scroll-snap-start">
            <Link href={`/watch/${item.id}?type=${item.mediaType}`} className="block w-[200px] sm:w-[240px]">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
                <Image src={getImageUrl(item.posterPath, "w500")} alt={item.title} fill className="object-cover" sizes="240px" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"><Play size={16} fill="white" /></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10"><div className="h-full bg-accent transition-all" style={{ width: `${item.progress}%` }} /></div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <h3 className="truncate text-sm font-medium text-white/90">{item.title}</h3>
                <span className="text-[10px] text-muted">{Math.round(item.progress)}%</span>
              </div>
            </Link>
            <button onClick={(e) => { e.preventDefault(); removeItem(item.id) }}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white/60 opacity-0 transition-opacity hover:bg-black/70 hover:text-white group-hover:opacity-100"><X size={10} /></button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function saveContinueWatching(item: Omit<ContinueItem, "timestamp">) {
  const stored = localStorage.getItem("7movies-continue")
  const data = stored ? JSON.parse(stored) : {}
  data[item.id] = { ...item, timestamp: Date.now() }
  localStorage.setItem("7movies-continue", JSON.stringify(data))
}
