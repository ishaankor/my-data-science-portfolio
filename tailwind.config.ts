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
        ink: "#0b0d0f",
        surface: "#121518",
        line: "#1e242b",
        muted: "#64748b",
        bone: "#f1f5f9",
        "bone-dim": "#cbd5e1",
        ember: {
          DEFAULT: "#f97316",
          glow: "rgba(249, 115, 22, 0.15)",
        },
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        float: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        panel: "0 4px 20px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
