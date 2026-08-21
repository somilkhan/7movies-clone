# 7Movies

A premium movie & TV discovery and watch experience built with Next.js 15, React 19, TanStack Query, Tailwind CSS, and Supabase.

## Live

**https://7movies-clone.vercel.app**

## Architecture

- **TMDB** — real movie, TV, season, episode, search, discovery, and metadata source.
- **Supabase** — persistent user/application state with PostgreSQL, RLS, Auth, and Realtime.
- **Zustand** — responsive client state and local fallback/cache.
- **TanStack Query** — server-data caching and request lifecycle management.
- **Next.js App Router** — application routing and server/client boundaries.

## User experience

- Browse and watch without a mandatory registration wall.
- Anonymous Supabase sessions can persist personal state when anonymous sign-ins are enabled.
- Watchlist and Continue Watching sync to Supabase and subscribe to realtime changes.
- Local persisted state is migrated into cloud state when a cloud identity becomes available.
- TMDB catalogue content is never fabricated with mock movie data.
- Responsive mobile, tablet, and desktop layouts.
- Accessibility support including keyboard navigation, focus management, reduced motion, and skip links.

## Development

```bash
npm install
npm run dev
```

Required environment variables are documented in `.env.example`. Never commit production secrets.

## Validation

The repository includes GitHub Actions validation for TypeScript, ESLint, and a production Next.js build on pushes to `main` and `chore/production-hardening`, plus pull requests targeting `main`.
