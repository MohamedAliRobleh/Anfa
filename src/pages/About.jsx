import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { CheckIcon } from '../components/icons'

const CREDENTIALS = ['rsw', 'msw', 'rece', 'addiction']

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="About" description={t('about.intro')} path="/about" />
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 grid gap-10 md:grid-cols-[280px_1fr] md:items-start">
          <div className="relative mx-auto w-full max-w-xs md:max-w-none">
            <div className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-sea/20 via-transparent to-sunlit/20" aria-hidden="true" />
            <img
              src="/img/sahra-portrait.webp"
              alt="Sahra Haji-Mohamed Said, RSW"
              className="relative w-full rounded-3xl object-cover shadow-[0_25px_50px_-15px_rgba(11,92,87,0.3)] ring-1 ring-ink/5"
              loading="lazy"
            />
          </div>
          <div>
            <h1 className="font-display text-4xl mb-4">{t('about.heading')}</h1>
            <blockquote className="mb-6 border-l-4 border-sunlit pl-4 text-lg italic text-ink/80">
              {t('about.philosophy')}
            </blockquote>
            <p className="text-ink/80">{t('about.bio')}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
            <h2 className="font-display text-2xl mb-4">{t('about.credentialsHeading')}</h2>
            <ul className="space-y-3">
              {CREDENTIALS.map((key) => (
                <li key={key} className="flex items-start gap-3 text-sm text-ink/80">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sea-deep" />
                  <span>{t(`about.credentials.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
            <h2 className="font-display text-2xl mb-4">{t('about.communitiesHeading')}</h2>
            <p className="text-sm text-ink/80">{t('about.communities')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
