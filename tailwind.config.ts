import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0F2E5A",
          "blue-light": "#1a4a8a",
          "blue-dark": "#0a1f3d",
          green: "#10B981",
          "green-light": "#34d399",
          "green-dark": "#059669",
          amber: "#F59E0B",
          "amber-light": "#fbbf24",
          "amber-dark": "#d97706",
        },
        surface: {
          DEFAULT: "#0d2348",
          muted: "#162f5c",
          card: "#1a3a6e",
          border: "#1e3d72",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0F2E5A 0%, #1a4a8a 100%)",
        "gradient-hero": "linear-gradient(135deg, #0a1f3d 0%, #0F2E5A 50%, #1a3a6e 100%)",
        "gradient-card": "linear-gradient(145deg, #1a3a6e 0%, #162f5c 100%)",
        "gradient-green": "linear-gradient(135deg, #059669 0%, #10B981 100%)",
        "gradient-amber": "linear-gradient(135deg, #d97706 0%, #F59E0B 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "flame": "flame 1.5s ease-in-out infinite alternate",
        "glow": "glow 2s ease-in-out infinite alternate",
        "progress": "progress 1s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        flame: {
          "0%": { transform: "scale(1) rotate(-3deg)" },
          "100%": { transform: "scale(1.1) rotate(3deg)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(245, 158, 11, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.8)" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "brand": "0 4px 24px rgba(15, 46, 90, 0.4)",
        "brand-lg": "0 8px 40px rgba(15, 46, 90, 0.6)",
        "green": "0 4px 20px rgba(16, 185, 129, 0.3)",
        "amber": "0 4px 20px rgba(245, 158, 11, 0.4)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
