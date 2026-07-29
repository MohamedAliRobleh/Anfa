import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Blog from './Blog'

test('renders 3 blog post cards linking to their slugs', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><Blog /></I18nProvider></MemoryRouter></HelmetProvider>)
  const links = screen.getAllByRole('link')
  expect(links.some((l) => l.getAttribute('href') === '/blog/managing-anxiety')).toBe(true)
  expect(links.some((l) => l.getAttribute('href') === '/blog/couple-therapy')).toBe(true)
  expect(links.some((l) => l.getAttribute('href') === '/blog/navigating-grief')).toBe(true)
})
