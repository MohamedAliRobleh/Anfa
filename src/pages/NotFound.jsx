import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { PinIcon } from '../components/icons'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-24 md:py-32">
      <div className="mx-auto max-w-xl px-4 text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-mist text-sea-deep">
          <PinIcon className="h-7 w-7" />
        </span>
        <h1 className="font-display text-5xl text-sea-deep mb-4">404</h1>
        <p className="mb-8 text-ink/70">{t('notFound.body')}</p>
        <Link
          to="/"
          className="inline-flex rounded-full bg-sunlit hover:bg-sea-deep px-8 py-3 text-sm font-semibold text-sand shadow-[0_2px_10px_rgba(95,94,130,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(95,94,130,0.45)]"
        >
          {t('common.nav.home')}
        </Link>
      </div>
    </div>
  )
}
