import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0d",
        paper: "#f3f0ea",
        muted: "#929093",
        line: "rgba(255,255,255,0.12)",
        accent: "#e8e6e1",
        surface: "#151519",
        "surface-light": "#1b1c20",
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
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "hero-fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "dialog-pop": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "hero-fade-up": "hero-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer: "shimmer 1.5s infinite linear",
        "dialog-pop": "dialog-pop 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
}

export default config
