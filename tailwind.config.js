/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: '#005872',
        darkBlue: '#13435C',
        lightBlue: '#96C8D4',
        blueDarken10: '#004F67',

        grey: '#E6E5E4',
        greyDarken10: '#CFCDCE',

      },

      fontFamily: {
        sans: 'Ropa Soft PTT',
        primary: 'Rooney Pro',
        secondary: 'Avenir Next Condensed',
      },
    },
  },
  plugins: [],
};
