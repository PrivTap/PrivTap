/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'purple': '#3f3cbb',
        'midnight': '#0f172a',
        'metal': '#565584',
        'tahiti': '#3ab7bf',
        'silver': '#ecebff',
        'grey': '#8B858F',
        'bermuda': '#78dcca',
        'black': '#232323',
        'darkGrey': '#363636',
        'lightBlue': '#1E85FF',
        'darkBlue': '#004F72',
      },
    },
  },
  plugins: [],
}
