export default function Loading() {
  return (
    <main>
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 skeleton" />
      </div>

      <div className="relative -mt-32 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl gap-6">
          <div className="hidden flex-shrink-0 sm:block">
            <div className="aspect-[2/3] w-[160px] rounded-card bg-white/[0.05] skeleton md:w-[200px]" />
          </div>
          <div className="flex-1 pt-4">
            <div className="h-10 w-3/4 rounded bg-white/[0.05] skeleton sm:h-12 md:h-16" />
            <div className="mt-3 h-4 w-1/2 rounded bg-white/[0.05] skeleton" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/[0.05] skeleton" />
            <div className="mt-2 h-4 w-2/3 max-w-2xl rounded bg-white/[0.05] skeleton" />
            <div className="mt-6 flex gap-3">
              <div className="h-11 w-32 rounded-full bg-white/[0.05] skeleton" />
              <div className="h-11 w-36 rounded-full bg-white/[0.05] skeleton" />
            </div>
          </div>
        </div>
      </div>

      {/* Cast skeleton */}
      <section className="py-8">
        <div className="mb-4 h-6 w-16 rounded bg-white/[0.05] skeleton px-4 sm:px-6 lg:px-8" />
        <div className="flex gap-3 px-4 sm:px-6 lg:px-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className="aspect-square w-[72px] rounded-full bg-white/[0.05] skeleton sm:w-[80px]" />
              <div className="mx-auto mt-2 h-3 w-16 rounded bg-white/[0.05] skeleton" />
            </div>
          ))}
        </div>
      </section>

      {/* Similar skeleton */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
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
    </main>
  )
}
