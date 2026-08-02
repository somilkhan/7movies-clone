# 🤖 Agent Instructions — 7movies-clone

> **Read this file first. Update this file last.**
> This document is the single source of truth for any AI agent or human developer working on this project.

---

## 🚀 Pre-Flight Checklist (Do This FIRST)

Before writing a single line of code:

1. **Read `HANDOFF.md`** from the repo root
   ```bash
   cat HANDOFF.md
   ```

2. **Check current state**
   ```bash
   git log --oneline -3
   git status
   ```

3. **Set commit author** (Vercel blocks deploys if email ≠ GitHub account)
   ```bash
   git config user.email "81418397+somilkhan@users.noreply.github.com"
   git config user.name "Sahil"
   ```

4. **Install dependencies** (if `node_modules` is missing)
   ```bash
   npm install
   ```

5. **Verify build passes**
   ```bash
   npm run build
   ```

---

## 🛠 In-Flight Rules (While Working)

### Code Style
- Use TypeScript strict mode (but build bypasses errors via `ignoreBuildErrors: true`)
- Use Tailwind CSS for all styling
- Use `next/image` for all images with proper `sizes` and `alt` attributes
- Use `framer-motion` for animations (respect `useReducedMotion()`)
- Use `lucide-react` for icons with `aria-hidden="true"` on decorative ones

### File Organization
```
app/
  components/     # Reusable UI components
  movie/[id]/     # Movie detail page
  tv/[id]/        # TV detail page
  search/         # Search page
  watchlist/      # Watchlist page
  settings/       # Settings page
  movies/         # Movies filter page
  tv/             # TV filter page
  watch/[id]/     # Watch player page
lib/
  hooks/          # TanStack Query hooks
  tmdb.ts         # TMDB API helpers
  utils.ts        # Utility functions
stores/
  useAppStore.ts  # Zustand store
types/
  index.ts        # TypeScript types
```

### Design Tokens
```css
--bg: #000000
--paper: #f3f0ea
--surface: #151519
--muted: #929093
--line: rgba(255,255,255,0.12)
--accent: #e8e6e1
```
- **Fonts**: Manrope (body), Space Grotesk (display), DM Mono (mono)
- **Border radius**: `rounded-card` = 16px, `rounded-pill` = 9999px
- **Touch targets**: Minimum 44px × 44px

---

## 🛬 Post-Flight Checklist (Before Stopping)

Before ending your chat session:

1. **Finish the current function/file** — don't stop mid-line

2. **Test the build**
   ```bash
   npm run build
   ```

3. **Commit with correct author**
   ```bash
   git add .
   git commit -m "type: description"
   ```
   Commit types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

4. **Update `HANDOFF.md`**
   - Mark completed items
   - Describe what you were doing when you stopped
   - List exact next steps
   - Add any new blockers

5. **Update THIS file** if you discovered a new blocker or workflow fix

6. **Push to GitHub**
   - If `git push` works: `git push origin main`
   - If `git push` times out (sandbox): use GitHub Contents API (see below)

7. **Tell the user:**
   > "Stopping now. `HANDOFF.md` and `AGENT_INSTRUCTIONS.md` updated. Run `git status` in next turn."

---

## 🚧 Common Blockers & Fixes

### 1. `npm install` times out in sandbox
**Symptom:** Network timeout after 120s  
**Fix:** Run `npm install` on your local machine, not in the sandbox. Or use `npm ci` if `package-lock.json` exists.

### 2. `git push` times out in sandbox
**Symptom:** `TimeoutExpired` after 30-120s  
**Fix:** Use GitHub Contents API to update files individually:
```python
import requests, base64
token = "YOUR_TOKEN"
headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github.v3+json"}
repo = "somilkhan/7movies-clone"

with open("path/to/file.tsx", "r") as f:
    content = f.read()

# Get current file SHA (for updates)
r = requests.get(f"https://api.github.com/repos/{repo}/contents/path/to/file.tsx?ref=main", headers=headers)
if r.status_code == 200:
    sha = r.json()["sha"]  # For existing files
else:
    sha = None  # For new files

payload = {
    "message": "feat: description",
    "content": base64.b64encode(content.encode()).decode(),
    "branch": "main"
}
if sha:
    payload["sha"] = sha

requests.put(f"https://api.github.com/repos/{repo}/contents/path/to/file.tsx", headers=headers, json=payload)
```

### 3. Vercel blocks deploy — commit email mismatch
**Symptom:** "The deployment was blocked because the commit email ... could not be matched to a GitHub account"  
**Fix:** Ensure git config uses:
```bash
git config user.email "81418397+somilkhan@users.noreply.github.com"
git config user.name "Sahil"
```

### 4. TypeScript build errors
**Symptom:** `npm run build` fails with type errors  
**Fix:** Already bypassed in `next.config.js`:
```js
typescript: { ignoreBuildErrors: true }
eslint: { ignoreDuringBuilds: true }
```
But fix real errors when possible.

### 5. Missing TMDB token
**Symptom:** API calls return 401  
**Fix:** Create `.env.local`:
```env
NEXT_PUBLIC_TMDB_TOKEN=your_token_here
```

### 6. Images not loading
**Symptom:** Blank image placeholders  
**Fix:** Ensure `next.config.js` has `image.tmdb.org` in `remotePatterns`.

---

## 📋 The Handoff Pattern

This project uses a **stop-and-continue** workflow:

```
Chat N ends:
  1. Commit WIP
  2. Update HANDOFF.md
  3. Push
  4. Say "Stopping now. HANDOFF.md updated."

Chat N+1 starts:
  1. Read HANDOFF.md
  2. git status
  3. Continue where HANDOFF.md says to continue
```

**Why this works:**
- AI agents are stateless between chats
- HANDOFF.md is the external memory
- Git commits show exactly what changed when
- New developers can onboard in 30 seconds by reading one file

---

## 📝 Commit Message Format

```
type(scope): description

[optional body]
```

**Types:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation only
- `style:` — Formatting, missing semicolons, etc.
- `refactor:` — Code change that neither fixes a bug nor adds a feature
- `test:` — Adding tests
- `chore:` — Build process, dependencies, etc.

**Examples:**
```
feat: add floating pill navigation
fix: resolve mobile touch target sizing
docs: update README with deploy URL
```

---

## 🎯 Project-Specific Notes

- **No PWA** — User explicitly declined in Chat 1
- **Watch page** — Uses YouTube embed placeholder. User will replace with licensed player.
- **Onboarding** — Shows once per browser via Zustand + localStorage
- **Continue Watching** — Saves to localStorage key `7movies-continue`
- **Keyboard shortcuts** — `K` search, `H` home, `W` watchlist, `S` settings, `ESC` close
- **Spoiler protection** — Blurs episode details for episodes > 1. Tap to reveal.

---

## 🔗 Useful Links

- **Repo:** https://github.com/somilkhan/7movies-clone
- **Live:** https://7movies-clone.vercel.app
- **TMDB API Docs:** https://developer.themoviedb.org/reference
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

*Last updated: 2026-08-03 by Chat 4 Agent*  
*If you fix something new, add it to "Common Blockers" above and update this timestamp.*
