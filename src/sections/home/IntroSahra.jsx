import { useTranslation } from '../../i18n/useTranslation'
import { CheckIcon } from '../../components/icons'

const BADGES = ['badge1', 'badge2', 'badge3']

export function IntroSahra() {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sunlit/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sea/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:items-center">
        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-sea/20 via-transparent to-sunlit/20" aria-hidden="true" />
          <img
            src="/img/sahra-portrait.webp"
            alt="Sahra Haji-Mohamed Said, RSW"
            className="relative w-full rounded-3xl object-cover shadow-[0_25px_50px_-15px_rgba(11,92,87,0.3)] ring-1 ring-ink/5"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl text-sea-deep mb-4">{t('home.intro.heading')}</h2>
          <p className="mb-6 text-ink/80">{t('home.intro.body')}</p>
          <ul className="flex flex-wrap gap-2">
            {BADGES.map((key) => (
              <li
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3.5 py-1.5 text-xs font-semibold text-sea-deep"
              >
                <CheckIcon className="h-3 w-3" />
                {t(`home.intro.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
