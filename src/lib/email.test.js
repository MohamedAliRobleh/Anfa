import { vi, beforeEach } from 'vitest'
import { sendBookingConfirmation, sendContactNotification } from './email'

beforeEach(() => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) }))
})

test('sendBookingConfirmation posts to /api/send-email with type "booking" and the payload', async () => {
  await sendBookingConfirmation({ fullName: 'Jane Doe', email: 'jane@example.com', service: 'individual' })
  expect(fetch).toHaveBeenCalledWith('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'booking',
      payload: { fullName: 'Jane Doe', email: 'jane@example.com', service: 'individual' },
    }),
  })
})

test('sendContactNotification posts to /api/send-email with type "contact" and the payload', async () => {
  await sendContactNotification({ fullName: 'Jane Doe', email: 'jane@example.com', subject: 'Question', message: 'Hi' })
  expect(fetch).toHaveBeenCalledWith('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'contact',
      payload: { fullName: 'Jane Doe', email: 'jane@example.com', subject: 'Question', message: 'Hi' },
    }),
  })
})

test('throws when the API responds with a non-ok status', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: false }))
  await expect(sendContactNotification({ fullName: 'Jane Doe', email: 'jane@example.com' })).rejects.toThrow()
})
