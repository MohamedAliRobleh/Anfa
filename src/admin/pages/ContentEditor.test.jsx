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
  fireEvent.change(screen.getByPlaceholderText(/rechercher un texte/i), { target: { value: text } })
}

test('renders without crashing and shows the page title once loaded', async () => {
  render(<ContentEditor />)
  expect(await screen.findByText('Textes du site')).toBeInTheDocument()
})

test('shows a field pre-filled with its built-in default text', async () => {
  render(<ContentEditor />)
  await screen.findByText('Textes du site')

  searchFor('slogan')

  const frInput = await screen.findByLabelText(/texte en français/i)
  const enInput = screen.getByLabelText(/texte en anglais/i)
  expect(frInput.value).toBe('Guérir au rythme de la nature')
  expect(enInput.value).toBe("Healing at nature's pace")

  // Untouched field: no save/reset actions shown yet.
  expect(screen.queryByRole('button', { name: /enregistrer/i })).not.toBeInTheDocument()
  expect(screen.queryByText(/texte personnalisé/i)).not.toBeInTheDocument()
})

test('editing a field and saving calls saveContentOverride with the new text', async () => {
  render(<ContentEditor />)
  await screen.findByText('Textes du site')

  searchFor('slogan')
  const frInput = await screen.findByLabelText(/texte en français/i)

  fireEvent.change(frInput, { target: { value: 'Nouveau slogan' } })
  fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))

  await waitFor(() =>
    expect(contentOverrides.saveContentOverride).toHaveBeenCalledWith('common.tagline', {
      valueFr: 'Nouveau slogan',
      valueEn: "Healing at nature's pace",
    })
  )
  expect(await screen.findByText(/enregistré/i)).toBeInTheDocument()
})

test('shows a friendly French message, not a raw error, when saving fails', async () => {
  contentOverrides.saveContentOverride.mockRejectedValue(new Error('relation "content_overrides" does not exist'))
  render(<ContentEditor />)
  await screen.findByText('Textes du site')

  searchFor('slogan')
  const frInput = await screen.findByLabelText(/texte en français/i)
  fireEvent.change(frInput, { target: { value: 'Nouveau slogan' } })
  fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))

  const alert = await screen.findByRole('alert')
  expect(alert.textContent).toMatch(/une erreur est survenue/i)
  expect(alert.textContent).not.toMatch(/relation|content_overrides/i)
})
