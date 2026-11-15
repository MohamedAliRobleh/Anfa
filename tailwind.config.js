/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Each color reads a CSS variable (defined in src/index.css, and
        // overridable at runtime by src/theme/ThemeProvider.jsx) instead of a
        // fixed hex, so an admin-chosen palette applies everywhere this
        // token is used without a rebuild. <alpha-value> keeps bg-sea/10 etc. working.
        sea: 'rgb(var(--color-sea) / <alpha-value>)',
        'sea-deep': 'rgb(var(--color-sea-deep) / <alpha-value>)',
        sunlit: 'rgb(var(--color-sunlit) / <alpha-value>)',
        lavender: {
          DEFAULT: 'rgb(var(--color-lavender) / <alpha-value>)',
          ink: 'rgb(var(--color-lavender-ink) / <alpha-value>)',
          soft: 'rgb(var(--color-lavender-soft) / <alpha-value>)',
          wash: 'rgb(var(--color-lavender-wash) / <alpha-value>)',
        },
        mist: 'rgb(var(--color-mist) / <alpha-value>)',
        sand: 'rgb(var(--color-sand) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
      },
      fontFamily: {
        // Reads a CSS variable too, so a font pairing chosen in /admin can
        // swap these without a rebuild (see src/theme/ThemeProvider.jsx).
        display: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
        body: ['var(--font-body)', '"Hanken Grotesk"', 'Arial', 'sans-serif'],
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
