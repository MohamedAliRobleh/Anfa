async function postEmail(type, payload) {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload }),
  })
  if (!res.ok) {
    throw new Error('Failed to send email')
  }
  return res.json()
}

export async function sendBookingConfirmation(booking) {
  return postEmail('booking', booking)
}

export async function sendContactNotification(message) {
  return postEmail('contact', message)
}
