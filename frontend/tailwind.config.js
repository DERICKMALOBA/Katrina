/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryOrange: '#fc8414',
        primaryBlue: '#307bb5',
        primaryGreen: '#68ad00',
        primaryRed: '#ff2121', // Corrected hex value
        primaryBlack: '#1f2121', // Corrected hex value for primaryBlack
      },
    },
  },
  plugins: [],
}
