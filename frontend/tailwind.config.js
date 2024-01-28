import { url } from 'inspector';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'fondo-EB': url('/img/fondo EB.png')
      }

    },
  },
  plugins: [],
}

