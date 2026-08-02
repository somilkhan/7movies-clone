export default function Loading() {
  return (
    <main>
      {/* Hero skeleton */}
      <div className="relative h-[85vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 skeleton" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-3 h-5 w-20 rounded bg-white/[0.05] skeleton" />
            <div className="h-16 w-3/4 rounded bg-white/[0.05] skeleton sm:h-20 md:h-24 lg:h-32" />
            <div className="mt-4 h-4 w-full max-w-lg rounded bg-white/[0.05] skeleton" />
            <div className="mt-2 h-4 w-2/3 max-w-lg rounded bg-white/[0.05] skeleton" />
            <div className="mt-6 flex gap-3">
              <div className="h-11 w-32 rounded-full bg-white/[0.05] skeleton" />
              <div className="h-11 w-32 rounded-full bg-white/[0.05] skeleton" />
            </div>
          </div>
        </div>
      </div>

      {[...Array(6)].map((_, i) => (
        <div key={i} className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-4 h-7 w-40 rounded bg-white/[0.05] skeleton" />
          <div className="flex gap-3">
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="aspect-[2/3] w-[140px] sm:w-[160px] flex-shrink-0 rounded-card bg-white/[0.05] skeleton"
              />
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
