import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Link } from 'react-router-dom'

export default function FeesInsurance() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SEO title="Fees & Insurance" description={t('fees.intro')} path="/fees" />
      <h1 className="font-display text-4xl mb-8">{t('fees.heading')}</h1>
      <ul className="mb-6 space-y-2">
        <li>{t('fees.individual')}</li>
        <li>{t('fees.couple')}</li>
        <li>{t('fees.slidingScale')}</li>
      </ul>
      <h2 className="font-display text-2xl mb-3">{t('fees.paymentHeading')}</h2>
      <p className="mb-6">{t('fees.paymentMethods')}</p>
      <h2 className="font-display text-2xl mb-3">{t('fees.insuranceHeading')}</h2>
      <p className="mb-6">{t('fees.insuranceDetails')}</p>
      <Link to="/booking" className="rounded-full bg-sunlit text-ink px-6 py-3 font-semibold inline-block">{t('common.cta.bookFree')}</Link>
    </div>
  )
}
