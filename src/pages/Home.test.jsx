import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nProvider } from '../i18n/I18nProvider'
import Home from './Home'

test('renders hero heading, tagline, and both CTAs', () => {
  render(
    <HelmetProvider>
      <MemoryRouter>
        <I18nProvider><Home /></I18nProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  // The "book free consultation" CTA appears twice by design: once in the
  // Hero and again in the FinalCta section.
  const bookingLinks = screen.getAllByRole('link', { name: /Book a free 15-minute consultation/i })
  expect(bookingLinks.length).toBe(2)
  bookingLinks.forEach((link) => expect(link).toHaveAttribute('href', '/booking'))
  expect(screen.getByRole('link', { name: /Discover our services/i })).toHaveAttribute('href', '/services')
  expect(screen.getAllByText(/Healing at nature's pace/i).length).toBeGreaterThan(0)
})
