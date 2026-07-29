const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateBookingContact({ fullName, email, phone, consent }) {
  const errors = {}
  if (!fullName?.trim()) errors.fullName = 'Full name is required.'
  if (!email?.trim() || !EMAIL_RE.test(email)) errors.email = 'A valid email is required.'
  if (!phone?.trim()) errors.phone = 'Phone number is required.'
  if (consent !== true) errors.consent = 'Consent is required to proceed.'
  return { valid: Object.keys(errors).length === 0, errors }
}
