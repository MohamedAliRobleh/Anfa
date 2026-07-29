import { useTranslation } from '../i18n/useTranslation'
import { Honeypot } from '../components/Honeypot'

const inputClass =
  'block w-full rounded-xl border border-ink/15 bg-white p-2.5 text-ink transition-colors duration-300 focus:border-sea-deep focus:outline-none focus:ring-2 focus:ring-sea-deep/15'
const labelClass = 'mb-1.5 block text-sm font-semibold text-ink/70'
const errorClass = 'mt-1.5 text-sm text-red-700'

export function StepContact({ values, errors, onChange, honeypotValue, onHoneypotChange }) {
  const { t } = useTranslation()
  return (
    <fieldset className="space-y-5">
      <legend className="font-display text-2xl text-sea-deep mb-1">{t('booking.step4.heading')}</legend>
      <Honeypot name="website" value={honeypotValue} onChange={(e) => onHoneypotChange(e.target.value)} testId="booking-honeypot" />

      <div>
        <label htmlFor="fullName" className={labelClass}>{t('booking.step4.fullName')}</label>
        <input id="fullName" value={values.fullName} onChange={(e) => onChange('fullName', e.target.value)} className={inputClass} />
        {errors.fullName && <p role="alert" className={errorClass}>{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>{t('booking.step4.email')}</label>
        <input id="email" type="email" value={values.email} onChange={(e) => onChange('email', e.target.value)} className={inputClass} />
        {errors.email && <p role="alert" className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>{t('booking.step4.phone')}</label>
        <input id="phone" type="tel" value={values.phone} onChange={(e) => onChange('phone', e.target.value)} className={inputClass} />
        {errors.phone && <p role="alert" className={errorClass}>{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>{t('booking.step4.message')}</label>
        <textarea id="message" rows={3} value={values.message} onChange={(e) => onChange('message', e.target.value)} className={inputClass} />
      </div>

      <label htmlFor="consent" className="flex items-start gap-3 rounded-xl border border-ink/10 bg-mist/40 p-4 text-sm text-ink/70">
        <input
          id="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(e) => onChange('consent', e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-sea-deep"
        />
        {t('booking.step4.consent')}
      </label>
      {errors.consent && <p role="alert" className={errorClass}>{errors.consent}</p>}
    </fieldset>
  )
}
