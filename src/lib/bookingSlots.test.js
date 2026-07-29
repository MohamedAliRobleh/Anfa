import { getAvailableSlots } from './bookingSlots'

test('returns empty array for Sunday', () => {
  const sunday = new Date('2026-08-02') // a Sunday (UTC calendar date)
  expect(getAvailableSlots(sunday)).toEqual([])
})

test('returns 30-minute slots from 11:00 to 17:30 for a non-Sunday', () => {
  const saturday = new Date('2026-08-01') // a Saturday (UTC calendar date)
  const slots = getAvailableSlots(saturday)
  expect(slots[0]).toBe('11:00')
  expect(slots[slots.length - 1]).toBe('17:30')
  expect(slots).toHaveLength(14)
})
