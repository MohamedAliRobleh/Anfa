import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import SafetyPlan from './SafetyPlan'

test('renders the safety plan heading', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><SafetyPlan /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1, name: 'Safety Plan' })).toBeInTheDocument()
})
