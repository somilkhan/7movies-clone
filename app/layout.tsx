import type { Metadata, Viewport } from "next"
import { Manrope, Space_Grotesk, DM_Mono } from "next/font/google"
import "./globals.css"
import { Topbar } from "./components/Topbar"
import { QueryProvider } from "./components/QueryProvider"
import { ToastContainer } from "./components/Toast"
import { KeyboardShortcuts } from "./components/KeyboardShortcuts"
import { SkipLink } from "./components/SkipLink"
import { ReducedMotionProvider } from "./components/ReducedMotionProvider"
import { DialogRenderer } from "./components/DialogRenderer"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: ["400", "500", "600", "700"] })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", weight: ["400", "500", "600", "700"] })
const dmMono = DM_Mono({ subsets: ["latin"], variable: "--font-dm-mono", display: "swap", weight: ["400", "500"] })

export const metadata: Metadata = {
  title: "7Movies — Watch something unforgettable",
  description: "A quiet place for loud stories. Discover trending movies, TV shows, and anime. Stream HD content with zero ads.",
  keywords: ["movies", "tv shows", "streaming", "watch online", "free movies", "hd streaming"],
  authors: [{ name: "7Movies" }],
  creator: "7Movies",
  publisher: "7Movies",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    title: "7Movies — Watch something unforgettable",
    description: "A quiet place for loud stories. Discover trending movies, TV shows, and anime.",
    type: "website",
    siteName: "7Movies",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "7Movies — Watch something unforgettable",
    description: "A quiet place for loud stories.",
  },
  alternates: { canonical: "https://7movies-clone.vercel.app" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "7Movies",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${manrope.variable} ${spaceGrotesk.variable} ${dmMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body className="font-manrope">
        <ReducedMotionProvider>
          <QueryProvider>
            <SkipLink />
            <div className="site-shell ambience-standard min-h-screen overflow-hidden">
              <Topbar />
              <main id="main-content">
                {children}
              </main>
            </div>
            <ToastContainer />
            <DialogRenderer />
            <KeyboardShortcuts />
          </QueryProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  )
}
