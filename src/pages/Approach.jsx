import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'

const METHODS = ['cbt', 'narrative', 'act', 'mindfulness', 'artTherapy', 'playTherapy', 'motivational', 'culturallySensitive']

export default function Approach() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <SEO title="Approach" description={t('approach.intro')} path="/approach" />
      <h1 className="font-display text-4xl mb-8">{t('approach.heading')}</h1>
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {METHODS.map((m) => (
          <div key={m} className="rounded-xl bg-mist p-5">
            <h3 className="font-display text-lg mb-2">{t(`approach.methods.${m}.title`)}</h3>
            <p className="text-sm">{t(`approach.methods.${m}.description`)}</p>
          </div>
        ))}
      </div>
      <h2 className="font-display text-2xl mb-3">{t('approach.firstSessionHeading')}</h2>
      <p>{t('approach.firstSession')}</p>
    </div>
  )
}
