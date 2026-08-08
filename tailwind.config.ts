import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        paper: "#f3f0ea",
        surface: "#151519",
        muted: "#929093",
        line: "rgba(255,255,255,0.12)",
        accent: "#8163a4",
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
}
export default config
