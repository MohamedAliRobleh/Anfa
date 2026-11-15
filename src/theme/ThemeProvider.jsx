import { useEffect } from 'react'
import { fetchSiteTheme } from '../lib/themeOverrides'

// Maps each theme color key to the CSS variable it controls (see the
// defaults in src/index.css and tailwind.config.js, which read these same
// variables). Values are "R G B" strings, matching Tailwind's
// rgb(var(--x) / <alpha-value>) pattern.
const COLOR_VARS = {
  sea: '--color-sea',
  seaDeep: '--color-sea-deep',
  sunlit: '--color-sunlit',
  lavender: '--color-lavender',
  lavenderInk: '--color-lavender-ink',
  lavenderSoft: '--color-lavender-soft',
  lavenderWash: '--color-lavender-wash',
  mist: '--color-mist',
  sand: '--color-sand',
  ink: '--color-ink',
}

let fontLinkEl = null

export function applyColors(colors) {
  if (!colors) return
  const root = document.documentElement.style
  for (const [key, cssVar] of Object.entries(COLOR_VARS)) {
    const value = colors[key]
    if (value) root.setProperty(cssVar, value)
  }
}

export function applyFonts(fonts) {
  if (!fonts) return
  const root = document.documentElement.style
  if (fonts.displayCss) root.setProperty('--font-display', fonts.displayCss)
  if (fonts.bodyCss) root.setProperty('--font-body', fonts.bodyCss)

  // Load the Google Fonts stylesheet for the chosen pairing, if any.
  if (fonts.googleFontsHref) {
    if (!fontLinkEl) {
      fontLinkEl = document.createElement('link')
      fontLinkEl.rel = 'stylesheet'
      document.head.appendChild(fontLinkEl)
    }
    if (fontLinkEl.href !== fonts.googleFontsHref) {
      fontLinkEl.href = fonts.googleFontsHref
    }
  }
}

// Mount once near the root of the real app (see src/App.jsx). Applies the
// admin's chosen colors/fonts as CSS custom properties on <html> as soon as
// they load; until then (or if nothing was ever saved, or Supabase is
// unreachable) the defaults baked into src/index.css are what renders, so
// the premium look is never at risk of a half-applied or broken theme.
export function ThemeProvider({ children }) {
  useEffect(() => {
    fetchSiteTheme().then((theme) => {
      if (!theme) return
      applyColors(theme.colors)
      applyFonts(theme.fonts)
    })
  }, [])

  return children
}
