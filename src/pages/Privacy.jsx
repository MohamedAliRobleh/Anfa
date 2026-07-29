import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { ShieldIcon } from '../components/icons'

export default function Privacy() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Privacy Policy" description={t('privacy.intro')} path="/privacy" />
      <div className="mx-auto max-w-3xl px-4">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-sea-deep">
          <ShieldIcon className="h-6 w-6" />
        </span>
        <h1 className="font-display text-4xl mb-2">{t('privacy.heading')}</h1>
        <p className="mb-8 text-ink/60">{t('privacy.intro')}</p>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
          <p className="mb-4 text-ink/80">{t('privacy.body')}</p>
          <p className="text-ink/80">{t('privacy.contact')}</p>
        </div>
      </div>
    </div>
  )
}
