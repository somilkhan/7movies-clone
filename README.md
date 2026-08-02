# 7Movies Clone

A premium movies & TV discovery app built with Next.js 15, React 19, TanStack Query, and Tailwind CSS.

## 🚀 Live Demo

**[https://7movies-clone.vercel.app](https://7movies-clone.vercel.app)**

## ✨ Features

- **TMDB Integration** — Real-time movie & TV data with infinite scrolling
- **Debounced Search** — Instant search suggestions with 300ms debounce
- **Watchlist** — Save favorites with Zustand + localStorage persistence
- **Continue Watching** — Track playback progress locally
- **Onboarding** — Genre preference picker for new visitors
- **Spoiler Protection** — Blur episode details until revealed
- **Keyboard Shortcuts** — `K` search, `H` home, `W` watchlist, `ESC` close
- **Accessibility** — Focus traps, ARIA labels, reduced motion support, skip links
- **Responsive** — Optimized for mobile, tablet, and desktop
- **Performance** — Image optimization, AVIF/WebP, code splitting, 90+ Lighthouse

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **State:** Zustand, TanStack Query
- **Animation:** Framer Motion (with reduced motion support)
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📦 Installation

```bash
git clone https://github.com/somilkhan/7movies-clone.git
cd 7movies-clone
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_TMDB_TOKEN=your_tmdb_api_token
```

Run dev server:
```bash
npm run dev
```

## 🔧 Build & Deploy

```bash
# Production build
npm run build

# Deploy to Vercel
vercel --prod
```

## 🎨 Design Tokens

| Token | Value |
|-------|-------|
| Background | `#0b0b0d` |
| Paper | `#f3f0ea` |
| Surface | `#151519` |
| Muted | `#929093` |
| Line | `rgba(255,255,255,0.12)` |

## 📝 License

MIT
