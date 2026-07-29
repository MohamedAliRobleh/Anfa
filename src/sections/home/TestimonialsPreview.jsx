import { useTranslation } from '../../i18n/useTranslation'
import { Link } from 'react-router-dom'
import { testimonials } from '../../content/testimonials'

export function TestimonialsPreview() {
  const { t } = useTranslation()
  const preview = testimonials.slice(0, 2)
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="font-display text-3xl mb-8 text-center">{t('home.testimonialsPreview.heading')}</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {preview.map((tm) => (
          <blockquote key={tm.id} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="italic mb-3">"{t(`testimonials.items.${tm.id}.quote`)}"</p>
            <footer className="text-sm text-sea-deep">— {tm.initial}, {t(`testimonials.items.${tm.id}.reason`)}</footer>
          </blockquote>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/testimonials" className="text-sea font-semibold hover:underline">{t('common.cta.viewAll')}</Link>
      </div>
    </section>
  )
}
