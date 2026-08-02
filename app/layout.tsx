import type { Metadata, Viewport } from "next"
import { Manrope, Space_Grotesk, DM_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "./components/Navigation"
import { QueryProvider } from "./components/QueryProvider"
import { PageTransition } from "./components/PageTransition"
import { ToastContainer } from "./components/Toast"
import { KeyboardShortcuts } from "./components/KeyboardShortcuts"
import { Onboarding } from "./components/Onboarding"
import { SkipLink } from "./components/SkipLink"
import { ReducedMotionProvider } from "./components/ReducedMotionProvider"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: ["400", "500", "600", "700"] })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", weight: ["400", "500", "600", "700"] })
const dmMono = DM_Mono({ subsets: ["latin"], variable: "--font-dm-mono", display: "swap", weight: ["400", "500"] })

export const metadata: Metadata = {
  title: "7Movies — Watch something unforgettable",
  description: "A quiet place for loud stories. Discover trending movies, TV shows, and anime.",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: { title: "7Movies — Watch something unforgettable", description: "A quiet place for loud stories.", type: "website" },
}
export const viewport: Viewport = { themeColor: "#0b0b0d", width: "device-width", initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${manrope.variable} ${spaceGrotesk.variable} ${dmMono.variable}`}>
      <body className="font-manrope">
        <ReducedMotionProvider>
          <QueryProvider>
            <SkipLink />
            <div className="site-shell ambience-standard min-h-screen pb-24">
              <main id="main-content">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
            <Navigation />
            <ToastContainer />
            <KeyboardShortcuts />
            <Onboarding />
          </QueryProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  )
}
