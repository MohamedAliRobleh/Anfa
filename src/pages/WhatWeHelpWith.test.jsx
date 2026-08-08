import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/I18nProvider'
import WhatWeHelpWith from './WhatWeHelpWith'

test('renders heading and all condition cards', () => {
  render(<HelmetProvider><MemoryRouter><I18nProvider><WhatWeHelpWith /></I18nProvider></MemoryRouter></HelmetProvider>)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Anxiety' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Children & Teens' })).toBeInTheDocument()
  expect(screen.getAllByText('Cognitive Behavioural Therapy (CBT)').length).toBeGreaterThan(0)
})
