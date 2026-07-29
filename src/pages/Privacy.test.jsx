import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Privacy from './Privacy'

test('renders privacy heading', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Privacy /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})
