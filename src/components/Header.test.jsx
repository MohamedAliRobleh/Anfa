import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import { Header } from './Header'

test('renders nav links, no booking CTA in the header', () => {
  render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(screen.queryByRole('link', { name: /Book a free 15-minute consultation/i })).not.toBeInTheDocument()
})

test('renders as a single header row, not two stacked bars', () => {
  const { container } = render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  const header = container.querySelector('header')
  expect(header.children).toHaveLength(1)
})

test('logo does not shrink when the page is scrolled', () => {
  const { container } = render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  const logo = container.querySelector('img[src="/img/lotus-icon.png"]')
  expect(logo).toHaveClass('xl:h-20')
  const classNameBeforeScroll = logo.className

  Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
  window.dispatchEvent(new Event('scroll'))

  expect(logo.className).toBe(classNameBeforeScroll)
})

test('renders the wordmark beside the icon in the home link', () => {
  render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  const homeLink = screen.getByRole('link', { name: 'Anfa Counselling & Psychotherapy home' })
  expect(homeLink).toHaveTextContent('Anfa Counselling')
  expect(homeLink).toHaveTextContent('and Psychotherapy')
})

test('active nav link shows a solid pill, inactive links show pill on hover', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  const home = screen.getByRole('link', { name: 'Home' })
  const contact = screen.getByRole('link', { name: 'Contact' })

  expect(home).toHaveClass('bg-lavender-soft')
  expect(home).toHaveClass('text-ink')
  expect(home).not.toHaveClass('after:w-full')

  expect(contact).toHaveClass('hover:bg-lavender-soft')
  expect(contact).not.toHaveClass('bg-lavender-soft')
})
