import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import NotFound from './NotFound'

test('renders 404 message and link home', () => {
  render(<MemoryRouter><I18nProvider><NotFound /></I18nProvider></MemoryRouter>)
  expect(screen.getByText(/404/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
})
