/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: 'rgba(11, 13, 14, 1)', // or "#0B0D0E"
        navbg : 'rgba(0, 0, 0, 1)', // or "rgba(15, 17, 18, 0.95)"
        navfont: 'rgba(200, 198, 198, 1)',
      },
    },
  },
  plugins: [],
}
