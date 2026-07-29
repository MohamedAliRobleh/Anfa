import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const BOOKING_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID
const CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID

export async function sendBookingConfirmation(booking) {
  return emailjs.send(SERVICE_ID, BOOKING_TEMPLATE_ID, booking, PUBLIC_KEY)
}

export async function sendContactNotification(message) {
  return emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, message, PUBLIC_KEY)
}
