import { useTranslation } from '../i18n/useTranslation'
import { CheckIcon } from '../components/icons'

export function Confirmation({ throttled }) {
  const { t } = useTranslation()
  return (
    <div role="status" className="flex flex-col items-center py-6 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sea-deep text-sand">
        <CheckIcon className="h-7 w-7" />
      </span>
      <h2 className="font-display text-3xl text-sea-deep mb-2">{t('booking.success.title')}</h2>
      <p className="max-w-sm text-ink/70">{throttled ? t('booking.throttled') : t('booking.success.body')}</p>
      <a
        href="/"
        className="mt-8 rounded-full bg-sunlit hover:bg-sea-deep px-8 py-3 text-sm font-semibold text-sand shadow-[0_2px_10px_rgba(95,94,130,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(95,94,130,0.45)]"
      >
        {t('booking.success.backHome')}
      </a>
    </div>
  )
}
