import { useState, useRef } from 'react'
import { useTranslation } from '../i18n/useTranslation'
import { Honeypot } from './Honeypot'
import { insertMessage } from '../lib/supabaseClient'
import { sendContactNotification } from '../lib/email'
import { isHoneypotTriggered, isWithinThrottle, recordSubmission, isTooFast } from '../lib/antiSpam'

const THROTTLE_KEY = 'anfa-contact-last-submit'
const THROTTLE_MS = 60000
const MIN_FILL_MS = 2000

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

  if (done) return <p role="status">{t('contact.success')}</p>

  return (
    <form onSubmit={handleSubmit}>
      <Honeypot name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} testId="contact-honeypot" />

      <label htmlFor="c-fullName">{t('contact.fullName')}</label>
      <input id="c-fullName" value={values.fullName} onChange={(e) => update('fullName', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      <label htmlFor="c-email">{t('contact.email')}</label>
      <input id="c-email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      <label htmlFor="c-subject">{t('contact.subject')}</label>
      <input id="c-subject" value={values.subject} onChange={(e) => update('subject', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      <label htmlFor="c-message">{t('contact.message')}</label>
      <textarea id="c-message" value={values.message} onChange={(e) => update('message', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-3" required />

      {submitError && <p role="alert" className="text-sm text-red-700 mb-3">{submitError}</p>}
      <button type="submit" className="rounded-full bg-sunlit px-6 py-2 font-semibold">{t('contact.send')}</button>
    </form>
  )
}
