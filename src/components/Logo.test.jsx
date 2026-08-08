import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

test.each([
  ['icon', '/img/lotus-icon.png'],
])('variant %s maps to %s', (variant, expectedSrc) => {
  render(<Logo variant={variant} />)
  const img = screen.getByAltText('Anfa Counselling & Psychotherapy')
  expect(img).toHaveAttribute('src', expectedSrc)
})

test('alt prop overrides the default accessible name', () => {
  const { container } = render(<Logo variant="icon" alt="" />)
  const img = container.querySelector('img')
  expect(img).toHaveAttribute('src', '/img/lotus-icon.png')
  expect(img).toHaveAttribute('alt', '')
})
