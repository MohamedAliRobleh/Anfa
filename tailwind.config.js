/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sea: '#9C8FCB',
        'sea-deep': '#7A6BA8',
        sunlit: '#DDB067',
        lavender: {
          DEFAULT: '#9C8FCB',
          ink: '#7A6BA8',
          soft: '#EDE9F7',
          wash: '#F3F0FA',
        },
        mist: '#EAE6F5',
        sand: '#F7F4ED',
        ink: '#1C2926',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Hanken Grotesk"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
