import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: "#090d16",
        "haze-dark": "#0d111c",
        "haze-card": "#131826",
        "haze-border": "rgba(129, 140, 248, 0.18)",
        "haze-border-hover": "rgba(168, 85, 247, 0.4)",
        "haze-indigo": "#818cf8",
        "haze-violet": "#a855f7",
        "haze-purple": "#c084fc",
        "haze-cyan": "#38bdf8",
        "haze-text": "#f8fafc",
        "haze-dim": "#cbd5e1",
        "haze-muted": "#94a3b8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        haze: "0 10px 30px -10px rgba(129, 140, 248, 0.15)",
        "haze-glow": "0 0 35px -5px rgba(168, 85, 247, 0.3)",
      },
      animation: {
        "haze-pulse": "hazePulse 4s ease-in-out infinite",
        "star-float": "starFloat 6s ease-in-out infinite",
      },
      keyframes: {
        hazePulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        starFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
