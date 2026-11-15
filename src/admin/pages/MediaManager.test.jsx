import { vi } from 'vitest'

const { selectMock, fromMock } = vi.hoisted(() => {
  const selectMock = vi.fn(() => Promise.resolve({ data: [], error: null }))
  const fromMock = vi.fn(() => ({ select: selectMock }))
  return { selectMock, fromMock }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: fromMock,
    auth: { getUser: vi.fn(() => Promise.resolve({ data: { user: null } })) },
    storage: { from: vi.fn() },
  })),
}))

import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MediaOverridesProvider } from '../../media/MediaOverridesProvider'
import { MEDIA_SLOTS } from '../../content/mediaSlots'
import MediaManager from './MediaManager'

function renderMediaManager() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <MediaOverridesProvider>
          <MediaManager />
        </MediaOverridesProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
}

test('renders a card for every slot in MEDIA_SLOTS', async () => {
  renderMediaManager()
  await waitFor(() => expect(screen.getByText('Logo du site')).toBeInTheDocument())
  for (const slot of MEDIA_SLOTS) {
    expect(screen.getByText(slot.label)).toBeInTheDocument()
  }
})

test('shows the built-in default image when there is no override', async () => {
  selectMock.mockResolvedValueOnce({ data: [], error: null })
  renderMediaManager()
  await waitFor(() => expect(screen.getByText('Photo de Sahra')).toBeInTheDocument())
  const portrait = screen.getByAltText('Photo de Sahra')
  expect(portrait).toHaveAttribute('src', '/img/sahra-portrait.webp')
  // No "custom photo" badge and no reset action when nothing has been overridden.
  expect(screen.queryByText('Photo personnalisée')).not.toBeInTheDocument()
  expect(screen.queryByText('Réinitialiser à l’image d’origine')).not.toBeInTheDocument()
})

test('shows the saved override image and a reset action when one exists', async () => {
  selectMock.mockResolvedValueOnce({
    data: [{ slot_key: 'site.logo', url: 'https://example.com/custom-logo.png', alt_fr: null, alt_en: null }],
    error: null,
  })
  renderMediaManager()
  await waitFor(() => expect(screen.getByAltText('Logo du site')).toHaveAttribute('src', 'https://example.com/custom-logo.png'))
  expect(screen.getAllByText('Photo personnalisée').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Réinitialiser à l’image d’origine').length).toBeGreaterThan(0)
})
