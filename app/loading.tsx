export default function Loading() {
  return (
    <main>
      <div className="relative h-[790px] min-h-[720px] w-full overflow-hidden">
        <div className="absolute inset-0 skeleton" />
        <div className="absolute inset-0 flex flex-col justify-end px-[9vw] pb-[122px]">
          <div className="h-5 w-20 rounded bg-white/[0.05] skeleton mb-5" />
          <div className="h-24 w-3/4 rounded bg-white/[0.05] skeleton mb-6" />
          <div className="h-4 w-full max-w-md rounded bg-white/[0.05] skeleton mb-2" />
          <div className="h-4 w-2/3 max-w-md rounded bg-white/[0.05] skeleton mb-6" />
          <div className="flex gap-3">
            <div className="h-11 w-32 rounded-[5px] bg-white/[0.05] skeleton" />
            <div className="h-11 w-32 rounded-[5px] bg-white/[0.05] skeleton" />
          </div>
        </div>
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="content py-6">
          <div className="mb-4 h-5 w-40 rounded bg-white/[0.05] skeleton" />
          <div className="flex gap-3">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="aspect-[2/3] w-[173px] flex-shrink-0 rounded-xl bg-white/[0.05] skeleton" />
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
