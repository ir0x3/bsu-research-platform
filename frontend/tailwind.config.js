/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 🔥 مهم جدًا

  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        // 🎓 ألوان الجامعة
        bsu: {
          blue: "#0B3A6A",
          gold: "#D4AF37"
        },

        // 🔥 الألوان المرتبطة بالـ CSS variables
        bg: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)"
      },

      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.08)"
      },

      animation: {
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "in": "fadeIn 1s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      },

      transitionDelay: {
        "1000": "1000ms"
      }
    }
  },

  plugins: []
};