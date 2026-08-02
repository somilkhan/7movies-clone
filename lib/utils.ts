import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function formatDate(dateStr: string): string {
  if (!dateStr) return "Unknown"
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}
export function formatRuntime(minutes: number): string {
  if (!minutes) return ""
  const h = Math.floor(minutes / 60), m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
export function getYear(dateStr?: string): string { return dateStr ? new Date(dateStr).getFullYear().toString() : "" }
export function getImageUrl(path: string | null, size: "w500" | "w780" | "w1280" | "original" = "w500"): string {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : ""
}
export function truncate(text: string, length: number): string {
  return text && text.length > length ? text.slice(0, length).trim() + "..." : text
}
export function getTrailerKey(videos?: { results: { key: string; type: string; site: string }[] }): string | null {
  if (!videos?.results?.length) return null
  const trailer = videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube")
  return trailer?.key || videos.results[0]?.key || null
}
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => fn(...args), delay) }
}
