import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { ContactForm } from './ContactForm'
import * as supabaseClient from '../lib/supabaseClient'
import * as email from '../lib/email'

vi.mock('../lib/supabaseClient')
vi.mock('../lib/email')

test('submits name/email/subject/message, inserts message, sends notification', async () => {
  localStorage.clear()
  supabaseClient.insertMessage.mockResolvedValue()
  email.sendContactNotification.mockResolvedValue()

  // The form rejects submits filled out faster than MIN_FILL_MS (a bot
  // heuristic). Control Date.now() so this test's near-instant fireEvent
  // calls don't themselves get flagged as bot-speed.
  let now = 1700000000000
  const dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now)

  render(<I18nProvider><ContactForm /></I18nProvider>)
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Question about fees' } })
  fireEvent.change(screen.getByLabelText(/^message/i), { target: { value: 'Hello there' } })
  now += 3000
  fireEvent.click(screen.getByRole('button', { name: /send/i }))

  await waitFor(() => expect(supabaseClient.insertMessage).toHaveBeenCalledTimes(1))
  expect(email.sendContactNotification).toHaveBeenCalledTimes(1)

  dateNowSpy.mockRestore()
})

test('honeypot filled: no insert, no email, still shows success', async () => {
  localStorage.clear()
  supabaseClient.insertMessage.mockResolvedValue()
  email.sendContactNotification.mockResolvedValue()

  render(<I18nProvider><ContactForm /></I18nProvider>)
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Bot' } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'bot@example.com' } })
  fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'x' } })
  fireEvent.change(screen.getByLabelText(/^message/i), { target: { value: 'x' } })
  fireEvent.change(screen.getByTestId('contact-honeypot'), { target: { value: 'filled' } })
  fireEvent.click(screen.getByRole('button', { name: /send/i }))

  await waitFor(() => expect(screen.getByText(/thank you/i)).toBeInTheDocument())
  expect(supabaseClient.insertMessage).not.toHaveBeenCalled()
  expect(email.sendContactNotification).not.toHaveBeenCalled()
})
