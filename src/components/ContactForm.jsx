import { useState, useRef } from 'react'
import { useTranslation } from '../i18n/useTranslation'
import { Honeypot } from './Honeypot'
import { insertMessage } from '../lib/supabaseClient'
import { sendContactNotification } from '../lib/email'
import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from '../lib/antiSpam'
import { CheckIcon, UserIcon, MailIcon, TagIcon, MessageIcon } from './icons'

const THROTTLE_KEY = 'anfa-contact-last-submit'
const THROTTLE_MS = 60000
const MIN_FILL_MS = 2000

const inputClass =
  'block w-full rounded-xl border border-ink/15 bg-white p-2.5 text-ink transition-colors duration-300 focus:border-sea-deep focus:outline-none focus:ring-2 focus:ring-sea-deep/15'

function FieldLabel({ icon: Icon, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink/70">
      <Icon className="h-3.5 w-3.5 text-sea-deep" />
      {children}
    </label>
  )
}

export function ContactForm() {
  const { t, lang } = useTranslation()
  const mountedAt = useRef(Date.now())
  const [values, setValues] = useState({ fullName: '', email: '', subject: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [done, setDone] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update(field, val) {
    setValues((v) => ({ ...v, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const isBot = isHoneypotTriggered(honeypot) || isTooFast(mountedAt.current, MIN_FILL_MS)
    const isThrottled = isWithinThrottle(THROTTLE_KEY, THROTTLE_MS)

    if (isBot || isThrottled) {
      setDone(true)
      return
    }

    setSubmitError('')
    try {
      await insertMessage({ ...values, full_name: values.fullName, language: lang })
      await sendContactNotification(values)
      recordSubmission(THROTTLE_KEY)
      setDone(true)
    } catch (err) {
      setSubmitError(t('contact.submitError'))
    }
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col items-center py-6 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sea-deep text-sand">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="text-ink/80">{t('contact.success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-sea-deep mb-1">{t('contact.formHeading')}</h2>
        <p className="text-sm text-ink/55">{t('contact.formIntro')}</p>
      </div>

      <Honeypot name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} testId="contact-honeypot" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel icon={UserIcon} htmlFor="c-fullName">{t('contact.fullName')}</FieldLabel>
          <input id="c-fullName" value={values.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputClass} required />
        </div>
        <div>
          <FieldLabel icon={MailIcon} htmlFor="c-email">{t('contact.email')}</FieldLabel>
          <input id="c-email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} className={inputClass} required />
        </div>
      </div>

      <div>
        <FieldLabel icon={TagIcon} htmlFor="c-subject">{t('contact.subject')}</FieldLabel>
        <input id="c-subject" value={values.subject} onChange={(e) => update('subject', e.target.value)} className={inputClass} required />
      </div>

      <div>
        <FieldLabel icon={MessageIcon} htmlFor="c-message">{t('contact.message')}</FieldLabel>
        <textarea id="c-message" rows={4} value={values.message} onChange={(e) => update('message', e.target.value)} className={inputClass} required />
      </div>

      {submitError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
      )}
      <button
        type="submit"
        className="rounded-full bg-sunlit hover:bg-sea-deep px-8 py-3 text-sm font-semibold text-sand shadow-[0_2px_10px_rgba(95,94,130,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(95,94,130,0.45)]"
      >
        {t('contact.send')}
      </button>
    </form>
  )
}
