import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Emergency from './Emergency'

test('renders emergency heading and tel links for 911, 988, and the Ottawa Distress Centre', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Emergency /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByText('911').closest('a')).toHaveAttribute('href', 'tel:911')
  expect(screen.getByText(/988/).closest('a')).toHaveAttribute('href', 'tel:988')
  expect(screen.getByText(/613-238-3311/).closest('a')).toHaveAttribute('href', 'tel:+16132383311')
})

test('includes the resource organization links from the Resources page', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Emergency /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByText('Canadian Mental Health Association').closest('a')).toHaveAttribute('href', 'https://cmha.ca')
  expect(screen.getByText('Distress and Crisis Ontario')).toBeInTheDocument()
})
