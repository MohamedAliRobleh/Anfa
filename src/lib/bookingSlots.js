export function getAvailableSlots(date) {
  // Use getUTCDay(), not getDay(): callers pass date-only strings like
  // "2026-08-02" (from <input type="date">), which parse as UTC midnight.
  // In timezones behind UTC, .getDay() would shift the weekday back by
  // one day and misidentify Sunday as open.
  if (date.getUTCDay() === 0) return [] // Sunday closed

  const slots = []
  let hour = 11
  let minute = 0
  while (hour < 17 || (hour === 17 && minute <= 30)) {
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    minute += 30
    if (minute === 60) { minute = 0; hour += 1 }
  }
  return slots
}
