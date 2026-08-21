import type { Media, Movie, TVShow, Season } from "@/types"

const TMDB_PROXY = "/api/tmdb"

type TMDBParams = Record<string, string>

async function fetchTMDB<T>(path: string, params?: TMDBParams): Promise<T> {
  const query = new URLSearchParams({ path, ...(params ?? {}) })
  const res = await fetch(`${TMDB_PROXY}?${query.toString()}`)

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`TMDB ${res.status}: ${text || res.statusText}`)
  }

  return res.json() as Promise<T>
}

export const getTrendingMovies = (timeWindow: "day" | "week" = "week", page = "1") => fetchTMDB<{ results: Media[] }>(`/trending/movie/${timeWindow}`, { page })
export const getPopularMovies = (page = "1") => fetchTMDB<{ results: Media[] }>("/movie/popular", { page })
export const getTopRatedMovies = (page = "1") => fetchTMDB<{ results: Media[] }>("/movie/top_rated", { page })
export const getNowPlayingMovies = (page = "1") => fetchTMDB<{ results: Media[] }>("/movie/now_playing", { page })
export const getUpcomingMovies = (page = "1") => fetchTMDB<{ results: Media[] }>("/movie/upcoming", { page })
export const getMovieDetails = (id: string) => fetchTMDB<Movie>(`/movie/${id}`, { append_to_response: "credits,videos,similar,images" })
export const getTrendingTV = (timeWindow: "day" | "week" = "week", page = "1") => fetchTMDB<{ results: Media[] }>(`/trending/tv/${timeWindow}`, { page })
export const getPopularTV = (page = "1") => fetchTMDB<{ results: Media[] }>("/tv/popular", { page })
export const getTopRatedTV = (page = "1") => fetchTMDB<{ results: Media[] }>("/tv/top_rated", { page })
export const getTVDetails = (id: string) => fetchTMDB<TVShow>(`/tv/${id}`, { append_to_response: "credits,videos,similar,images" })
export const getSeasonDetails = (tvId: string, seasonNumber: string) => fetchTMDB<Season>(`/tv/${tvId}/season/${seasonNumber}`)
export const searchMulti = (query: string, page = "1") => fetchTMDB<{ results: Media[] }>("/search/multi", { query, page, include_adult: "false" })
export const discoverMovies = (genreId: string, page = "1") => fetchTMDB<{ results: Media[] }>("/discover/movie", { with_genres: genreId, sort_by: "popularity.desc", page })
export const discoverTV = (genreId: string, page = "1") => fetchTMDB<{ results: Media[] }>("/discover/tv", { with_genres: genreId, sort_by: "popularity.desc", page })
export const getMovieGenres = () => fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/movie/list")
export const getTVGenres = () => fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/tv/list")
export const getAnime = (page = "1") => fetchTMDB<{ results: Media[] }>("/discover/movie", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page })
