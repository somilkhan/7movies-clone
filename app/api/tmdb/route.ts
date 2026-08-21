import { NextRequest, NextResponse } from "next/server"

const TMDB_BASE = "https://api.themoviedb.org/3"

function isSafePath(path: string) {
  return path.startsWith("/") && !path.includes("..") && !path.includes("\\") && !path.includes("//")
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path")
  const apiKey = process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY

  if (!path || !isSafePath(path)) {
    return NextResponse.json({ error: "Invalid TMDB path" }, { status: 400 })
  }

  if (!apiKey) {
    return NextResponse.json({ error: "TMDB API key is not configured" }, { status: 503 })
  }

  const upstream = new URL(`${TMDB_BASE}${path}`)
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key !== "path") upstream.searchParams.set(key, value)
  })
  upstream.searchParams.set("api_key", apiKey)

  try {
    const response = await fetch(upstream, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    })

    const body = await response.text()
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch {
    return NextResponse.json({ error: "TMDB request failed" }, { status: 502 })
  }
}
