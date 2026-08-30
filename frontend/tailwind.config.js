/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal (backgrounds/text) + amber (accent) — reads as a
        // photography/film brand instead of default Tailwind blue.
        ink: {
          50: "#f6f6f5",
          100: "#e7e6e3",
          200: "#c9c7c1",
          300: "#a6a39a",
          400: "#7c7870",
          500: "#5a5750",
          600: "#3f3d38",
          700: "#2c2a26",
          800: "#1d1c19",
          900: "#121110",
          950: "#0a0908",
        },
        amber: {
          50: "#fdf6ec",
          100: "#f9e6c4",
          200: "#f3d097",
          300: "#ecb865",
          400: "#e2a13c",
          500: "#c9822a",
          600: "#a56621",
          700: "#7d4d1a",
          800: "#573515",
          900: "#33200e",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}