# 7Movies Engineering Status

## Current phase
Phase 2 — Real user state + data boundary hardening

## Current branch
`chore/production-hardening`

## Completed
- Audited the current repository and identified mock catalogue usage, build-check bypasses, and state architecture drift.
- Created the Supabase `7movies` project in `ap-south-1`.
- Added profiles, preferences, watch history, continue watching, and watchlist tables.
- Added row-level security policies scoped to the authenticated user.
- Enabled Realtime for user preference, continue-watching, and watchlist tables.
- Added automatic profile/preferences creation on signup and hardened trigger permissions.
- Optimized RLS policies to avoid per-row auth initialization overhead.
- Added versioned Supabase migrations and typed database contracts.
- Removed the mock TMDB catalogue and hardcoded TMDB credential fallback.
- Restored TypeScript and ESLint enforcement during production builds.
- Added anonymous Supabase session bootstrapping so authentication is not mandatory for browsing/watching.
- Added cloud-backed watchlist and Continue Watching persistence with local-state fallback.
- Added Realtime synchronization for watchlist and Continue Watching.
- Added local-to-cloud hydration for existing persisted media state.
- Added cloud-backed user preferences.
- Added watch-history recording when real playback progress is received.
- Connected FilmU playback progress messages to the cloud-backed Continue Watching flow.
- Moved browser TMDB requests behind `/api/tmdb`; the API credential is now resolved server-side.
- Added `.env.example` documenting the server-only TMDB credential and Supabase browser credentials.

## Important remaining work
- Confirm Supabase Anonymous Sign-Ins is enabled in Auth settings.
- Remove the remaining legacy FilmU `7movies-continue` localStorage write after the playback flow is fully migrated.
- Audit every catalogue fallback/error path and ensure no fabricated content can reach the UI.
- Complete Watch History UI and server-state hydration where needed.
- Finish the watch-provider architecture/security audit.
- Fix remaining correctness issues in the watch page, including hook ordering and provider state handling.
- Continue the UI/UX, responsive, accessibility, and loading/error/empty-state pass.
- Run the repository TypeScript/lint/build suite in an environment with dependency installation/network access.
- Verify the deployed Vercel application after deployment access is restored.

## Data policy
The product must not use fabricated catalogue data. TMDB is the source of movie/TV catalogue data; Supabase stores 7Movies application/user state around that catalogue.
