import { Media, Movie, TVShow, Season, Episode } from "@/types"

const TMDB_BASE = "https://api.themoviedb.org/3"
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN || ""

async function fetchTMDB<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// Movies
export async function getTrendingMovies(timeWindow: "day" | "week" = "week", page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    `/trending/movie/${timeWindow}`,
    { page }
  )
}

export async function getPopularMovies(page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/movie/popular",
    { page }
  )
}

export async function getTopRatedMovies(page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/movie/top_rated",
    { page }
  )
}

export async function getNowPlayingMovies(page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/movie/now_playing",
    { page }
  )
}

export async function getUpcomingMovies(page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/movie/upcoming",
    { page }
  )
}

export async function getMovieDetails(id: string): Promise<Movie> {
  return fetchTMDB<Movie>(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
  })
}

// TV Shows
export async function getTrendingTV(timeWindow: "day" | "week" = "week", page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    `/trending/tv/${timeWindow}`,
    { page }
  )
}

export async function getPopularTV(page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/tv/popular",
    { page }
  )
}

export async function getTopRatedTV(page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/tv/top_rated",
    { page }
  )
}

export async function getTVDetails(id: string): Promise<TVShow> {
  return fetchTMDB<TVShow>(`/tv/${id}`, {
    append_to_response: "credits,videos,similar",
  })
}

export async function getSeasonDetails(tvId: string, seasonNumber: string): Promise<Season & { episodes: Episode[] }> {
  return fetchTMDB<Season & { episodes: Episode[] }>(`/tv/${tvId}/season/${seasonNumber}`)
}

// Search
export async function searchMulti(query: string, page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number; total_results: number }>(
    "/search/multi",
    { query, page }
  )
}

// Genres
export async function getMovieGenres() {
  return fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/movie/list")
}

export async function getTVGenres() {
  return fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/tv/list")
}

// Discover
export async function discoverMovies(params: Record<string, string>) {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/discover/movie",
    params
  )
}

// Anime (using discover with animation genre)
export async function getAnime(page = "1") {
  return fetchTMDB<{ results: Media[]; page: number; total_pages: number }>(
    "/discover/tv",
    {
      page,
      with_genres: "16",
      with_origin_country: "JP",
      sort_by: "popularity.desc",
    }
  )
}
