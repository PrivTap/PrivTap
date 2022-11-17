/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {

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
      'grey2': '#363636',
      'blue2': '#1E85FF',
      'blue3': '#004F72',
    },



    extend: {
    },
  },
  plugins: [],
}
