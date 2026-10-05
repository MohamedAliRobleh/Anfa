import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

const METHODS = [
  ['cbt', 'https://images.unsplash.com/photo-1644412448740-40e5b6ded2dc?q=80&w=600&auto=format&fit=crop'],
  ['narrative', 'https://images.unsplash.com/photo-1506513083865-434a8a207e11?q=80&w=600&auto=format&fit=crop'],
  ['act', 'https://images.unsplash.com/photo-1527286914894-00a0b9572425?q=80&w=600&auto=format&fit=crop'],
  ['mindfulness', 'https://images.unsplash.com/photo-1513097847644-f00cfe868607?q=80&w=600&auto=format&fit=crop'],
  ['artTherapy', 'https://images.unsplash.com/photo-1752649935255-c10e9a3e2ad3?q=80&w=600&auto=format&fit=crop'],
  ['playTherapy', 'https://images.unsplash.com/photo-1575364289437-fb1479d52732?q=80&w=600&auto=format&fit=crop'],
  ['motivational', 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=600&auto=format&fit=crop'],
  ['culturallySensitive', 'https://images.unsplash.com/photo-1636986905406-758b0e280f49?q=80&w=600&auto=format&fit=crop'],
]

export default function Approach() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-lavender-wash via-sand to-sand py-14 md:py-20">
      <SEO title="Approach" description={t('approach.intro')} path="/approach" />
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="font-display text-4xl mb-2">{t('approach.heading')}</h1>
        <p className="mb-10 max-w-2xl text-ink/60">{t('approach.intro')}</p>

        <div className="mb-12 grid gap-5 sm:grid-cols-2">
          {METHODS.map(([key, image]) => (
            <div
              key={key}
              className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-md"
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-display text-lg mb-1">{t(`approach.methods.${key}.title`)}</h3>
                <p className="text-sm text-ink/70">{t(`approach.methods.${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
          <h2 className="font-display text-2xl mb-3">{t('approach.firstSessionHeading')}</h2>
          <p className="text-ink/80">{t('approach.firstSession')}</p>
        </div>
      </div>
    </div>
  )
}
