import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from './antiSpam'

test('isHoneypotTriggered is true only when the field has a value', () => {
  expect(isHoneypotTriggered('')).toBe(false)
  expect(isHoneypotTriggered(undefined)).toBe(false)
  expect(isHoneypotTriggered('bot-filled-this')).toBe(true)
})

test('throttle: blocks a second submit inside the cooldown, allows after', () => {
  localStorage.clear()
  const key = 'anfa-throttle-test'
  expect(isWithinThrottle(key, 60000)).toBe(false)
  recordSubmission(key)
  expect(isWithinThrottle(key, 60000)).toBe(true)

  const past = Date.now() - 120000
  localStorage.setItem(key, String(past))
  expect(isWithinThrottle(key, 60000)).toBe(false)
})

test('isTooFast flags submits under the minimum fill time', () => {
  const now = Date.now()
  expect(isTooFast(now, 2000)).toBe(true)
  expect(isTooFast(now - 3000, 2000)).toBe(false)
})
