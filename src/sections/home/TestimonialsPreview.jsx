import { useTranslation } from '../../i18n/useTranslation'
import { Link } from 'react-router-dom'
import { testimonials } from '../../content/testimonials'
import { QuoteIcon } from '../../components/icons'

export function TestimonialsPreview() {
  const { t } = useTranslation()
  const preview = testimonials.slice(0, 2)
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <h2 className="font-display text-3xl text-sea-deep mb-10 text-center">{t('home.testimonialsPreview.heading')}</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {preview.map((tm) => (
          <blockquote key={tm.id} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-ink/5">
            <QuoteIcon className="mb-2 h-7 w-7 text-sunlit/70" />
            <p className="mb-4 italic text-ink/80">"{t(`testimonials.items.${tm.id}.quote`)}"</p>
            <footer className="text-sm font-semibold text-sea-deep">— {tm.initial}, {t(`testimonials.items.${tm.id}.reason`)}</footer>
          </blockquote>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/testimonials"
          className="inline-flex items-center gap-1.5 rounded-full border border-sea-deep/20 px-5 py-2.5 text-sm font-semibold text-sea-deep transition-colors duration-300 hover:bg-mist/60"
        >
          {t('common.cta.viewAll')}
        </Link>
      </div>
    </section>
  )
}
