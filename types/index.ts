export interface Media {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
  media_type: "movie" | "tv"
  popularity: number
}

export interface Movie extends Media {
  title: string
  release_date: string
  runtime?: number
  tagline?: string
  budget?: number
  revenue?: number
  status?: string
  genres?: Genre[]
  credits?: Credits
  videos?: VideoResponse
  similar?: { results: Media[] }
}

export interface TVShow extends Media {
  name: string
  first_air_date: string
  number_of_seasons?: number
  number_of_episodes?: number
  episode_run_time?: number[]
  tagline?: string
  status?: string
  genres?: Genre[]
  credits?: Credits
  videos?: VideoResponse
  seasons?: Season[]
  similar?: { results: Media[] }
}

export interface Genre {
  id: number
  name: string
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface VideoResponse {
  results: Video[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface Season {
  id: number
  name: string
  season_number: number
  episode_count: number
  poster_path: string | null
  air_date: string
}

export interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  still_path: string | null
  air_date: string
  runtime?: number
  vote_average: number
}

export interface WatchlistItem {
  id: number
  mediaType: "movie" | "tv"
  addedAt: string
}

export type AmbienceTheme = "subtle" | "standard" | "vivid"

export interface AppSettings {
  ambience: AmbienceTheme
  spoilerProtection: boolean
  autoplayTrailers: boolean
}
