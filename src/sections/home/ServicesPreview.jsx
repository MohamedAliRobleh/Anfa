import { useTranslation } from '../../i18n/useTranslation'
import { Card } from '../../components/Card'
import { services } from '../../content/services'

export function ServicesPreview() {
  const { t } = useTranslation()
  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl text-sea-deep mb-10 text-center">{t('home.servicesPreview.heading')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Card
              key={s.key}
              title={t(`home.servicesPreview.${s.key}.title`)}
              description={t(`home.servicesPreview.${s.key}.description`)}
              ctaLabel={t('common.cta.viewAll')}
              ctaTo="/services"
              image={s.image}
              accent={s.accent}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
