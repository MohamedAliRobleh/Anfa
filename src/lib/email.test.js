import { vi } from 'vitest'

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn(() => Promise.resolve({ status: 200 })) }))
vi.mock('@emailjs/browser', () => ({ default: { send: sendMock } }))

import { sendBookingConfirmation, sendContactNotification } from './email'

test('sendBookingConfirmation sends with booking template and params', async () => {
  await sendBookingConfirmation({ fullName: 'Jane Doe', email: 'jane@example.com', service: 'individual' })
  expect(sendMock).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(String),
    expect.objectContaining({ fullName: 'Jane Doe', email: 'jane@example.com' }),
    expect.any(String)
  )
})

test('sendContactNotification sends with contact template and params', async () => {
  await sendContactNotification({ fullName: 'Jane Doe', email: 'jane@example.com', subject: 'Question', message: 'Hi' })
  expect(sendMock).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(String),
    expect.objectContaining({ subject: 'Question' }),
    expect.any(String)
  )
})
