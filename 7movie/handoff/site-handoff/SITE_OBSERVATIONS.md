# 7Movies site observations

URL: https://7movies.in/
Observation date: 2026-08-03
Source: current public response plus browser-rendered screenshots.

## Page identity
- Title: `7Movies — Watch something unforgettable`
- Top navigation: Home, Movies, TV, search, account.
- Dark cinematic presentation with a large hero, pill-shaped top nav, hero actions, and horizontal movie rails.
- The hero rotates between loads: captured snapshots showed The Odyssey, Masters of the Universe, and Borderline. Do not treat one hero as permanently canonical.
- Hero actions: Watch now, Info, sound/mute.

## Visible response content
Major headings: Pick a few things you love; Made for you; New releases.

Titles found include: Avatar Aang: The Last Airbender; Stuart Fails to Save the Universe; Genius Girlfriend; Swapped; Michael; Project Hail Mary; Remarkably Bright Creatures; Mystic Nine; The Apartment Job; One Piece; Spider-Man: Brand New Day; The Odyssey; Supergirl; Obsession; Spider-Man: No Way Home; Moana; The Death of Robin Hood; Toy Story 5; The Devil's Mouth; Backrooms; Minions & Monsters; Colony.

## Technical observations
- HTTP 200 on 2026-08-03.
- Cloudflare-served Next.js response with `/_next/` assets.
- Two generated CSS files are included in `live-snapshot/css/`.
- Image paths use `/img/t/p/`; the response CSP lists several media/player origins.

## Not established by this package
Exact post-hydration DOM, runtime API behavior, console state, computed styles, hover/press states, and mobile navigation behavior require the browser DevTools captures requested in the checklist.
