# 🤖 Agent Instructions — 7movies-clone

> **Read this file first. Update this file last.**
> This document is the single source of truth for any AI agent or human developer working on this project.

---

## 🚨 ABSOLUTE RULES — BREAKING THESE IS A WORKFLOW FAILURE

### Rule 1: When Running Low on Calls, Ask User to Continue
You have a hard limit of 25 tool calls per turn. When you have ~5 calls remaining and are NOT done:

**DO THIS:**
1. Tell the user: "I need more calls to finish. Say **'continue'** to give me 25 fresh calls."
2. The user says "continue" → you get 25 fresh calls → keep working.
3. This is the SAME chat. No new session. No handoff needed.

**ONLY end the session if:**
- The task is completely finished, OR
- You are blocked and need the user to do something offline (e.g., add an API key, verify on their phone)

**NEVER dump a raw markdown template into chat** and ask the user to copy-paste it into `HANDOFF.md`. That defeats the entire handoff system. If you MUST end, push `HANDOFF.md` via API first.

### Rule 2: When Stuck, Escalate — Do Not Guess
If you cannot identify the root cause of a bug within **3 diagnostic steps**:
1. **STOP trying random fixes.**
2. Tell the user exactly what you checked, what you found, and what you need from them.
3. Ask for: screenshots, console logs, network tab exports, or specific reproduction steps.

**NEVER** burn remaining calls on "let me try this..." guesses. The user is the domain expert on their own app. Ask them.

### Rule 3: Budget Your Calls — Use "Continue" to Refill
You have a hard limit of 25 tool calls per turn. Before starting complex work, count your expected calls:
- Reading N files = N calls
- Pushing N files = N calls  
- Testing/deploy = 1-2 calls
- Always reserve **at least 3 calls** for the final push.

**If a task needs more than 20 calls:**
- Tell the user: "I need more calls. Say **'continue'** to give me 25 fresh calls."
- The user says "continue" → you get 25 fresh calls → keep working in the SAME chat.
- This is NORMAL. Do not apologize for it. Do not end the session.

**You do NOT need to push HANDOFF.md just because you ran out of calls.** Only push it when the task is done or you are genuinely blocked.

### Rule 4: ONE Commit Per Turn — NEVER Multiple
**Vercel only allows 100 builds per 24 hours.** Every commit triggers a build. Pushing multiple commits in one session is a WORKFLOW FAILURE.

**THE PENALTY:** If you break this rule, you have wasted Vercel builds. The user will reject your work and make you squash the commits. You will lose time and trust.

**The Problem:** GitHub Contents API creates ONE commit PER file update. If you change 20 files via API, that is 20 commits → 20 builds. This burns your 100-build limit in 5 sessions. **Chat 9 broke this rule and wasted 4 builds on FilmU integration.**

**CRITICAL — Git Identity Must Match GitHub Account:**
Vercel blocks deploys if the commit email does not match the GitHub account. **ALWAYS** set this BEFORE any commit:
```bash
git config user.email "81418397+somilkhan@users.noreply.github.com"
git config user.name "Sahil"
```
**NEVER** use a fake email like `agent@7movies.dev` — this will block the build.

**Correct workflow — ALWAYS use local git for multi-file changes:**

```bash
# 1. Clone/pull latest
git clone --depth 10 https://github.com/somilkhan/7movies-clone.git repo-fix
cd repo-fix
git config user.email "81418397+somilkhan@users.noreply.github.com"
git config user.name "Sahil"

# 2. Make ALL your code changes (edit 20 files if needed)

# 3. Stage everything in ONE command
git add .

# 4. ONE commit for ALL changes
git commit -m "feat: description of all changes"

# 5. ONE push = ONE build
git push origin main
```

**When to use GitHub API vs local git:**

| Scenario | Method | Why |
|----------|--------|-----|
| 1-2 file changes | GitHub API OK | Only 1-2 commits, acceptable |
| 3+ file changes | **Local git ONLY** | API would create 3+ commits |
| New file + edit existing | **Local git ONLY** | API creates 2+ commits |
| Deleting files | **Local git ONLY** | API handles deletes poorly |

**If you already made multiple local commits, squash them BEFORE pushing:**
```bash
git reset --soft HEAD~N   # N = number of local commits to squash
git add .
git commit -m "feat: description of all changes"
git push origin main
```

**If sandbox git clone/push times out:**
1. Try `git clone --depth 10` (shallow clone is faster)
2. Try `git push` with a longer timeout
3. If it still fails, use API for the MOST CRITICAL file only
4. Update `HANDOFF.md` to note which files were NOT pushed
5. Tell the user: "Git push timed out — only critical file pushed via API, rest in HANDOFF.md"

**NEVER use API for 3+ files. NEVER.

### Rule 5: Read Before You Edit
**Never modify a file you haven't fully read in the current session.**
- If a file is >300 lines, read the full thing anyway
- If you only need to change 5 lines, you still must read the full file first
- Do NOT edit based on snippets from `HANDOFF.md` or your memory

> *Why:* Other agents or the user may have changed the file since your last session. Blind edits overwrite working code.

### Rule 6: If It Ain't Broke, Don't Touch It
Do not refactor, reformat, rename variables, or "improve" code that is already working and unrelated to the current task. Only touch files directly connected to the bug/feature you're fixing.

> *Why:* Agents often "clean up" while fixing something, introducing new bugs in perfectly working components. The user didn't ask for a refactor.

### Rule 7: Never Delete User Data or Config
Never delete:
- `.env.local`
- `package-lock.json`
- localStorage keys (e.g., `7movies-continue`, `7movies-watchlist`)
- Zustand store schemas

If a store shape needs to change, write a migration. If you must delete something, ask the user first.

> *Why:* One bad agent can erase every user's watchlist, continue-watching history, or settings.

### Rule 8: Verify on the Deployed Site
After pushing a fix, open the live Vercel URL and verify it actually works. Code that looks correct can still fail due to build caching, environment differences, or runtime errors.

**Checklist:**
- [ ] Open https://7movies-clone.vercel.app
- [ ] Check the specific page/component you changed
- [ ] Check mobile width (375px) — this app is mobile-first
- [ ] Open DevTools Console for red errors

> *Why:* The empty cards bug existed for multiple chats because agents assumed the code was right without checking the deployed site.

### Rule 9: Match Existing Patterns Exactly
When adding new code, copy the exact pattern from a nearby working example in the same file or project. Don't introduce:
- New hook patterns
- New styling approaches
- New abstraction layers
- New dependency injection patterns

> *Why:* Consistency prevents "frankencode" where every agent writes in their own style.

### Rule 10: No Secrets in Commits
Never commit API keys, tokens, or passwords — even if they're already in the repo. If you need to update `.env.local`, tell the user to do it manually.

> *Why:* Tokens in agent memory can accidentally leak into commit messages, file contents, or chat history.

### Rule 11: Don't Trust Your Memory
**Your memory is hallucination-prone.** Never say "I remember this file had..." — re-read it. Never say "the API returns..." — test it or read the type definitions.

> *Why:* Agents confidently state incorrect facts about code they haven't read in the current session.

### Rule 12: Don't Add Dependencies Without Asking
Never `npm install` a new package without explicit user permission. The project already has everything it needs. If you think a package is necessary, ask first.

> *Why:* New dependencies bloat the bundle, break builds, and introduce security risks.

### Rule 13: Preserve All Working Features
When fixing a bug, verify you didn't break adjacent features. If you fix Rail A, check that Rail B, C, and D still work. If you change a shared component, check every page that uses it.

> *Why:* Surgical fixes often have blast radius. A change to `MediaCard.tsx` affects 20+ rails.

### Rule 14: Don't Use `any` or `@ts-ignore` as a Lazy Fix
If TypeScript complains, actually fix the type error. Don't slap `as any` or `// @ts-ignore` on it and move on. If you don't understand the type, read the type definitions in `types/index.ts`.

> *Why:* `any` hides real bugs. The project has `ignoreBuildErrors: true` in `next.config.js` for deployment, but that doesn't mean you should write sloppy types.

### Rule 15: If You See `// TODO` or `// HACK`, Leave It Alone
Those comments are intentional workarounds or future tasks. Don't "fix" them unless the current task explicitly requires it.

> *Why:* A `// HACK` might be the only thing keeping a feature working. Removing it "to be cleaner" breaks production.

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

3. **Set commit author** (Vercel BLOCKS deploys if email ≠ GitHub account — Chat 14 learned this the hard way)
   ```bash
   git config user.email "81418397+somilkhan@users.noreply.github.com"
   git config user.name "Sahil"
   ```
   ⚠️ **NEVER** use `agent@7movies.dev` or any other fake email. The build will be blocked.

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

**Default action: Ask user to say "continue" for 25 fresh calls.**
Only end the session if the task is 100% complete or you are genuinely blocked.

### If you need more calls (most common):
Tell the user: "I need more calls to finish. Say **'continue'** to give me 25 fresh calls." Then wait.

### If the task is DONE and you are stopping:
1. **Finish the current function/file** — don't stop mid-line

2. **Test the build**
   ```bash
   npm run build
   ```

3. **Commit with correct author** (ONE commit only — see Rule 4. **Double-check git config first.**)
   ```bash
   git config user.email "81418397+somilkhan@users.noreply.github.com"
   git config user.name "Sahil"
   git add .
   git commit -m "type: description"
   ```
   Commit types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

   If you have multiple local commits, squash them first:
   ```bash
   git reset --soft HEAD~N && git add . && git commit -m "type: all changes"
   ```

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
**Root Cause:** You used a fake email like `agent@7movies.dev` instead of the GitHub account email. **Chat 14 broke this rule.**
**Fix:** Amend the commit with the correct identity and force-push:
```bash
git config user.email "81418397+somilkhan@users.noreply.github.com"
git config user.name "Sahil"
git commit --amend --reset-author --no-edit
git push origin main --force-with-lease
```
**Prevention:** Set git config BEFORE the first commit in every session. See Rule 4 and Pre-Flight Checklist step 3.

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

### 7. Empty cards in standard rails (Popular, Top Rated, etc.)
**Symptom:** Rails show skeleton cards instead of real data  
**Fix:** Check `lib/hooks/useTMDB.ts`. If `queryFn` is passed as a bare function reference (e.g., `queryFn: getPopularMovies`), TanStack Query v5 injects a `QueryFunctionContext` object as the first argument. This pollutes the `page` parameter. Wrap in an arrow function: `queryFn: () => getPopularMovies()`.

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

## 📦 Pixel-Perfect Matching — `site-handoff.zip`

The zip at `7movie/site-handoff.zip` contains the **real 7movies site** HTML/CSS snapshot. This is the single source of truth for exact styling values.

### How to Extract and Read

```bash
# Extract
unzip 7movie/site-handoff.zip -d 7movie/handoff/

# Read user observations
cat 7movie/handoff/SITE_OBSERVATIONS.md

# Read real site HTML (search for specific components)
grep -n "nav-pill" 7movie/handoff/live-snapshot/raw-response.html | head -5

# Read real site CSS (contains computed styles)
ls 7movie/handoff/live-snapshot/css/
cat 7movie/handoff/live-snapshot/css/main.css | grep -A5 "border-radius"
```

### What to Copy Exactly

When matching the real site, copy these values **verbatim** — do not guess:
- **Border radius** — exact px value from CSS
- **Box shadow** — exact blur/spread/color values
- **Padding/margin** — exact px or rem values
- **Font sizes/weights/letter-spacing** — exact values
- **Card aspect ratios** — exact width/height or padding-bottom %
- **Color hex codes** — exact values, not approximations

### Workflow
1. Extract the zip
2. Read `SITE_OBSERVATIONS.md` for known mismatches
3. Open the real site (https://7movies.tv) alongside your deploy
4. Use DevTools to inspect the real element
5. Cross-check with the extracted CSS files
6. Apply the exact value to your component
7. Verify on both desktop and mobile (375px)

> **NEVER** eyeball a value and say "this looks about right." Copy the exact computed style from the real site.

---

## 🔗 Useful Links

- **Repo:** https://github.com/somilkhan/7movies-clone
- **Live:** https://7movies-clone.vercel.app
- **TMDB API Docs:** https://developer.themoviedb.org/reference
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

---

---

## 💬 How to Start a New Chat (For Users)

### If you want to CONTINUE work:

Paste this exact prompt:
```
Continue the 7movies-clone project.

REPO: https://github.com/somilkhan/7movies-clone
BRANCH: main

Read .github/AGENT_INSTRUCTIONS.md first, then HANDOFF.md, then continue where HANDOFF.md says to continue.
```

### If you found a BUG:

Paste this exact prompt + fill in the blanks:
```
Bug report — 7movies-clone

REPO: https://github.com/somilkhan/7movies-clone
BRANCH: main

Read .github/AGENT_INSTRUCTIONS.md first, then HANDOFF.md.

Bug: [short description]
URL: [page where it happens]
Device: [Mobile/Desktop]
Browser: [Chrome/Safari/etc]

Steps:
1. [step 1]
2. [step 2]
3. [step 3]

Expected: [what should happen]
Actual: [what happens instead]

[Attach screenshot if possible]
```

### If you want a NEW FEATURE:

Paste this exact prompt:
```
New feature for 7movies-clone.

REPO: https://github.com/somilkhan/7movies-clone
BRANCH: main

Read .github/AGENT_INSTRUCTIONS.md first, then HANDOFF.md.

Feature: [describe what you want]
Why: [why you want it]
Reference: [screenshot/link to similar feature]
```

## 🐛 Bug Reporting Workflow

### For Users (You)

When you find a bug and want to open a new chat:

**Option A: Quick report (fastest)**
```
"Bug: [short description]

Screenshot: [attach image]
URL: [page where it happens]
Steps: 1. ... 2. ... 3. ...
Expected: [what should happen]
Actual: [what happens instead]"
```

**Option B: Detailed report (best for complex bugs)**
```
"Bug Report — 7movies-clone

**Severity:** [Critical / Major / Minor / Cosmetic]
**Page:** [e.g., /movie/123, homepage, /search]
**Device:** [Mobile / Desktop / Tablet]
**Browser:** [Chrome / Safari / Firefox]
**Screen size:** [e.g., 375px, 1920px]

**Steps to reproduce:**
1. Go to ...
2. Click ...
3. Scroll to ...

**Expected behavior:**
[What you expected]

**Actual behavior:**
[What actually happened]

**Screenshots / Screen recordings:**
[Attach files]

**Console errors (if any):**
[Copy from DevTools → Console]
```

### For Agents (Receiving a Bug Report)

When a user opens a new chat with a bug report:

1. **Read this file** (`.github/AGENT_INSTRUCTIONS.md`)
2. **Read `HANDOFF.md`** for current project state
3. **Reproduce the bug** — open the deployed URL and follow the user's steps
4. **Check the code** — find the relevant component/page
5. **Fix it** — write the fix, test locally if possible
6. **Update `HANDOFF.md`** — mark bug as fixed, add to "What's Done"
7. **Update this file** — if the bug was a common pattern, add it to "Common Blockers"
8. **Commit and push** with message: `fix: description of bug`
9. **Tell the user:** "Fixed. Redeploying now. Check [URL] in 1 minute."

### Bug Report Template (Copy-Paste)

```markdown
## Bug: [Title]

**URL:** https://7movies-clone.vercel.app/[path]
**Device:** [Mobile/Desktop]
**Browser:** [Chrome/Safari/etc]

### Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected
[What should happen]

### Actual
[What happens]

### Screenshot
[Attach image]
```

*Last updated: 2026-08-05 by Chat 14 Agent*  
*If you fix something new, add it to "Common Blockers" above and update this timestamp.*
