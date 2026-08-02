"use client"

import { useTrending } from "@/lib/hooks/useTMDB"
import { ContentSection } from "@/app/components/ContentSection"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/app/components/ReducedMotionProvider"

export default function TVPage() {
  const { data: trendingData } = useTrending()
  const prefersReducedMotion = useReducedMotion()

  const trendingTV = trendingData?.results?.filter((m: any) => m.media_type === "tv").slice(0, 12) || []

  return (
    <motion.main className="pt-6 pb-28" initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="px-5 mb-6">
        <h1 className="text-2xl font-bold text-white">TV Shows</h1>
        <p className="mt-1 text-sm text-white/40">Binge-worthy series and more</p>
      </div>
      <ContentSection title="Trending TV" items={trendingTV} />
    </motion.main>
  )
}
