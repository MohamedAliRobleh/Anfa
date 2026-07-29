import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import { Header } from './Header'

test('renders nav links and booking CTA', () => {
  render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: /Book a free 15-minute consultation/i })).toHaveAttribute('href', '/booking')
})
