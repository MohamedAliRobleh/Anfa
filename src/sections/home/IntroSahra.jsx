import { useTranslation } from '../../i18n/useTranslation'

export function IntroSahra() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
      <img src="/img/sahra-portrait.webp" alt="Sahra Haji-Mohamed Said, RSW" className="rounded-2xl w-full object-cover" loading="lazy" />
      <div>
        <h2 className="font-display text-3xl mb-4">{t('home.intro.heading')}</h2>
        <p>{t('home.intro.body')}</p>
      </div>
    </section>
  )
}
