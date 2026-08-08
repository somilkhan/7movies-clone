# Missing or needs confirmation

| Evidence | Status | What to provide |
|---|---|---|
| Browser-rendered `<html>` outerHTML | Needs exact capture | DevTools Elements → right-click `<html>` → Copy outerHTML |
| Console error screenshot | Missing | Console with all red errors visible |
| Fetch/XHR network screenshot | Missing | Network filtered to Fetch/XHR after reload |
| Exact CSS loaded in browser | Partial | Two linked response CSS files included; add runtime/injected CSS if present |
| Computed style: top nav pill | Needs labeled capture | Selected element plus Computed panel |
| Computed style: hero title | Needs labeled capture | Selected element plus Computed panel |
| Computed style: working card | Needs labeled capture | Selected element plus Computed panel |
| Computed style: broken/error card | Needs labeled capture | Reproduce failed state if necessary |
| Computed style: rail heading | Needs labeled capture | Selected element plus Computed panel |
| Five-second scroll clip | Supplied recording differs | Supplied MP4 is 64.4 seconds and is included |

These items matter because HTML determines structure, console/network evidence explains broken cards, computed styles determine exact visual values, and the scroll clip establishes interaction behavior.
