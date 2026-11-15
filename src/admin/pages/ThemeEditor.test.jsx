import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'

const { fetchSiteThemeMock, saveSiteThemeMock, resetSiteThemeMock } = vi.hoisted(() => ({
  fetchSiteThemeMock: vi.fn(() => Promise.resolve(null)),
  saveSiteThemeMock: vi.fn(() => Promise.resolve()),
  resetSiteThemeMock: vi.fn(() => Promise.resolve()),
}))

vi.mock('../../lib/themeOverrides', () => ({
  fetchSiteTheme: fetchSiteThemeMock,
  saveSiteTheme: saveSiteThemeMock,
  resetSiteTheme: resetSiteThemeMock,
}))

import ThemeEditor from './ThemeEditor'
import { COLOR_PRESETS, FONT_PRESETS, DEFAULT_COLORS, DEFAULT_FONTS } from '../themePresets'

function renderEditor() {
  return render(
    <HelmetProvider>
      <ThemeEditor />
    </HelmetProvider>
  )
}

beforeEach(() => {
  fetchSiteThemeMock.mockClear()
  saveSiteThemeMock.mockClear()
  resetSiteThemeMock.mockClear()
  fetchSiteThemeMock.mockResolvedValue(null)
  saveSiteThemeMock.mockResolvedValue(undefined)
  resetSiteThemeMock.mockResolvedValue(undefined)
})

test('loads the current theme on mount and renders every curated preset', async () => {
  renderEditor()

  await waitFor(() => expect(fetchSiteThemeMock).toHaveBeenCalledTimes(1))

  for (const preset of COLOR_PRESETS) {
    expect(screen.getByText(preset.name)).toBeInTheDocument()
  }
  for (const preset of FONT_PRESETS) {
    expect(screen.getByText(preset.name)).toBeInTheDocument()
  }

  // Nothing was ever saved, so the first (default) palette/pairing reads as selected.
  expect(screen.getByRole('button', { name: new RegExp(COLOR_PRESETS[0].name) })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})

test('selecting a different palette and font pairing updates the selection without crashing', async () => {
  renderEditor()
  await waitFor(() => expect(fetchSiteThemeMock).toHaveBeenCalledTimes(1))

  const lavenderPreset = COLOR_PRESETS.find((p) => p.id === 'lavande-sereine')
  const lavenderButton = screen.getByRole('button', { name: new RegExp(lavenderPreset.name) })
  fireEvent.click(lavenderButton)
  expect(lavenderButton).toHaveAttribute('aria-pressed', 'true')

  const playfairPreset = FONT_PRESETS.find((p) => p.id === 'playfair-inter')
  const playfairButton = screen.getByRole('button', { name: new RegExp(playfairPreset.name) })
  fireEvent.click(playfairButton)
  expect(playfairButton).toHaveAttribute('aria-pressed', 'true')
})

test('opening the advanced section exposes a color picker for every role, seeded from the current colors', async () => {
  renderEditor()
  await waitFor(() => expect(fetchSiteThemeMock).toHaveBeenCalledTimes(1))

  fireEvent.click(screen.getByRole('button', { name: /Avancé/i }))

  const mainColorPicker = screen.getByLabelText('Couleur principale — boutons et liens')
  expect(mainColorPicker).toHaveAttribute('type', 'color')
})

test('clicking "Enregistrer" saves the currently selected colors and fonts', async () => {
  renderEditor()
  await waitFor(() => expect(fetchSiteThemeMock).toHaveBeenCalledTimes(1))

  fireEvent.click(screen.getByRole('button', { name: /Enregistrer et appliquer sur le site/i }))

  await waitFor(() =>
    expect(saveSiteThemeMock).toHaveBeenCalledWith({ colors: DEFAULT_COLORS, fonts: DEFAULT_FONTS })
  )
  expect(await screen.findByRole('status')).toHaveTextContent(/enregistré/i)
})

test('shows a friendly French error if saving fails', async () => {
  saveSiteThemeMock.mockRejectedValueOnce(new Error('network down'))
  renderEditor()
  await waitFor(() => expect(fetchSiteThemeMock).toHaveBeenCalledTimes(1))

  fireEvent.click(screen.getByRole('button', { name: /Enregistrer et appliquer sur le site/i }))

  expect(await screen.findByRole('status')).toHaveTextContent(/erreur/i)
})

test('clicking "Réinitialiser" calls resetSiteTheme and restores the built-in defaults', async () => {
  renderEditor()
  await waitFor(() => expect(fetchSiteThemeMock).toHaveBeenCalledTimes(1))

  fireEvent.click(screen.getByRole('button', { name: /Réinitialiser aux couleurs et polices d'origine/i }))

  await waitFor(() => expect(resetSiteThemeMock).toHaveBeenCalledTimes(1))
  expect(await screen.findByRole('status')).toHaveTextContent(/restaurées/i)
})

test('preselects the matching preset when a saved custom theme is loaded', async () => {
  fetchSiteThemeMock.mockResolvedValue({
    colors: COLOR_PRESETS.find((p) => p.id === 'sauge-apaisante').colors,
    fonts: FONT_PRESETS.find((p) => p.id === 'lora-nunito').fonts,
  })
  renderEditor()

  await waitFor(() =>
    expect(screen.getByRole('button', { name: /Sauge apaisante/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  )
  expect(screen.getByRole('button', { name: /Lora & Nunito Sans/ })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
})
