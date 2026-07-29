export function isHoneypotTriggered(value) {
  return Boolean(value && value.length > 0)
}

export function isWithinThrottle(storageKey, cooldownMs) {
  const last = localStorage.getItem(storageKey)
  if (!last) return false
  return Date.now() - Number(last) < cooldownMs
}

export function recordSubmission(storageKey) {
  localStorage.setItem(storageKey, String(Date.now()))
}

export function isTooFast(mountedAt, minMs) {
  return Date.now() - mountedAt < minMs
}
