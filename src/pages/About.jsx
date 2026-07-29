import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="About" description={t('about.intro')} path="/about" />
      <h1 className="font-display text-4xl mb-6">{t('about.heading')}</h1>
      <img src="/img/sahra-portrait.webp" alt="Sahra Haji-Mohamed Said, RSW" className="rounded-2xl mb-8 w-full max-w-md" loading="lazy" />
      <p className="mb-6">{t('about.bio')}</p>
      <blockquote className="italic border-l-4 border-sunlit pl-4 mb-6">{t('about.philosophy')}</blockquote>
      <h2 className="font-display text-2xl mb-3">{t('about.credentialsHeading')}</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>{t('about.credentials.rsw')}</li>
        <li>{t('about.credentials.msw')}</li>
        <li>{t('about.credentials.rece')}</li>
        <li>{t('about.credentials.addiction')}</li>
      </ul>
      <h2 className="font-display text-2xl mb-3">{t('about.communitiesHeading')}</h2>
      <p>{t('about.communities')}</p>
    </div>
  )
}
