/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <- this tells Tailwind to scan all your React files
  ],
  theme: {
    extend: {
       animation: {
        scaleFadeInSmooth: 'scaleFadeInSmooth 0.35s ease-out forwards',
        scaleFadeOutSmooth: 'scaleFadeOutSmooth 0.35s ease-in forwards',
      },
      keyframes: {
        scaleFadeInSmooth: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        scaleFadeOutSmooth: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
}
