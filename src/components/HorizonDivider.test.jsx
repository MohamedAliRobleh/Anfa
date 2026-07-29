import { render } from '@testing-library/react'
import { HorizonDivider } from './HorizonDivider'

test('renders an svg with role img', () => {
  const { container } = render(<HorizonDivider />)
  expect(container.querySelector('svg')).toBeInTheDocument()
})
