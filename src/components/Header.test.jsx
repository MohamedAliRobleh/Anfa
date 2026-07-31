import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import { Header } from './Header'

test('renders nav links and booking CTA', () => {
  render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: /Book a free 15-minute consultation/i })).toHaveAttribute('href', '/booking')
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
  const logo = container.querySelector('img[src="/img/anfa-logo-full-color.svg"]')
  expect(logo).toHaveClass('h-24')

  Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
  window.dispatchEvent(new Event('scroll'))

  expect(logo).toHaveClass('h-24')
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
  expect(home).toHaveClass('text-sea-deep')
  expect(home).not.toHaveClass('after:w-full')

  expect(contact).toHaveClass('hover:bg-lavender-soft')
  expect(contact).not.toHaveClass('bg-lavender-soft')
})
