"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Tv, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.03]"
      >
        <Tv size={36} className="text-muted" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 font-grotesk text-2xl font-medium text-white sm:text-3xl"
      >
        Couldn&apos;t load this show
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-2 max-w-sm text-sm text-muted"
      >
        {error.message || "The TV show details couldn't be fetched. It may have been removed or the service is temporarily unavailable."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
        >
          <Home size={16} />
          Go Home
        </Link>
      </motion.div>
    </main>
  )
}
