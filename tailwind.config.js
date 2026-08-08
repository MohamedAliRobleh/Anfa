/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sea: '#0E7A85',
        'sea-deep': '#085F68',
        sunlit: '#5F5E82',
        lavender: {
          DEFAULT: '#8584AA',
          ink: '#5F5E82',
          soft: '#E9E8F0',
          wash: '#F2F1F6',
        },
        mist: '#E1EFEC',
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
