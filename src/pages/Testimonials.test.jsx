import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import Testimonials from './Testimonials'

test('renders all demo testimonials', () => {
  const { container } = render(<HelmetProvider><MemoryRouter><I18nProvider><Testimonials /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(container.querySelectorAll('blockquote').length).toBe(3)
})
