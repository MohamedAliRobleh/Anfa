import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'
import { HorizonDivider } from '../../components/HorizonDivider'

export function FinalCta() {
  const { t } = useTranslation()
  return (
    <section className="relative bg-sea-deep text-sand py-20 text-center overflow-hidden">
      <HorizonDivider className="absolute top-0 left-0 right-0 w-full h-10 opacity-40" />
      <h2 className="font-display text-3xl mb-4">{t('home.finalCta.heading')}</h2>
      <p className="mb-8 italic">{t('common.tagline')}</p>
      <Link to="/booking" className="rounded-full bg-sunlit text-ink px-8 py-3 font-semibold">{t('common.cta.bookFree')}</Link>
    </section>
  )
}
