import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Services from './Services'

test('renders all four service cards linking to booking', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Services /></I18nProvider></MemoryRouter></HelmetProvider>)
  const bookingLinks = screen.getAllByRole('link', { name: /book now/i })
  expect(bookingLinks.length).toBe(4)
  bookingLinks.forEach((l) => expect(l).toHaveAttribute('href', '/booking'))
  expect(screen.getByText(/170/)).toBeInTheDocument()
  expect(screen.getByText(/227/)).toBeInTheDocument()
})
