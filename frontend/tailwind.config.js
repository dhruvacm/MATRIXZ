/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(139, 92, 246, 0.25)",
        "glow-sm": "0 0 20px rgba(139, 92, 246, 0.2)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.25)",
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
