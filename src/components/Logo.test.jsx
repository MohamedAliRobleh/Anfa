import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

test.each([
  ['full-color', '/img/anfa-logo-full-color.svg'],
  ['full-white', '/img/anfa-logo-full-white.svg'],
  ['full-dark', '/img/anfa-logo-full-dark.svg'],
  ['compact', '/img/anfa-logo-compact.svg'],
])('variant %s maps to %s', (variant, expectedSrc) => {
  render(<Logo variant={variant} />)
  const img = screen.getByAltText('Anfa Counselling & Psychotherapy')
  expect(img).toHaveAttribute('src', expectedSrc)
})
