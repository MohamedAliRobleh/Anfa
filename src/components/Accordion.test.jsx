import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion } from './Accordion'

test('toggles answer visibility on question click', () => {
  render(<Accordion items={[{ id: 'a1', question: 'Q1?', answer: 'A1.' }]} />)
  expect(screen.queryByText('A1.')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Q1?' }))
  expect(screen.getByText('A1.')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Q1?' })).toHaveAttribute('aria-expanded', 'true')
})
