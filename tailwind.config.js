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
      fontSize: {
        xs: ['0.825rem', { lineHeight: '1.1rem' }],
        sm: ['0.9625rem', { lineHeight: '1.375rem' }],
        base: ['1.1rem', { lineHeight: '1.65rem' }],
        lg: ['1.2375rem', { lineHeight: '1.925rem' }],
        xl: ['1.375rem', { lineHeight: '1.925rem' }],
        '2xl': ['1.65rem', { lineHeight: '2.2rem' }],
        '3xl': ['2.0625rem', { lineHeight: '2.475rem' }],
        '4xl': ['2.475rem', { lineHeight: '2.75rem' }],
        '5xl': ['3.3rem', { lineHeight: '1.1' }],
        '6xl': ['4.125rem', { lineHeight: '1.1' }],
      },
    },
  },
  plugins: [],
}
