import { render, screen } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { CrisisResourceStrip } from './CrisisResourceStrip'

test('renders crisis resources with 911, 988 and Ottawa Distress Centre', () => {
  render(<I18nProvider><CrisisResourceStrip /></I18nProvider>)
  expect(screen.getByText(/911/)).toBeInTheDocument()
  expect(screen.getByText(/988/)).toBeInTheDocument()
  expect(screen.getByText(/613-238-3311/)).toBeInTheDocument()
})
