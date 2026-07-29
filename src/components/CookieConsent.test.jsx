import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { CookieConsent } from './CookieConsent'

test('shows banner, calls onAccept and persists choice on click, then hides', () => {
  localStorage.clear()
  const onAccept = vi.fn()
  render(<I18nProvider><CookieConsent onAccept={onAccept} /></I18nProvider>)
  expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument()
  expect(onAccept).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: /accept/i }))
  expect(onAccept).toHaveBeenCalledTimes(1)
  expect(localStorage.getItem('anfa-cookie-consent')).toBe('accepted')
  expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument()
})

test('does not render if already accepted', () => {
  localStorage.setItem('anfa-cookie-consent', 'accepted')
  const onAccept = vi.fn()
  render(<I18nProvider><CookieConsent onAccept={onAccept} /></I18nProvider>)
  expect(onAccept).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument()
})
