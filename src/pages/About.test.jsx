import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import About from './About'

test('renders About heading and RSW credential', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><About /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByText(/825579/)).toBeInTheDocument()
})
