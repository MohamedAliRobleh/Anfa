import { render, screen } from '@testing-library/react'
import App from './App'

test('renders header nav and default home stub at /', async () => {
  render(<App initialEntries={['/']} />)
  expect(await screen.findByRole('link', { name: 'Home' })).toBeInTheDocument()
})
