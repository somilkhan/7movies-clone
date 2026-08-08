# Capture checklist

Transcribed from the supplied checklist image, with package status.

## Critical — cannot proceed without these

### 1. Rendered HTML (outerHTML)
DevTools → Elements → right-click `<html>` → Copy → Copy outerHTML.

Status: Partial. `live-snapshot/raw-response.html` is the public server response, not exact post-JavaScript browser outerHTML.

### 2. Console errors (screenshot)
DevTools → Console tab → screenshot all red errors. Empty cards may indicate an API failure.

Status: Not supplied. See MISSING_OR_NEEDS_CAPTURE.md.

### 3. Network tab — API calls
DevTools → Network tab → filter Fetch/XHR → reload → screenshot the request list and whether calls return 200 or fail.

Status: Not supplied. See MISSING_OR_NEEDS_CAPTURE.md.

## High — needed for pixel perfection

### 4. Full CSS file from the live site
DevTools → Sources → find the main CSS file, often `styles.css` or `_next/static/css/...`, then copy the entire file.

Status: The two linked response CSS files are included in `live-snapshot/css/`. Capture any additional runtime or injected CSS if present.

### 5. Computed CSS screenshots
Capture Elements → Computed for:
1. Top nav pill (Home/Movies/TV)
2. Hero title (the checklist names “Spider-Man: No Way Home”)
3. One working card (from “Trending Now”)
4. One broken/error card (from “Popular”)
5. Rail heading (“Trending Now” text)

Status: Not verified as computed-style captures. The six mobile screenshots are preserved unchanged.

## Nice to have

### 6. Screen recording (5 seconds)
Show scrolling, nav behavior, card hover/press states, and rail behavior.

Status: Supplied MP4 is 64.4 seconds, preserved unchanged, with a storyboard in `video-storyboard/`.
