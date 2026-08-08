import { useState, useRef } from 'react'
import { useTranslation } from '../i18n/useTranslation'
import { BookingProgress } from './BookingProgress'
import { StepService } from './StepService'
import { StepModality } from './StepModality'
import { StepDateTime } from './StepDateTime'
import { StepContact } from './StepContact'
import { Confirmation } from './Confirmation'
import { ArrowLeftIcon } from '../components/icons'
import { validateBookingContact } from '../lib/bookingSchema'
import { insertBooking } from '../lib/supabaseClient'
import { sendBookingConfirmation } from '../lib/email'
import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from '../lib/antiSpam'

const THROTTLE_KEY = 'anfa-booking-last-submit'
const THROTTLE_MS = 60000
const MIN_FILL_MS = 2000

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sea-deep/15 bg-mist/60 px-3 py-1 text-xs font-semibold text-sea-deep">
      {children}
    </span>
  )
}

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

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <form onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
      <h1 className="font-display text-3xl text-sea-deep mb-1">{t('booking.title')}</h1>
      <p className="text-ink/60 mb-8">{t('booking.subtitle')}</p>

      <BookingProgress current={step} />

      {step > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {service && <Chip>{t(`booking.step1.${service}`)}</Chip>}
          {step > 2 && modality && <Chip>{t(`booking.step2.${modality}`)}</Chip>}
          {step > 3 && date && time && <Chip>{formattedDate} · {time}</Chip>}
        </div>
      )}

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
      {submitError && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}
      <div className="mt-10 flex items-center justify-between border-t border-ink/5 pt-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 transition-colors duration-300 hover:text-sea-deep"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t('booking.back')}
          </button>
        ) : (
          <span />
        )}
        {step === 4 && (
          <button
            type="submit"
            className="rounded-full bg-sunlit hover:bg-sea-deep px-8 py-3 text-sm font-semibold text-sand shadow-[0_2px_10px_rgba(95,94,130,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(95,94,130,0.45)]"
          >
            {t('booking.submit')}
          </button>
        )}
      </div>
    </form>
  )
}
