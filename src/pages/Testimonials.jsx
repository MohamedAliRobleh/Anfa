import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { testimonials } from '../content/testimonials'
import { QuoteIcon } from '../components/icons'

export default function Testimonials() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <SEO title="Testimonials" description={t('testimonials.intro')} path="/testimonials" />
        <h1 className="font-display text-4xl mb-2">{t('testimonials.heading')}</h1>
        <p className="mb-10 text-sm text-ink/60">{t('testimonials.disclaimer')}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((tm) => (
            <blockquote key={tm.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-lavender/25">
              <QuoteIcon className="mb-2 h-7 w-7 text-lavender/70" />
              <p className="mb-4 italic text-ink/80">"{t(`testimonials.items.${tm.id}.quote`)}"</p>
              <footer className="text-sm font-semibold text-sea-deep">— {tm.initial}, {t(`testimonials.items.${tm.id}.reason`)}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  )
}
