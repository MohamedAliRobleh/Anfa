import { useTranslation } from '../i18n/useTranslation'

export function Confirmation({ throttled }) {
  const { t } = useTranslation()
  return (
    <div role="status">
      <h2 className="font-display text-2xl mb-2">{t('booking.success.title')}</h2>
      <p>{throttled ? t('booking.throttled') : t('booking.success.body')}</p>
    </div>
  )
}
