import { validateBookingContact } from './bookingSchema'

test('rejects missing required fields and missing consent', () => {
  const result = validateBookingContact({ fullName: '', email: '', phone: '', consent: false })
  expect(result.valid).toBe(false)
  expect(result.errors.fullName).toBeTruthy()
  expect(result.errors.email).toBeTruthy()
  expect(result.errors.phone).toBeTruthy()
  expect(result.errors.consent).toBeTruthy()
})

test('rejects malformed email', () => {
  const result = validateBookingContact({ fullName: 'Jane', email: 'not-an-email', phone: '6135551234', consent: true })
  expect(result.valid).toBe(false)
  expect(result.errors.email).toBeTruthy()
})

test('accepts a valid payload with only the allowed fields', () => {
  const result = validateBookingContact({ fullName: 'Jane Doe', email: 'jane@example.com', phone: '6135551234', consent: true, message: 'Looking forward to it' })
  expect(result.valid).toBe(true)
  expect(result.errors).toEqual({})
})
