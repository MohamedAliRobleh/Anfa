import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavDropdown } from './NavDropdown'

const linkBase = 'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-300'
const items = [['about', '/about'], ['approach', '/approach']]
const itemLabel = (key) => (key === 'about' ? 'About' : 'Our Approach')

test('inactive dropdown trigger shows pill on hover, not a solid pill at rest', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <NavDropdown label="About" items={items} linkBase={linkBase} itemLabel={itemLabel} />
    </MemoryRouter>
  )
  const trigger = screen.getByRole('button', { name: /About/ })
  expect(trigger).toHaveClass('hover:bg-lavender-soft')
  expect(trigger).not.toHaveClass('bg-lavender-soft')
})

test('active dropdown trigger shows a solid pill', () => {
  render(
    <MemoryRouter initialEntries={['/about']}>
      <NavDropdown label="About" items={items} linkBase={linkBase} itemLabel={itemLabel} />
    </MemoryRouter>
  )
  const trigger = screen.getByRole('button', { name: /About/ })
  expect(trigger).toHaveClass('bg-lavender-soft')
  expect(trigger).toHaveClass('text-ink')
})
