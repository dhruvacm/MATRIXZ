/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ---- EXISTING dark tokens (admin panel uses these - DO NOT REMOVE) ---- */
        void: {
          DEFAULT: "#06060c",
          soft: "#0a0a14",
          raised: "#0f0f1c",
        },
        violet: {
          glow: "#8b5cf6",
          deep: "#6d28d9",
        },
        electric: {
          DEFAULT: "#3b82f6",
          bright: "#60a5fa",
        },

        /* ---- NEW EDITORIAL TECH CLUB DESIGN TOKENS (for public site) ---- */
        ivory: {
          DEFAULT: "#F7F6F0",
          light: "#FAF9F5",
          dark: "#EFECE2",
        },
        forest: {
          DEFAULT: "#214E3D",
          hover: "#1A3E30",
          dark: "#143327",
          light: "#2B634E",
        },
        charcoal: {
          DEFAULT: "#202923",
          muted: "#48544B",
          light: "#6E7A71",
          faint: "#95A198",
        },
        sage: {
          DEFAULT: "#DCE8DE",
          light: "#EDF3EE",
          dark: "#CAD9CC",
        },
        teal: {
          DEFAULT: "#8CB8A5",
          light: "#A7CBB9",
          dark: "#6FA08A",
        },
        neutralBorder: {
          DEFAULT: "#E1E4DC",
          subtle: "#EBECE6",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        /* existing (admin) */
        glow: "0 0 40px rgba(139, 92, 246, 0.25)",
        "glow-sm": "0 0 20px rgba(139, 92, 246, 0.2)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.25)",
        /* subtle editorial shadows */
        subtle: "0 1px 2px 0 rgba(32, 41, 35, 0.04)",
        card: "0 1px 3px 0 rgba(32, 41, 35, 0.06), 0 1px 2px -1px rgba(32, 41, 35, 0.04)",
        "card-hover": "0 4px 16px -2px rgba(32, 41, 35, 0.08), 0 2px 6px -1px rgba(32, 41, 35, 0.04)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};
