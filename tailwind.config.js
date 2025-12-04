/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#7E6FFE',
        'brand-green': '#92F0AA',
        'brand-dark': '#1a1a1a',
        'brand-white': '#ffffff',
        'brand-gray': '#EAEDF6',
      },
    },
  },
  plugins: [],
}
