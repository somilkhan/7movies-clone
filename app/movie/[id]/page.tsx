"use client"

import { useParams, useRouter } from "next/navigation"
import { useMovie, useCredits, useSimilar, useMovieVideos } from "@/lib/hooks/useTMDB"
import { DetailHero } from "@/app/components/DetailHero"
import { ContentSection } from "@/app/components/ContentSection"
import { CastList } from "@/app/components/CastList"
import { EpisodeCard } from "@/app/components/EpisodeCard"
import { ContinueWatching } from "@/app/components/ContinueWatching"
import { motion } from "framer-motion"
import { X, Server, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useReducedMotion } from "@/app/components/ReducedMotionProvider"

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const { data: movie, isLoading } = useMovie(id)
  const { data: credits } = useCredits(id, "movie")
  const { data: similar } = useSimilar(id, "movie")
  const { data: videos } = useMovieVideos(id)
  const prefersReducedMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!movie) return <div className="p-8 text-white">Movie not found</div>

  const trailerKey = videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")?.key

  return (
    <main className="min-h-screen">
      {/* Close button */}
      <motion.button initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => router.push("/")}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
        aria-label="Close">
        <X size={20} aria-hidden="true" />
      </motion.button>

      <DetailHero media={movie} mediaType="movie" />

      {/* Server selector */}
      <section className="px-5 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <Server size={16} className="text-white/40" aria-hidden="true" />
            <span className="text-sm text-white/70">VidRift</span>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400">stable</span>
            <span className="text-[10px] text-white/30">· fast</span>
            <div className="ml-auto flex gap-2">
              <button className="flex h-8 items-center gap-1.5 rounded-lg bg-white/5 px-3 text-xs text-white/60 hover:bg-white/10" aria-label="Download">
                <Download size={14} aria-hidden="true" /> Download
              </button>
              <button className="flex h-8 items-center gap-1.5 rounded-lg bg-white/5 px-3 text-xs text-white/60 hover:bg-white/10" aria-label="Share">
                <Share2 size={14} aria-hidden="true" /> Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stream prep */}
      <section className="px-5 pb-4">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Preparing your stream</p>
            <div className="mx-auto mt-2 h-1 w-32 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full bg-white/40 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Cast */}
      {credits?.cast?.length > 0 && <CastList cast={credits.cast} />}

      {/* More Like This */}
      {similar?.results?.length > 0 && (
        <section className="px-5 py-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-4 text-lg font-bold text-white">More Like This</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {similar.results.slice(0, 8).map((item: any, i: number) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/movie/${item.id}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface">
                      <img src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-2">
                      <h3 className="truncate text-sm font-semibold text-white">{item.title}</h3>
                      <p className="text-xs text-white/50">{item.release_date ? new Date(item.release_date).getFullYear() : "N/A"}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContinueWatching />
    </main>
  )
}
