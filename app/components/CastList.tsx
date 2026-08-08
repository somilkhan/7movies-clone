"use client"

import Image from "next/image"
import { CastMember } from "@/types"

interface CastListProps {
  cast: CastMember[]
}

export function CastList({ cast }: CastListProps) {
  const topCast = cast.slice(0, 12)

  return (
    <section className="px-5 py-6" aria-label="Cast">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-lg font-bold text-white">Cast</h2>
        <div className="content-scroll -mx-5 px-5">
          {topCast.map((member) => (
            <div
              key={member.id}
              className="scroll-snap-start flex w-[90px] flex-shrink-0 flex-col items-center text-center"
            >
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-surface">
                {member.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs font-medium text-white line-clamp-1">
                {member.name}
              </p>
              <p className="text-[10px] text-muted line-clamp-1">
                {member.character}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
