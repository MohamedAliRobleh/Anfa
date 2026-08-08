import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Resources from './Resources'

test('renders crisis resources with 988', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Resources /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getAllByText(/988/).length).toBeGreaterThan(0)
})

test('renders the extended support guide with working external links', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Resources /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { name: /Guide to Further Support/i })).toBeInTheDocument()
  const adaaLink = screen.getByRole('link', { name: /Anxiety & Depression Association of America/i })
  expect(adaaLink).toHaveAttribute('href', 'https://adaa.org/')
  expect(adaaLink).toHaveAttribute('target', '_blank')
  expect(adaaLink).toHaveAttribute('rel', 'noopener noreferrer')
})
