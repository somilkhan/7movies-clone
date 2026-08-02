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
  if (!items?.length) return null

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}
      className="px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {showScrollIndicator && (
          <span className="text-xs font-medium uppercase tracking-wider text-white/40">Scroll to explore &gt;</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item, i) => (
          <MediaCard key={item.id} media={item} index={i} variant="grid" />
        ))}
      </div>
    </motion.section>
  )
}
