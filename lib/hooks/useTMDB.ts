"use client"

import { useQuery } from "@tanstack/react-query"
import {
  getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies,
  getTrendingTV, getPopularTV, getTopRatedTV, getMovieDetails, getTVDetails, getSeasonDetails,
  searchMulti, getAnime, discoverMovies, getMovieGenres, getTVGenres,
} from "@/lib/tmdb"
import { Media, Movie, TVShow, Season, Episode } from "@/types"

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
export function useTrendingTV(timeWindow: "day" | "week" = "week") {
  return useQuery({ queryKey: ["trendingTV", timeWindow], queryFn: () => getTrendingTV(timeWindow) })
}
export function usePopularTV() {
  return useQuery({ queryKey: ["popularTV"], queryFn: getPopularTV })
}
export function useTopRatedTV() {
  return useQuery({ queryKey: ["topRatedTV"], queryFn: getTopRatedTV })
}
export function useAnime() {
  return useQuery({ queryKey: ["anime"], queryFn: getAnime })
}
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
export function useSearch(query: string) {
  return useQuery({ queryKey: ["search", query], queryFn: () => searchMulti(query), enabled: query.length > 0 })
}
export function useMovieGenres() {
  return useQuery({ queryKey: ["movieGenres"], queryFn: getMovieGenres })
}
export function useTVGenres() {
  return useQuery({ queryKey: ["tvGenres"], queryFn: getTVGenres })
}
export function useDiscoverByGenre(genreId: string, page = "1") {
  return useQuery({
    queryKey: ["discover", genreId, page],
    queryFn: () => discoverMovies({ with_genres: genreId, page, sort_by: "popularity.desc" }),
    enabled: !!genreId,
  })
}
