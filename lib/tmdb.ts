import { Media, Movie, TVShow, Season } from "@/types"
import { mockMovies, mockTVShows, mockHeroMedia } from "./mock-data"

const TMDB_BASE = "https://api.themoviedb.org/3"
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "b4a5e072f3a2ec6049ca2748d48b9279"
const USE_MOCK = process.env.NODE_ENV === "development"

async function fetchTMDB<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  if (USE_MOCK) {
    // Return mock data based on endpoint - be specific to avoid matching substrings
    if (endpoint === "/trending/movie/week" || endpoint === "/trending/movie/day") return { results: mockMovies } as T
    if (endpoint === "/movie/popular") return { results: mockMovies.slice(0, 8) } as T
    if (endpoint === "/movie/top_rated") return { results: mockMovies.slice(2, 10) } as T
    if (endpoint === "/movie/now_playing") return { results: mockMovies.slice(4, 12) } as T
    if (endpoint === "/movie/upcoming") return { results: mockMovies.slice(6, 14) } as T
    if (endpoint === "/tv/popular") return { results: mockTVShows } as T
    if (endpoint === "/tv/top_rated") return { results: mockTVShows.slice(1) } as T
    if (endpoint.startsWith("/discover/movie")) return { results: mockMovies.slice(0, 6) } as T
    if (endpoint.startsWith("/discover/tv")) return { results: mockTVShows.slice(0, 4) } as T
    if (endpoint.startsWith("/movie/") && endpoint.split("/").length === 3) return { ...mockHeroMedia, media_type: "movie" } as T
    if (endpoint.startsWith("/tv/") && endpoint.split("/").length === 3) return { ...mockTVShows[0], media_type: "tv" } as T
    return { results: mockMovies } as T
  }

  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set("api_key", TMDB_KEY)
  if (params) {
    Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v) })
  }
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    console.error(`TMDB API error: ${res.status} ${text}`)
    throw new Error(`TMDB ${res.status}: ${text}`)
  }
  return res.json()
}

export const getTrendingMovies = (timeWindow: "day" | "week" = "week", page = "1") =>
  fetchTMDB<{ results: Media[] }>(`/trending/movie/${timeWindow}`, { page })
export const getPopularMovies = (page = "1") =>
  fetchTMDB<{ results: Media[] }>("/movie/popular", { page })
export const getTopRatedMovies = (page = "1") =>
  fetchTMDB<{ results: Media[] }>("/movie/top_rated", { page })
export const getNowPlayingMovies = (page = "1") =>
  fetchTMDB<{ results: Media[] }>("/movie/now_playing", { page })
export const getUpcomingMovies = (page = "1") =>
  fetchTMDB<{ results: Media[] }>("/movie/upcoming", { page })
export const getMovieDetails = (id: string) =>
  fetchTMDB<Movie>(`/movie/${id}`, { append_to_response: "credits,videos,similar,images" })
export const getTrendingTV = (timeWindow: "day" | "week" = "week", page = "1") =>
  fetchTMDB<{ results: Media[] }>(`/trending/tv/${timeWindow}`, { page })
export const getPopularTV = (page = "1") =>
  fetchTMDB<{ results: Media[] }>("/tv/popular", { page })
export const getTopRatedTV = (page = "1") =>
  fetchTMDB<{ results: Media[] }>("/tv/top_rated", { page })
export const getTVDetails = (id: string) =>
  fetchTMDB<TVShow>(`/tv/${id}`, { append_to_response: "credits,videos,similar,images" })
export const getSeasonDetails = (tvId: string, seasonNumber: string) =>
  fetchTMDB<Season>(`/tv/${tvId}/season/${seasonNumber}`)
export const searchMulti = (query: string, page = "1") =>
  fetchTMDB<{ results: Media[] }>("/search/multi", { query, page, include_adult: "false" })
export const discoverMovies = (genreId: string, page = "1") =>
  fetchTMDB<{ results: Media[] }>("/discover/movie", { with_genres: genreId, sort_by: "popularity.desc", page })
export const discoverTV = (genreId: string, page = "1") =>
  fetchTMDB<{ results: Media[] }>("/discover/tv", { with_genres: genreId, sort_by: "popularity.desc", page })
export const getMovieGenres = () =>
  fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/movie/list")
export const getTVGenres = () =>
  fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/tv/list")
export const getAnime = (page = "1") =>
  fetchTMDB<{ results: Media[] }>("/discover/movie", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page })
