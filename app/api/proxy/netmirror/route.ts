import { NextRequest, NextResponse } from "next/server"

const NETMIRROR_BASE = "https://net77.cc"

function parseCookies(cookieStr: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  cookieStr.split(";").forEach((pair) => {
    const [name, ...rest] = pair.trim().split("=")
    if (name && rest.length > 0) {
      cookies[name.trim()] = rest.join("=").trim()
    }
  })
  return cookies
}

function buildCookieHeader(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ")
}

export async function GET(req: NextRequest) {
  const cookieStr = process.env.NETMIRROR_COOKIES || ""
  if (!cookieStr) {
    return NextResponse.json(
      { error: "COOKIES_MISSING", message: "NetMirror cookies not configured" },
      { status: 401 }
    )
  }

  const cookies = parseCookies(cookieStr)
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type") || "movie"
  const season = searchParams.get("s")
  const episode = searchParams.get("e")

  if (!id) {
    return NextResponse.json({ error: "MISSING_ID" }, { status: 400 })
  }

  const cookieHeader = buildCookieHeader(cookies)
  const timestamp = Math.floor(Date.now() / 1000)

  const headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": `${NETMIRROR_BASE}/home`,
    "Origin": NETMIRROR_BASE,
    "X-Requested-With": "XMLHttpRequest",
    "Cookie": cookieHeader,
  }

  try {
    const postUrl = `${NETMIRROR_BASE}/post.php?id=${id}&t=${timestamp}`
    const postRes = await fetch(postUrl, { headers, method: "GET" })
    const postText = await postRes.text()

    let postData: any = {}
    try {
      postData = JSON.parse(postText)
    } catch {
      return NextResponse.json(
        { error: "POST_PARSE_ERROR", raw: postText.slice(0, 200) },
        { status: 500 }
      )
    }

    if (postData.status === "n" && postData.error === "Invalid User") {
      return NextResponse.json(
        { error: "COOKIES_EXPIRED", message: "NetMirror cookies have expired" },
        { status: 401 }
      )
    }

    if (postData.status !== "y") {
      return NextResponse.json(
        { error: "POST_FAILED", message: postData.error || "Unknown error" },
        { status: 500 }
      )
    }

    let playId = id
    let episodeData = null

    if (type === "tv" && season && episode) {
      const seasonNum = parseInt(season)
      const episodeNum = parseInt(episode)

      const seasonInfo = postData.season?.find((s: any) => s.s === String(seasonNum))
      if (!seasonInfo) {
        return NextResponse.json(
          { error: "SEASON_NOT_FOUND", available: postData.season },
          { status: 404 }
        )
      }

      const epInfo = postData.episodes?.find((ep: any) => ep.ep === String(episodeNum))
      if (!epInfo) {
        return NextResponse.json(
          { error: "EPISODE_NOT_FOUND", available: postData.episodes?.map((e: any) => e.ep) },
          { status: 404 }
        )
      }

      playId = epInfo.id
      episodeData = {
        title: epInfo.t,
        description: epInfo.ep_desc,
        duration: epInfo.time,
      }
    }

    const playBody = new URLSearchParams({ id: playId })
    const playRes = await fetch(`${NETMIRROR_BASE}/play.php`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: playBody.toString(),
    })
    const playText = await playRes.text()

    let playData: any = {}
    try {
      playData = JSON.parse(playText)
    } catch {
      return NextResponse.json(
        { error: "PLAY_PARSE_ERROR", raw: playText.slice(0, 200) },
        { status: 500 }
      )
    }

    if (!playData.h) {
      return NextResponse.json(
        { error: "PLAY_NO_HASH", raw: playText.slice(0, 200) },
        { status: 500 }
      )
    }

    try {
      const recentBody = new URLSearchParams({ recentplay: `SE${id}` })
      await fetch(`${NETMIRROR_BASE}/recentplay.php`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: recentBody.toString(),
      })
    } catch {
      /* ignore */
    }

    return NextResponse.json({
      success: true,
      title: postData.title,
      year: postData.year,
      type: postData.type,
      hash: playData.h,
      sources: [
        { type: "netmirror", url: `${NETMIRROR_BASE}/play?h=${encodeURIComponent(playData.h)}` },
        { type: "token", url: playData.h },
      ],
      episode: episodeData,
      seasons: postData.season,
      episodes: postData.episodes,
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: "PROXY_ERROR", message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { cookies } = await req.json()

  if (!cookies || typeof cookies !== "string") {
    return NextResponse.json({ error: "MISSING_COOKIES" }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    message: "Cookies received. Add to .env.local: NETMIRROR_COOKIES=your_cookies",
    cookies_preview: cookies.slice(0, 50) + "...",
  })
}
