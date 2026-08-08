"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle size={36} className="text-red-400" />
      </div>
      <h1 className="mt-6 font-grotesk text-2xl font-medium text-white">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{error.message || "An unexpected error occurred."}</p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
          <RefreshCw size={16} /> Try Again
        </button>
        <Link href="/" className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white">
          Go Home
        </Link>
      </div>
    </main>
  )
}
