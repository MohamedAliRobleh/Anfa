import { vi } from 'vitest'

const { insertMock, fromMock } = vi.hoisted(() => {
  const insertMock = vi.fn(() => Promise.resolve({ error: null }))
  const fromMock = vi.fn(() => ({ insert: insertMock }))
  return { insertMock, fromMock }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: fromMock })),
}))

import { insertBooking, insertMessage } from './supabaseClient'

test('insertBooking calls supabase.from("bookings").insert with payload', async () => {
  await insertBooking({ service: 'individual' })
  expect(fromMock).toHaveBeenCalledWith('bookings')
  expect(insertMock).toHaveBeenCalledWith([{ service: 'individual' }])
})

test('insertMessage calls supabase.from("messages").insert with payload', async () => {
  await insertMessage({ subject: 'hello' })
  expect(fromMock).toHaveBeenCalledWith('messages')
  expect(insertMock).toHaveBeenCalledWith([{ subject: 'hello' }])
})
