import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { DetailHero } from "@/app/components/DetailHero"
import { ContentSection } from "@/app/components/ContentSection"
import { EpisodeCard } from "@/app/components/EpisodeCard"
import { getTVDetails, getSeasonDetails } from "@/lib/tmdb"
import { getImageUrl } from "@/lib/utils"
import Image from "next/image"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const show = await getTVDetails(params.id)
    const title = show.name || "TV Show"
    const description = show.overview
      ? show.overview.slice(0, 160) + (show.overview.length > 160 ? "..." : "")
      : `Watch ${title} on 7Movies.`
    const image = show.backdrop_path
      ? getImageUrl(show.backdrop_path, "w1280")
      : show.poster_path
      ? getImageUrl(show.poster_path, "w500")
      : undefined

    return {
      title: `${title} — 7Movies`,
      description,
      openGraph: {
        title: `${title} — 7Movies`,
        description,
        images: image ? [image] : undefined,
        type: "video.tv_show",
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
      title: "TV Show — 7Movies",
      description: "TV show details",
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

export default async function TVPage({ params }: { params: { id: string } }) {
  let show
  try {
    show = await getTVDetails(params.id)
  } catch {
    notFound()
  }

  const cast = show.credits?.cast?.slice(0, 10) || []
  const similar = show.similar?.results?.slice(0, 12) || []

  // Get first season episodes
  let episodes = []
  if (show.seasons && show.seasons.length > 0) {
    const firstSeason = show.seasons.find((s) => s.season_number > 0) || show.seasons[0]
    if (firstSeason) {
      try {
        const seasonData = await getSeasonDetails(params.id, String(firstSeason.season_number))
        episodes = seasonData.episodes || []
      } catch {
        episodes = []
      }
    }
  }

  return (
    <main>
      <DetailHero media={show} mediaType="tv" />

      {/* Episodes */}
      {episodes.length > 0 && (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="mb-4 font-grotesk text-xl font-medium text-white">
            Season 1
          </h2>
          <div className="mx-auto max-w-3xl space-y-2">
            {episodes.map((ep, i) => (
              <EpisodeCard key={ep.id} episode={ep} index={i} />
            ))}
          </div>
        </section>
      )}

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
