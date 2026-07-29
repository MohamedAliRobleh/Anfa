import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nProvider'
import { BookingWizard } from './BookingWizard'
import * as supabaseClient from '../lib/supabaseClient'
import * as email from '../lib/email'

vi.mock('../lib/supabaseClient')
vi.mock('../lib/email')

function fillHappyPath() {
  fireEvent.click(screen.getByRole('button', { name: /individual/i }))
  fireEvent.click(screen.getByRole('button', { name: /in-person/i }))
  fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-08-01' } })
  fireEvent.click(screen.getByRole('button', { name: '11:00' }))
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '6135551234' } })
  fireEvent.click(screen.getByLabelText(/consent/i))
}

test('honeypot filled: shows success but never calls Supabase or EmailJS', async () => {
  localStorage.clear()
  supabaseClient.insertBooking.mockResolvedValue()
  email.sendBookingConfirmation.mockResolvedValue()

  render(<I18nProvider><BookingWizard /></I18nProvider>)
  fillHappyPath()
  fireEvent.change(screen.getByTestId('booking-honeypot'), { target: { value: 'bot' } })
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => expect(screen.getByText(/thank you/i)).toBeInTheDocument())
  expect(supabaseClient.insertBooking).not.toHaveBeenCalled()
  expect(email.sendBookingConfirmation).not.toHaveBeenCalled()
})

test('happy path: inserts booking and sends confirmation email', async () => {
  localStorage.clear()
  supabaseClient.insertBooking.mockResolvedValue()
  email.sendBookingConfirmation.mockResolvedValue()

  // The wizard rejects submits filled out faster than MIN_FILL_MS (a bot
  // heuristic). Control Date.now() so this test's near-instant fireEvent
  // calls don't themselves get flagged as bot-speed.
  let now = 1700000000000
  const dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now)

  render(<I18nProvider><BookingWizard /></I18nProvider>)
  fillHappyPath()
  now += 3000
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => expect(supabaseClient.insertBooking).toHaveBeenCalledTimes(1))
  expect(email.sendBookingConfirmation).toHaveBeenCalledTimes(1)
  const [insertedPayload] = supabaseClient.insertBooking.mock.calls[0]
  expect(insertedPayload).not.toHaveProperty('diagnosis')
  expect(insertedPayload).not.toHaveProperty('symptoms')

  dateNowSpy.mockRestore()
})
