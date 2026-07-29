import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { LanguageToggle } from './LanguageToggle'

test('toggles language between EN and FR', () => {
  render(<I18nProvider><LanguageToggle /></I18nProvider>)
  const frButton = screen.getByRole('button', { name: /FR/i })
  fireEvent.click(frButton)
  expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument()
})
