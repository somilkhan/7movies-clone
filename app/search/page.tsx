"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, X, Loader2 } from "lucide-react"
import { useSearch } from "@/lib/hooks/useTMDB"
import { MediaCard } from "@/app/components/MediaCard"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => { const timer = setTimeout(() => setDebouncedQuery(query), 300); return () => clearTimeout(timer) }, [query])
  const { data, isLoading, error } = useSearch(debouncedQuery)
  const results = data?.results?.filter((r: any) => r.media_type === "movie" || r.media_type === "tv") || []

  if (!query) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <Search size={32} className="text-muted" />
        <h2 className="mt-4 font-grotesk text-xl font-medium text-white">Search for something</h2>
        <p className="mt-2 text-sm text-muted">Find movies, TV shows, and anime.</p>
      </div>
    )
  }
  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 size={28} className="animate-spin text-muted" /></div>
  if (error) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <X size={32} className="text-red-400" /><h2 className="mt-4 font-grotesk text-xl font-medium text-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">{(error as Error).message}</p>
    </div>
  )
  if (results.length === 0) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <Search size={32} className="text-muted" /><h2 className="mt-4 font-grotesk text-xl font-medium text-white">No results found</h2>
      <p className="mt-2 text-sm text-muted">Try a different search term.</p>
    </div>
  )
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-grotesk text-xl font-medium text-white sm:text-2xl">Results for &ldquo;{query}&rdquo;</h1>
      <p className="mt-1 text-sm text-muted">{results.length} found</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {results.map((media: any, index: number) => (
          <motion.div key={media.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}>
            <MediaCard media={media} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="pt-4">
      <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><Loader2 size={28} className="animate-spin text-muted" /></div>}>
        <SearchResults />
      </Suspense>
    </main>
  )
}
