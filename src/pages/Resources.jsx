import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { CrisisResourceStrip } from '../components/CrisisResourceStrip'

export default function Resources() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="Resources" description={t('resources.intro')} path="/resources" />
      <h1 className="font-display text-4xl mb-6">{t('resources.heading')}</h1>
      <div className="mb-8 rounded-xl overflow-hidden border-2 border-sunlit">
        <CrisisResourceStrip />
      </div>
      <p>{t('resources.body')}</p>
    </div>
  )
}
