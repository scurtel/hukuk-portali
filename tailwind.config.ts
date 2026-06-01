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
        brand: {
          50: "#f0f4fa",
          100: "#dce6f5",
          500: "#1e4a8c",
          700: "#0f2d5c",
          900: "#0a1f3d"
        },
        accent: {
          red: "#c41e3a",
          "red-dark": "#9e1830"
        },
        ink: {
          DEFAULT: "#0c1222",
          muted: "#4a5568",
          subtle: "#718096"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        card: "0 1px 3px rgba(12, 18, 34, 0.08), 0 4px 12px rgba(12, 18, 34, 0.06)",
        "card-hover": "0 4px 20px rgba(12, 18, 34, 0.12)"
      },
      maxWidth: {
        portal: "80rem"
      }
    }
  },
  plugins: [typography]
};

export default config;
