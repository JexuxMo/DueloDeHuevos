/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   
  ],
  theme: {
    extend: {
      keyframes: {
        mosaicBackground: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '12rem -19.2rem' },
        },
      },
      animation: {
        'mosaic-background': 'mosaicBackground 40s linear infinite',
      },
    },
  },
  plugins: [],
}


