import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Resources from './Resources'

test('renders crisis resources with 988', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Resources /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getAllByText(/988/).length).toBeGreaterThan(0)
})
