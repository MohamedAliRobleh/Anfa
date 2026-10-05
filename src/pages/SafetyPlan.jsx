import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

export default function SafetyPlan() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Safety Plan" description={t('safetyPlan.intro')} path="/safety-plan" />
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-display text-4xl mb-2">{t('safetyPlan.heading')}</h1>
        <p className="text-ink/60">{t('safetyPlan.intro')}</p>
      </div>
    </div>
  )
}
