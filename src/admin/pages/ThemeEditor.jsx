import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchSiteTheme, saveSiteTheme, resetSiteTheme } from '../../lib/themeOverrides'
import { applyColors, applyFonts } from '../../theme/ThemeProvider'
import { ThemePreview } from '../components/ThemePreview'
import {
  COLOR_PRESETS,
  FONT_PRESETS,
  COLOR_ROLES,
  DEFAULT_COLORS,
  DEFAULT_FONTS,
  ALL_FONT_PREVIEW_HREF,
  hexToRgbTriplet,
  rgbTripletToHex,
} from '../themePresets'

function colorsEqual(a, b) {
  if (!a || !b) return false
  return COLOR_ROLES.every((role) => a[role.key] === b[role.key])
}

function fontsEqual(a, b) {
  if (!a || !b) return false
  return a.displayCss === b.displayCss && a.bodyCss === b.bodyCss
}

function findMatchingColorPresetId(colors) {
  return COLOR_PRESETS.find((preset) => colorsEqual(preset.colors, colors))?.id ?? null
}

function findMatchingFontPresetId(fonts) {
  return FONT_PRESETS.find((preset) => fontsEqual(preset.fonts, fonts))?.id ?? null
}

function CheckBadge() {
  return (
    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-sea-deep text-sand">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.4 7.4a1 1 0 0 1-1.4 0L3.3 9.5a1 1 0 1 1 1.4-1.4l3.6 3.6 6.7-6.7a1 1 0 0 1 1.4 0Z" />
      </svg>
    </span>
  )
}

export default function ThemeEditor() {
  const [loading, setLoading] = useState(true)
  const [colors, setColors] = useState(DEFAULT_COLORS)
  const [fonts, setFonts] = useState(DEFAULT_FONTS)
  const [colorPresetId, setColorPresetId] = useState(COLOR_PRESETS[0].id)
  const [fontPresetId, setFontPresetId] = useState(FONT_PRESETS[0].id)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    let active = true
    fetchSiteTheme().then((theme) => {
      if (!active) return
      const nextColors = theme?.colors || DEFAULT_COLORS
      const nextFonts = theme?.fonts || DEFAULT_FONTS
      const matchedColorPresetId = findMatchingColorPresetId(nextColors)
      const matchedFontPresetId = findMatchingFontPresetId(nextFonts)

      setColors(nextColors)
      setFonts(nextFonts)
      setColorPresetId(matchedColorPresetId ?? 'custom')
      setFontPresetId(matchedFontPresetId ?? FONT_PRESETS[0].id)
      if (!matchedColorPresetId) setAdvancedOpen(true)

      // Re-apply explicitly so the live preview is correct even if this
      // page mounted before the app-root ThemeProvider's own fetch resolved.
      applyColors(nextColors)
      applyFonts(nextFonts)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  function handleSelectColorPreset(preset) {
    setColorPresetId(preset.id)
    setColors(preset.colors)
    applyColors(preset.colors)
    setStatus(null)
  }

  function handleSelectFontPreset(preset) {
    setFontPresetId(preset.id)
    setFonts(preset.fonts)
    applyFonts(preset.fonts)
    setStatus(null)
  }

  function handleCustomColorChange(roleKey, hexValue) {
    const nextColors = { ...colors, [roleKey]: hexToRgbTriplet(hexValue) }
    setColors(nextColors)
    setColorPresetId('custom')
    applyColors(nextColors)
    setStatus(null)
  }

  async function handleSave() {
    setSaving(true)
    setStatus(null)
    try {
      await saveSiteTheme({ colors, fonts })
      setStatus({
        type: 'success',
        message: 'Saved. These colors and fonts are now visible on the site.',
      })
    } catch {
      setStatus({
        type: 'error',
        message: 'Something went wrong: saving failed. Check your connection and try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    setResetting(true)
    setStatus(null)
    try {
      await resetSiteTheme()
      setColors(DEFAULT_COLORS)
      setFonts(DEFAULT_FONTS)
      setColorPresetId(findMatchingColorPresetId(DEFAULT_COLORS) ?? 'custom')
      setFontPresetId(findMatchingFontPresetId(DEFAULT_FONTS) ?? FONT_PRESETS[0].id)
      applyColors(DEFAULT_COLORS)
      applyFonts(DEFAULT_FONTS)
      setStatus({
        type: 'success',
        message: "The site's original colors and fonts have been restored.",
      })
    } catch {
      setStatus({
        type: 'error',
        message: 'Something went wrong: resetting failed. Please try again.',
      })
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Preloads every curated font pairing at once, purely so each font
          card below can render its own real-site sample in its actual
          typeface for comparison. The pairing that gets applied to the
          live site still goes through applyFonts() exactly as the public
          site does. */}
      <Helmet>
        <link rel="stylesheet" href={ALL_FONT_PREVIEW_HREF} />
      </Helmet>

      <h1 className="font-display text-2xl text-sea-deep">Colors &amp; fonts</h1>
      <p className="mt-2 max-w-2xl text-ink/60">
        Choose a color palette and a font pairing from the options below. You&rsquo;ll see the
        result immediately in the preview, and nothing is visible to your visitors until you
        click &ldquo;Save&rdquo;.
      </p>

      {status && (
        <p
          role="status"
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            status.type === 'success' ? 'bg-mist text-sea-deep' : 'bg-red-50 text-red-700'
          }`}
        >
          {status.message}
        </p>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
          Live preview
        </h2>
        <div className="mt-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-ink/5 sm:p-4">
          {loading ? (
            <p className="px-4 py-10 text-center text-sm text-ink/50">Loading…</p>
          ) : (
            <ThemePreview />
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
          Color palettes
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Each palette was designed to stay elegant and easy to read. Click the one you like.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = colorPresetId === preset.id
            const swatchKeys = ['sea', 'sunlit', 'lavender', 'sand']
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectColorPreset(preset)}
                className={`relative rounded-2xl bg-white p-4 text-left shadow-sm ring-1 transition-shadow duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-sea-deep' : 'ring-ink/10'
                }`}
              >
                {isSelected && <CheckBadge />}
                <div className="flex gap-1.5">
                  {swatchKeys.map((key) => (
                    <span
                      key={key}
                      className="h-7 w-7 rounded-full ring-1 ring-ink/10"
                      style={{ backgroundColor: `rgb(${preset.colors[key]})` }}
                    />
                  ))}
                </div>
                <p className="mt-3 font-display text-base text-ink">{preset.name}</p>
                <p className="mt-1 text-sm text-ink/60">{preset.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Fonts</h2>
        <p className="mt-1 text-sm text-ink/60">
          Choose the font pairing (headings + body text) that suits you, by looking directly at
          the example.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FONT_PRESETS.map((preset) => {
            const isSelected = fontPresetId === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectFontPreset(preset)}
                className={`relative rounded-2xl bg-white p-4 text-left shadow-sm ring-1 transition-shadow duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-sea-deep' : 'ring-ink/10'
                }`}
              >
                {isSelected && <CheckBadge />}
                <p className="text-xl text-ink" style={{ fontFamily: preset.fonts.displayCss }}>
                  You deserve a space where you are truly heard.
                </p>
                <p className="mt-2 text-sm text-ink/70" style={{ fontFamily: preset.fonts.bodyCss }}>
                  At Anfa, therapeutic support happens at your own pace.
                </p>
                <p className="mt-3 text-sm font-semibold text-ink">{preset.name}</p>
                <p className="mt-0.5 text-sm text-ink/60">{preset.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-10">
        <button
          type="button"
          aria-expanded={advancedOpen}
          onClick={() => setAdvancedOpen((open) => !open)}
          className="flex items-center gap-2 text-sm font-semibold text-sea-deep hover:underline"
        >
          <span aria-hidden="true">{advancedOpen ? '▾' : '▸'}</span>
          Advanced: adjust each color individually
        </button>

        {advancedOpen && (
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
            {colorPresetId === 'custom' && (
              <p className="mb-4 text-sm text-ink/60">
                You are currently using a custom color combination.
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {COLOR_ROLES.map((role) => (
                <label key={role.key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={rgbTripletToHex(colors[role.key])}
                    onChange={(event) => handleCustomColorChange(role.key, event.target.value)}
                    className="h-10 w-10 flex-none cursor-pointer rounded-lg border border-ink/15"
                    aria-label={role.label}
                  />
                  <span className="text-sm">
                    <span className="block font-semibold text-ink">{role.label}</span>
                    <span className="block text-ink/50">{role.helper}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-sea-deep px-6 py-2.5 font-semibold text-sand transition-colors duration-300 hover:bg-sea disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save and apply to the site'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="rounded-full px-5 py-2.5 font-semibold text-ink/60 transition-colors duration-300 hover:text-ink disabled:opacity-60"
        >
          {resetting ? 'Resetting…' : 'Reset to original colors and fonts'}
        </button>
      </section>
    </div>
  )
}
