import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Faq from './Faq'

test('renders all 7 FAQ questions', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Faq /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getAllByRole('button').length).toBe(7)
})
