import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { DetailHero } from "@/app/components/DetailHero"
import { ContentSection } from "@/app/components/ContentSection"
import { getMovieDetails } from "@/lib/tmdb"
import { getImageUrl } from "@/lib/utils"
import Image from "next/image"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(params.id)
    const title = movie.title || "Movie"
    const description = movie.overview
      ? movie.overview.slice(0, 160) + (movie.overview.length > 160 ? "..." : "")
      : `Watch ${title} on 7Movies.`
    const image = movie.backdrop_path
      ? getImageUrl(movie.backdrop_path, "w1280")
      : movie.poster_path
      ? getImageUrl(movie.poster_path, "w500")
      : undefined

    return {
      title: `${title} — 7Movies`,
      description,
      openGraph: {
        title: `${title} — 7Movies`,
        description,
        images: image ? [image] : undefined,
        type: "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} — 7Movies`,
        description,
        images: image ? [image] : undefined,
      },
    }
  } catch {
    return {
      title: "Movie — 7Movies",
      description: "Movie details",
    }
  }
}

function CastSkeleton() {
  return (
    <div className="flex gap-3 px-4 sm:px-6 lg:px-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <div className="aspect-square w-[80px] rounded-full bg-white/[0.05] skeleton" />
          <div className="mt-2 h-3 w-16 rounded bg-white/[0.05] skeleton" />
        </div>
      ))}
    </div>
  )
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  let movie
  try {
    movie = await getMovieDetails(params.id)
  } catch {
    notFound()
  }

  const cast = movie.credits?.cast?.slice(0, 10) || []
  const similar = movie.similar?.results?.slice(0, 12) || []

  return (
    <main>
      <DetailHero media={movie} mediaType="movie" />

      {/* Cast */}
      {cast.length > 0 && (
        <section className="py-8">
          <h2 className="mb-4 px-4 font-grotesk text-xl font-medium text-white sm:px-6 lg:px-8">Cast</h2>
          <Suspense fallback={<CastSkeleton />}>
            <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide sm:px-6 lg:px-8">
              {cast.map((member) => (
                <div key={member.id} className="flex-shrink-0 text-center">
                  <div className="relative mx-auto aspect-square w-[72px] overflow-hidden rounded-full bg-surface sm:w-[80px]">
                    {member.profile_path ? (
                      <Image
                        src={getImageUrl(member.profile_path, "w500")}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted">
                        <span className="text-lg">?</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 max-w-[80px] truncate text-xs font-medium text-white/80">{member.name}</p>
                  <p className="max-w-[80px] truncate text-[10px] text-muted">{member.character}</p>
                </div>
              ))}
            </div>
          </Suspense>
        </section>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <ContentSection title="More Like This" media={similar} className="pb-12" />
      )}
    </main>
  )
}
