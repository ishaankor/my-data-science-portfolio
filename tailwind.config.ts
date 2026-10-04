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
        ink: "#0b0d0f",
        surface: "#121518",
        line: "#1e242b",
        muted: "#64748b",
        bone: "#f1f5f9",
        "bone-dim": "#cbd5e1",
        ember: {
          DEFAULT: "#38bdf8",
          light: "#7dd3fc",
          glow: "rgba(56, 189, 248, 0.15)",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      boxShadow: {
        float: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        panel: "0 4px 20px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
