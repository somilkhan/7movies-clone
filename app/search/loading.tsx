export default function Loading() {
  return (
    <main className="pt-4">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-7 w-64 rounded bg-white/[0.05] skeleton" />
        <div className="mt-1 h-4 w-24 rounded bg-white/[0.05] skeleton" />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] w-full rounded-card bg-white/[0.05] skeleton"
            />
          ))}
        </div>
      </div>
    </main>
  )
}
