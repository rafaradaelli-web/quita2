/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8c3cf7",
          alt: "#b084ff",
          dark: "#5a1bd6",
          soft: "#d2beff",
          bg: "#0f0317",
          s1: "#1b0725",
          s2: "#250a31",
        }
      },
      borderRadius: { '2xl': "1.25rem" }
    },
  },
  plugins: [],
}
