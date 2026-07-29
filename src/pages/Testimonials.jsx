import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { testimonials } from '../content/testimonials'

export default function Testimonials() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <SEO title="Testimonials" description={t('testimonials.intro')} path="/testimonials" />
      <h1 className="font-display text-4xl mb-4">{t('testimonials.heading')}</h1>
      <p className="text-sm text-ink/70 mb-8">{t('testimonials.disclaimer')}</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {testimonials.map((tm) => (
          <blockquote key={tm.id} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="italic mb-3">"{t(`testimonials.items.${tm.id}.quote`)}"</p>
            <footer className="text-sm text-sea-deep">— {tm.initial}, {t(`testimonials.items.${tm.id}.reason`)}</footer>
          </blockquote>
        ))}
      </div>
    </div>
  )
}
