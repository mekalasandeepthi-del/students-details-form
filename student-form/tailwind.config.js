/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {

      colors: {
        primary: "#6366F1",
        secondary: "#EC4899",
        accent: "#22C55E",
        sunset: "#F97316",
        ocean: "#0EA5E9",
        neon: "#A855F7"
      },

      fontFamily: {
        fun: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,0.7)",
        neon: "0 0 10px rgba(168,85,247,0.9)"
      },

      animation: {
        float: "float 3s ease-in-out infinite",
        bounceSlow: "bounce 3s infinite"
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }

    },
  },
  plugins: [],
};