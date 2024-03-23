/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005872',
        secondary: '#E6E5E4',
        primaryDark: '#13435C',
        accent: '#96C8D4',
      },

      fontFamily: {
        sans: 'Ropa Soft PTT',
        primary: 'RooneyPro Light',
        secondary: 'Avenir Next Condensed',
      },
    },
  },
  plugins: [],
};
