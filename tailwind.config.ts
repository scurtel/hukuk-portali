import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
          muted: "#334155"
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C76B",
          dark: "#B8962E"
        },
        brand: {
          50: "#f8fafc",
          100: "#f1f5f9",
          500: "#334155",
          700: "#1E293B",
          900: "#0F172A"
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          subtle: "#64748B"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        editorial: "0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.08)",
        "editorial-lg": "0 4px 24px rgba(15, 23, 42, 0.12)"
      },
      maxWidth: {
        portal: "80rem"
      }
    }
  },
  plugins: [typography]
};

export default config;
