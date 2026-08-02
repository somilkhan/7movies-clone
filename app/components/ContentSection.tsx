"use client"

import { Media } from "@/types"
import { MediaCard } from "./MediaCard"
import { motion } from "framer-motion"

interface ContentSectionProps {
  title: string
  items: Media[]
  showScrollIndicator?: boolean
}

export function ContentSection({ title, items, showScrollIndicator = true }: ContentSectionProps) {
  if (!items?.length) {
    // Show skeleton when empty to prevent layout shift
    return (
      <section className="px-5 py-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {showScrollIndicator && (
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">Scroll to explore &gt;</span>
          )}
        </div>
        <div className="content-scroll -mx-5 px-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="scroll-snap-start w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px]">
              <div className="aspect-[2/3] animate-pulse rounded-xl bg-white/[0.04]" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
              <div className="mt-1 h-2 w-12 animate-pulse rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-5"
    >
      <div className="mb-3 flex items-center justify-between px-5">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {showScrollIndicator && (
          <span className="text-xs font-medium uppercase tracking-wider text-white/40">Scroll to explore &gt;</span>
        )}
      </div>
      <div className="content-scroll -mx-5 px-5">
        {items.map((item, i) => (
          <div key={item.id} className="scroll-snap-start w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px]">
            <MediaCard media={item} index={i} variant="poster" />
          </div>
        ))}
      </div>
    </motion.section>
  )
}
