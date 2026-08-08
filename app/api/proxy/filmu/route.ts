import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")
  const type = searchParams.get("type") || "movie"
  const season = searchParams.get("s") || "1"
  const episode = searchParams.get("e") || "1"

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const filmuUrl = type === "tv"
    ? `https://embed.filmu.in/tv/${id}?s=${season}&e=${episode}`
    : `https://embed.filmu.in/movie/${id}`

  try {
    const response = await fetch(filmuUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html",
      },
    })

    let html = await response.text()

    // Inject ad-blocking script at the very top of <head>
    const adBlockScript = `<script>
      (function() {
        // Block all popups
        window.open = function() { return null; };
        window.open.prototype = undefined;

        // Block ads config
        window.adsEnabled = false;
        window.showAds = function() {};
        window.loadAds = function() {};
        window.displayAds = function() {};

        // Block common ad networks
        const blockedDomains = [
          "googleadservices", "googlesyndication", "doubleclick",
          "google-analytics", "facebook.com/tr", "facebook.net",
          "propellerads", "popads", "onclickads", "adsterra",
          "exoclick", "juicyads", "trafficjunky", "adskeeper",
          "mgid", "taboola", "outbrain", "yandex", "mc.yandex"
        ];

        // Override fetch to block ad requests
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
          if (typeof url === "string" && blockedDomains.some(d => url.includes(d))) {
            return Promise.resolve(new Response("", { status: 200 }));
          }
          return originalFetch.apply(this, arguments);
        };

        // Override XMLHttpRequest to block ad requests
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
          if (typeof url === "string" && blockedDomains.some(d => url.includes(d))) {
            return;
          }
          return originalOpen.apply(this, arguments);
        };

        // Block script injection for ads
        const originalAppendChild = Element.prototype.appendChild;
        Element.prototype.appendChild = function(node) {
          if (node.tagName === "SCRIPT" && node.src) {
            if (blockedDomains.some(d => node.src.includes(d))) {
              return node;
            }
          }
          return originalAppendChild.apply(this, arguments);
        };

        // Block image ads
        const originalImageSrc = Object.getOwnPropertyDescriptor(Image.prototype, "src");
        if (originalImageSrc) {
          Object.defineProperty(Image.prototype, "src", {
            set: function(url) {
              if (typeof url === "string" && blockedDomains.some(d => url.includes(d))) {
                return;
              }
              originalImageSrc.set.call(this, url);
            },
            get: originalImageSrc.get,
          });
        }

        // Override document.write to prevent ad injection
        const originalWrite = document.write;
        document.write = function() {
          const content = Array.prototype.join.call(arguments, "");
          if (blockedDomains.some(d => content.includes(d))) {
            return;
          }
          return originalWrite.apply(this, arguments);
        };
      })();
    </script>`

    // Insert after <head>
    html = html.replace("<head>", `<head>${adBlockScript}`)

    // Also remove known ad script tags from the HTML
    html = html.replace(/<script[^>]*src=["'][^"']*googleadservices[^"']*["'][^>]*><\/script>/gi, "")
    html = html.replace(/<script[^>]*src=["'][^"']*googlesyndication[^"']*["'][^>]*><\/script>/gi, "")
    html = html.replace(/<script[^>]*src=["'][^"']*doubleclick[^"']*["'][^>]*><\/script>/gi, "")
    html = html.replace(/<script[^>]*src=["'][^"']*google-analytics[^"']*["'][^>]*><\/script>/gi, "")
    html = html.replace(/<script[^>]*src=["'][^"']*facebook\.com\/tr[^"']*["'][^>]*><\/script>/gi, "")
    html = html.replace(/<script[^>]*src=["'][^"']*facebook\.net[^"']*["'][^>]*><\/script>/gi, "")

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "X-Frame-Options": "SAMEORIGIN",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 })
  }
}
