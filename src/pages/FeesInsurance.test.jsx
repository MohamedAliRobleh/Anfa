import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import FeesInsurance from './FeesInsurance'

test('renders pricing and payment methods', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><FeesInsurance /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByText(/170/)).toBeInTheDocument()
  expect(screen.getByText(/227/)).toBeInTheDocument()
  expect(screen.getByText(/Visa/)).toBeInTheDocument()
})
