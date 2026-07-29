import { useState, useRef } from 'react'
import { useTranslation } from '../i18n/useTranslation'
import { StepService } from './StepService'
import { StepModality } from './StepModality'
import { StepDateTime } from './StepDateTime'
import { StepContact } from './StepContact'
import { Confirmation } from './Confirmation'
import { validateBookingContact } from '../lib/bookingSchema'
import { insertBooking } from '../lib/supabaseClient'
import { sendBookingConfirmation } from '../lib/email'
import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from '../lib/antiSpam'

const THROTTLE_KEY = 'anfa-booking-last-submit'
const THROTTLE_MS = 60000
const MIN_FILL_MS = 2000

export function BookingWizard() {
  const { t, lang } = useTranslation()
  const mountedAt = useRef(Date.now())
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [modality, setModality] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [contact, setContact] = useState({ fullName: '', email: '', phone: '', message: '', consent: false })
  const [errors, setErrors] = useState({})
  const [honeypot, setHoneypot] = useState('')
  const [done, setDone] = useState(false)
  const [throttled, setThrottled] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function updateContact(field, val) {
    setContact((c) => ({ ...c, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { valid, errors: fieldErrors } = validateBookingContact(contact)
    setErrors(fieldErrors)
    if (!valid) return

    const isBot = isHoneypotTriggered(honeypot) || isTooFast(mountedAt.current, MIN_FILL_MS)
    const isThrottled = isWithinThrottle(THROTTLE_KEY, THROTTLE_MS)

    if (isBot) {
      setDone(true)
      return
    }
    if (isThrottled) {
      setThrottled(true)
      setDone(true)
      return
    }

    const payload = {
      service,
      modality,
      preferred_date: date,
      preferred_time: time,
      full_name: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      consent: contact.consent,
      language: lang,
    }

    setSubmitError('')
    try {
      await insertBooking(payload)
      await sendBookingConfirmation({ fullName: contact.fullName, email: contact.email, service, modality, preferred_date: date, preferred_time: time })
      recordSubmission(THROTTLE_KEY)
      setDone(true)
    } catch (err) {
      setSubmitError(t('booking.submitError'))
    }
  }

  if (done) return <Confirmation throttled={throttled} />

  return (
    <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
      <h1 className="font-display text-3xl mb-6">{t('booking.title')}</h1>
      {step === 1 && <StepService value={service} onSelect={(v) => { setService(v); setStep(2) }} />}
      {step === 2 && <StepModality value={modality} onSelect={(v) => { setModality(v); setStep(3) }} />}
      {step === 3 && (
        <StepDateTime date={date} time={time} onDateChange={setDate} onTimeChange={(v) => { setTime(v); setStep(4) }} />
      )}
      {step === 4 && (
        <StepContact
          values={contact}
          errors={errors}
          onChange={updateContact}
          honeypotValue={honeypot}
          onHoneypotChange={setHoneypot}
        />
      )}
      {submitError && <p role="alert" className="text-sm text-red-700 mt-4">{submitError}</p>}
      <div className="flex justify-between mt-6">
        {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)}>{t('booking.back')}</button>}
        {step === 4 && <button type="submit" className="rounded-full bg-sunlit px-6 py-2 font-semibold">{t('booking.submit')}</button>}
      </div>
    </form>
  )
}
