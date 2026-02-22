/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A2342',
        },
        gold: {
          400: '#FFD700',
        }
      }
    },
  },
  plugins: [],
}

