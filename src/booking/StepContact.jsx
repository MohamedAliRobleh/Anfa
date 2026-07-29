import { useTranslation } from '../i18n/useTranslation'
import { Honeypot } from '../components/Honeypot'

export function StepContact({ values, errors, onChange, honeypotValue, onHoneypotChange }) {
  const { t } = useTranslation()
  return (
    <fieldset>
      <legend className="font-display text-2xl mb-4">{t('booking.step4.heading')}</legend>
      <Honeypot name="website" value={honeypotValue} onChange={(e) => onHoneypotChange(e.target.value)} testId="booking-honeypot" />

      <label htmlFor="fullName">{t('booking.step4.fullName')}</label>
      <input id="fullName" value={values.fullName} onChange={(e) => onChange('fullName', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />
      {errors.fullName && <p role="alert" className="text-sm text-red-700 mb-2">{errors.fullName}</p>}

      <label htmlFor="email">{t('booking.step4.email')}</label>
      <input id="email" type="email" value={values.email} onChange={(e) => onChange('email', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />
      {errors.email && <p role="alert" className="text-sm text-red-700 mb-2">{errors.email}</p>}

      <label htmlFor="phone">{t('booking.step4.phone')}</label>
      <input id="phone" type="tel" value={values.phone} onChange={(e) => onChange('phone', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />
      {errors.phone && <p role="alert" className="text-sm text-red-700 mb-2">{errors.phone}</p>}

      <label htmlFor="message">{t('booking.step4.message')}</label>
      <textarea id="message" value={values.message} onChange={(e) => onChange('message', e.target.value)} className="block w-full border border-mist rounded-lg p-2 mb-1" />

      <label htmlFor="consent" className="flex items-center gap-2 mt-2">
        <input id="consent" type="checkbox" checked={values.consent} onChange={(e) => onChange('consent', e.target.checked)} />
        {t('booking.step4.consent')}
      </label>
      {errors.consent && <p role="alert" className="text-sm text-red-700">{errors.consent}</p>}
    </fieldset>
  )
}
