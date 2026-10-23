import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#18E299",
          "green-deep": "#0FA76E",
          "green-soft": "#E8FFF5",
          obsidian: "#0D0D0D",
          white: "#FFFFFF",
          info: "#3772CF",
          warning: "#C37D0D",
          error: "#D45656",
          success: "#15A34A",
          gray: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#E5E5E5",
            400: "#888888",
            500: "#666666",
            700: "#333333",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        tag: "4px",
        control: "8px",
        card: "16px",
        featured: "24px",
        pill: "9999px",
      },
      boxShadow: {
        ambient: "rgba(0, 0, 0, 0.03) 0 2px 4px",
        "ambient-dark": "rgba(0, 0, 0, 0.4) 0 4px 12px",
        "glow-green": "0 0 24px rgba(24, 226, 153, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
