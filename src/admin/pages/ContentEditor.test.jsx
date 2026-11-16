import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContentEditor from './ContentEditor'
import * as contentOverrides from '../../lib/contentOverrides'

vi.mock('../../lib/contentOverrides')

beforeEach(() => {
  contentOverrides.fetchContentOverrides.mockResolvedValue({})
  contentOverrides.saveContentOverride.mockResolvedValue()
  contentOverrides.resetContentOverride.mockResolvedValue()
})

function searchFor(text) {
  fireEvent.change(screen.getByPlaceholderText(/search for text/i), { target: { value: text } })
}

test('renders without crashing and shows the page title once loaded', async () => {
  render(<ContentEditor />)
  expect(await screen.findByText('Site text')).toBeInTheDocument()
})

test('shows a field pre-filled with its built-in default text', async () => {
  render(<ContentEditor />)
  await screen.findByText('Site text')

  searchFor('tagline')

  const frInput = await screen.findByLabelText(/french text/i)
  const enInput = screen.getByLabelText(/english text/i)
  expect(frInput.value).toBe('Guérir au rythme de la nature')
  expect(enInput.value).toBe("Healing at nature's pace")

  // Untouched field: no save/reset actions shown yet.
  expect(screen.queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument()
  expect(screen.queryByText(/custom text/i)).not.toBeInTheDocument()
})

test('editing a field and saving calls saveContentOverride with the new text', async () => {
  render(<ContentEditor />)
  await screen.findByText('Site text')

  searchFor('tagline')
  const frInput = await screen.findByLabelText(/french text/i)

  fireEvent.change(frInput, { target: { value: 'Nouveau slogan' } })
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }))

  await waitFor(() =>
    expect(contentOverrides.saveContentOverride).toHaveBeenCalledWith('common.tagline', {
      valueFr: 'Nouveau slogan',
      valueEn: "Healing at nature's pace",
    })
  )
  expect(await screen.findByText(/^saved\.$/i)).toBeInTheDocument()
})

test('shows a friendly message, not a raw error, when saving fails', async () => {
  contentOverrides.saveContentOverride.mockRejectedValue(new Error('relation "content_overrides" does not exist'))
  render(<ContentEditor />)
  await screen.findByText('Site text')

  searchFor('tagline')
  const frInput = await screen.findByLabelText(/french text/i)
  fireEvent.change(frInput, { target: { value: 'Nouveau slogan' } })
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }))

  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toMatch(/something went wrong/i)
  expect(alert.textContent).not.toMatch(/relation|content_overrides/i)
})
