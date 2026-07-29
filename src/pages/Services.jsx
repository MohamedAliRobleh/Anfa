import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Card } from '../components/Card'
import { services } from '../content/services'

export default function Services() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SEO title="Services" description={t('services.intro')} path="/services" />
        <h1 className="font-display text-4xl mb-2">{t('services.heading')}</h1>
        <p className="mb-10 max-w-2xl text-ink/60">{t('services.intro')}</p>
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
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
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
          <h2 className="font-display text-2xl mb-3">{t('services.expertiseHeading')}</h2>
          <p className="text-ink/80">{t('services.expertiseList')}</p>
        </div>
      </div>
    </div>
  )
}
