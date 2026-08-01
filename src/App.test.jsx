import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('renders header nav and default home stub at /', async () => {
  render(<App initialEntries={['/']} />)
  expect(await screen.findByRole('link', { name: 'Home' })).toBeInTheDocument()
})

test('clicking a link to the page already open scrolls back to top', async () => {
  render(<App initialEntries={['/']} />)
  const homeLink = await screen.findByRole('link', { name: 'Home' })
  const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

  fireEvent.click(homeLink)

  expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  scrollToSpy.mockRestore()
})

test('clicking a link to a different page does not trigger the same-page scroll', async () => {
  render(<App initialEntries={['/']} />)
  const contactLink = await screen.findByRole('link', { name: 'Contact' })
  const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

  fireEvent.click(contactLink)

  expect(scrollToSpy).not.toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  scrollToSpy.mockRestore()
})
