import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

test.each([
  ['full-color', '/img/anfa-logo-full-color.svg'],
  ['compact', '/img/anfa-logo-compact.svg'],
])('variant %s maps to %s', (variant, expectedSrc) => {
  render(<Logo variant={variant} />)
  const img = screen.getByAltText('Anfa Counselling & Psychotherapy')
  expect(img).toHaveAttribute('src', expectedSrc)
})
