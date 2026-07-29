import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import BlogPost from './BlogPost'

test('renders the matching post title for the route slug', () => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/blog/managing-anxiety']}>
        <I18nProvider>
          <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
        </I18nProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

test('renders a not-found message for an unknown slug', () => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/blog/unknown-slug']}>
        <I18nProvider>
          <Routes><Route path="/blog/:slug" element={<BlogPost />} /></Routes>
        </I18nProvider>
      </MemoryRouter>
    </HelmetProvider>
  )
  expect(screen.getByText(/could not be found/i)).toBeInTheDocument()
})
