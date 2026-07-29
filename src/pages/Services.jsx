import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Card } from '../components/Card'
import { services } from '../content/services'

export default function Services() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SEO title="Services" description={t('services.intro')} path="/services" />
      <h1 className="font-display text-4xl mb-8">{t('services.heading')}</h1>
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {services.map((s) => (
          <Card
            key={s.key}
            title={t(`services.items.${s.key}.title`)}
            description={t(`services.items.${s.key}.description`)}
            ctaLabel={t('common.cta.bookNow')}
            ctaTo="/booking"
            image={s.image}
          />
        ))}
      </div>
      <h2 className="font-display text-2xl mb-4">{t('services.expertiseHeading')}</h2>
      <p>{t('services.expertiseList')}</p>
    </div>
  )
}
