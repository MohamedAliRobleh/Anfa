import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

export default function Privacy() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="Privacy Policy" description={t('privacy.intro')} path="/privacy" />
      <h1 className="font-display text-4xl mb-6">{t('privacy.heading')}</h1>
      <p className="mb-4">{t('privacy.body')}</p>
      <p>{t('privacy.contact')}</p>
    </div>
  )
}
