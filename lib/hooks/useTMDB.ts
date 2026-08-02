"use client"

import { useQuery } from "@tanstack/react-query"
import {
  getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies,
  getTrendingTV, getPopularTV, getTopRatedTV, getMovieDetails, getTVDetails, getSeasonDetails,
  searchMulti, getAnime, discoverMovies, getMovieGenres, getTVGenres,
} from "@/lib/tmdb"
import { Media, Movie, TVShow, Season, Episode } from "@/types"

// ── Movie list hooks ──
export function useTrendingMovies(timeWindow: "day" | "week" = "week") {
  return useQuery({ queryKey: ["trendingMovies", timeWindow], queryFn: () => getTrendingMovies(timeWindow) })
}
export function usePopularMovies() {
  return useQuery({ queryKey: ["popularMovies"], queryFn: getPopularMovies })
}
export function useTopRatedMovies() {
  return useQuery({ queryKey: ["topRatedMovies"], queryFn: getTopRatedMovies })
}
export function useNowPlayingMovies() {
  return useQuery({ queryKey: ["nowPlayingMovies"], queryFn: getNowPlayingMovies })
}
export function useUpcomingMovies() {
  return useQuery({ queryKey: ["upcomingMovies"], queryFn: getUpcomingMovies })
}

// ── TV list hooks ──
export function useTrendingTV(timeWindow: "day" | "week" = "week") {
  return useQuery({ queryKey: ["trendingTV", timeWindow], queryFn: () => getTrendingTV(timeWindow) })
}
export function usePopularTV() {
  return useQuery({ queryKey: ["popularTV"], queryFn: getPopularTV })
}
export function useTopRatedTV() {
  return useQuery({ queryKey: ["topRatedTV"], queryFn: getTopRatedTV })
}

// ── Detail hooks ──
export function useMovieDetails(id: string) {
  return useQuery<Movie>({ queryKey: ["movie", id], queryFn: () => getMovieDetails(id), enabled: !!id })
}
export function useTVDetails(id: string) {
  return useQuery<TVShow>({ queryKey: ["tv", id], queryFn: () => getTVDetails(id), enabled: !!id })
}
export function useSeasonDetails(tvId: string, seasonNumber: string) {
  return useQuery<Season & { episodes: Episode[] }>({
    queryKey: ["tv", tvId, "season", seasonNumber],
    queryFn: () => getSeasonDetails(tvId, seasonNumber),
    enabled: !!tvId && !!seasonNumber,
  })
}

// ── Aliases (pages import these names) ──
export function useTrending(timeWindow: "day" | "week" = "week") {
  return useTrendingMovies(timeWindow)
}
export function usePopular() {
  return usePopularMovies()
}
export function useTopRated() {
  return useTopRatedMovies()
}
export function useNowPlaying() {
  return useNowPlayingMovies()
}
export function useMovie(id: number) {
  return useMovieDetails(String(id))
}
export function useTVShow(id: number) {
  return useTVDetails(String(id))
}
export function useSeasonEpisodes(tvId: number, seasonNumber: number) {
  return useSeasonDetails(String(tvId), String(seasonNumber))
}

// ── Embedded data selectors (share cache with detail hooks) ──
export function useCredits(id: number, mediaType: "movie" | "tv") {
  const key = mediaType === "movie" ? "movie" : "tv"
  return useQuery({
    queryKey: [key, String(id)],
    queryFn: () => (mediaType === "movie" ? getMovieDetails(String(id)) : getTVDetails(String(id))),
    enabled: !!id,
    select: (data: Movie | TVShow) => data.credits,
  })
}

export function useSimilar(id: number, mediaType: "movie" | "tv") {
  const key = mediaType === "movie" ? "movie" : "tv"
  return useQuery({
    queryKey: [key, String(id)],
    queryFn: () => (mediaType === "movie" ? getMovieDetails(String(id)) : getTVDetails(String(id))),
    enabled: !!id,
    select: (data: Movie | TVShow) => data.similar,
  })
}

export function useMovieVideos(id: number) {
  return useQuery({
    queryKey: ["movie", String(id)],
    queryFn: () => getMovieDetails(String(id)),
    enabled: !!id,
    select: (data: Movie) => data.videos,
  })
}

export function useTVVideos(id: number) {
  return useQuery({
    queryKey: ["tv", String(id)],
    queryFn: () => getTVDetails(String(id)),
    enabled: !!id,
    select: (data: TVShow) => data.videos,
  })
}

// ── Discover / genre hooks ──
export function useMovies(params: Record<string, string>) {
  return useQuery({
    queryKey: ["discover", params],
    queryFn: () => discoverMovies(params),
  })
}

export function useDiscoverByGenre(genreId: string, page = "1") {
  return useQuery({
    queryKey: ["discover", genreId, page],
    queryFn: () => discoverMovies({ with_genres: genreId, page, sort_by: "popularity.desc" }),
    enabled: !!genreId,
  })
}

// ── Search & genres ──
export function useSearch(query: string) {
  return useQuery({ queryKey: ["search", query], queryFn: () => searchMulti(query), enabled: query.length > 0 })
}
export function useMovieGenres() {
  return useQuery({ queryKey: ["movieGenres"], queryFn: getMovieGenres })
}
export function useTVGenres() {
  return useQuery({ queryKey: ["tvGenres"], queryFn: getTVGenres })
}

// ── Anime ──
export function useAnime() {
  return useQuery({ queryKey: ["anime"], queryFn: getAnime })
}
