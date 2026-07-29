import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from './I18nProvider'
import { useTranslation } from './useTranslation'

function Probe() {
  const { t, lang, setLang } = useTranslation()
  return (
    <div>
      <span data-testid="text">{t('common.cta.bookFree')}</span>
      <span data-testid="lang">{lang}</span>
      <span data-testid="missing">{t('nope.nope')}</span>
      <button onClick={() => setLang('fr')}>switch</button>
    </div>
  )
}

test('t() resolves nested keys and setLang switches language, persisting to localStorage', () => {
  localStorage.clear()
  render(<I18nProvider><Probe /></I18nProvider>)
  expect(screen.getByTestId('text').textContent).toBe('Book a free 15-minute consultation')
  expect(screen.getByTestId('lang').textContent).toBe('en')
  expect(screen.getByTestId('missing').textContent).toBe('nope.nope')

  fireEvent.click(screen.getByText('switch'))
  expect(screen.getByTestId('lang').textContent).toBe('fr')
  expect(screen.getByTestId('text').textContent).toBe('Réserver une consultation gratuite de 15 min')
  expect(localStorage.getItem('anfa-lang')).toBe('fr')
})
