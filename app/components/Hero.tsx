"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Info, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"
import { Media } from "@/types"
import { getImageUrl } from "@/lib/utils"

interface HeroProps {
  media: Media | null
  onInfoClick?: () => void
}

export function Hero({ media, onInfoClick }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true)

  const title = media?.title || media?.name || "Untitled"
  const href = media?.media_type === "tv" || (media as any)?.first_air_date
    ? `/tv/${media?.id}`
    : `/movie/${media?.id}`

  const year = media?.release_date
    ? new Date(media.release_date).getFullYear()
    : media?.first_air_date
    ? new Date(media.first_air_date).getFullYear()
    : null

  const match = media?.vote_average
    ? Math.round((media.vote_average / 10) * 100)
    : null

  return (
    <section className="hero">
      <div className="hero-media">
        {media?.backdrop_path && (
          <Image
            src={getImageUrl(media.backdrop_path, "w1280")}
            alt=""
            fill
            className="hero-media-image"
            priority
            sizes="100vw"
          />
        )}
        <div className="hero-video-shade" />
        <div className="hero-fade" />
      </div>
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          <span>CURATED FOR TONIGHT</span>
        </div>
        <div className="hero-logo">
          {media?.logo_path ? (
            <img src={getImageUrl(media.logo_path, "w500")} alt={title} />
          ) : (
            <h1>{title}</h1>
          )}
        </div>

        <div className="hero-meta">
          {match !== null && <span className="match">{match}% Match</span>}
          {year && <span>{year}</span>}
          {media?.vote_average !== undefined && <span>★ {media.vote_average.toFixed(1)}</span>}
          <span className="trending">Trending</span>
        </div>

        {media?.overview && (
          <p className="hero-description">{media.overview}</p>
        )}

        <div className="hero-buttons">
          <Link href={`${href}?autoplay=1`} className="primary-btn">
            <Play size={17} fill="currentColor" strokeWidth={2} />
            Watch now
          </Link>
          <button type="button" className="secondary-btn" onClick={onInfoClick}>
            <Info size={17} strokeWidth={2} />
            Info
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={17} strokeWidth={2} /> : <Volume2 size={17} strokeWidth={2} />}
          </button>
        </div>
      </div>
      <button
        type="button"
        className="scroll-cue"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.75, behavior: "smooth" })}
        aria-label="Scroll down"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </section>
  )
}
