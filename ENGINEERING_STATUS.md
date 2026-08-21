# 7Movies Engineering Status

## Current phase
Phase 0 — Audit + Phase 1/2 foundation

## Current branch
`chore/production-hardening`

## Completed in this pass
- Audited the current repository and identified mock catalogue usage, build-check bypasses, and state architecture drift.
- Created the Supabase `7movies` project in `ap-south-1`.
- Added profiles, preferences, watch history, continue watching, and watchlist tables.
- Added row-level security policies scoped to the authenticated user.
- Enabled Realtime for user preference, continue-watching, and watchlist tables.
- Added automatic profile/preferences creation on signup.
- Hardened the signup trigger permissions.
- Optimized RLS policies to avoid per-row auth initialization overhead.
- Added versioned Supabase migrations to the repository.
- Added a typed Supabase database contract.
- Removed the mock TMDB catalogue and hardcoded TMDB credential fallback.
- Restored TypeScript and ESLint enforcement during production builds.

## Important remaining work
- Add the Supabase JS client with a synchronized lockfile.
- Implement authentication/session handling.
- Replace Zustand-only user data with Supabase-backed state.
- Add realtime client subscriptions and cross-device synchronization.
- Move TMDB access behind a server boundary so the API credential is not exposed to browsers.
- Audit and improve the watch-provider architecture.
- Continue the UI/UX and responsive/accessibility pass.
- Run the repository build/lint/test suite in an environment with dependency installation/network access.
- Verify the deployed Vercel application after deployment access is restored.

## Data policy
The product must not use fabricated catalogue data. TMDB is the source of movie/TV catalogue data; Supabase stores 7Movies application/user state around that catalogue.
