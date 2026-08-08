import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'

export function FinalCta() {
  const { t } = useTranslation()
  return (
    <section className="relative bg-ink text-sand py-20 text-center overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sea/10 blur-3xl" aria-hidden="true" />
      <h2 className="relative font-display text-sand text-3xl mb-4">{t('home.finalCta.heading')}</h2>
      <p className="relative mb-8 italic text-sand/80">{t('common.tagline')}</p>
      <Link to="/booking" className="relative rounded-full bg-sunlit hover:bg-lavender text-sand transition-colors duration-300 px-8 py-3 font-semibold">{t('common.cta.bookFree')}</Link>
    </section>
  )
}
