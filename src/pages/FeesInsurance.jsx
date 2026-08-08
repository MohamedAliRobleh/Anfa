import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Link } from 'react-router-dom'
import { CreditCardIcon, ReceiptIcon, SparkleIcon } from '../components/icons'

export default function FeesInsurance() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Fees & Insurance" description={t('fees.intro')} path="/fees" />
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="font-display text-4xl mb-2">{t('fees.heading')}</h1>
        <p className="mb-10 max-w-2xl text-ink/60">{t('fees.intro')}</p>

        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-ink/5 sm:p-8">
            <p className="font-display text-2xl text-sea-deep">{t('fees.individual')}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-ink/5 sm:p-8">
            <p className="font-display text-2xl text-sea-deep">{t('fees.couple')}</p>
          </div>
        </div>

        <div className="mb-12 flex items-start gap-4 rounded-2xl border-2 border-dashed border-sunlit/50 bg-sunlit/10 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sunlit/30 text-sea-deep">
            <SparkleIcon className="h-5 w-5" />
          </span>
          <p className="text-ink/80">{t('fees.slidingScale')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-mist text-sea-deep">
              <CreditCardIcon className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl mb-3">{t('fees.paymentHeading')}</h2>
            <p className="text-sm text-ink/80">{t('fees.paymentMethods')}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-mist text-sea-deep">
              <ReceiptIcon className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl mb-3">{t('fees.insuranceHeading')}</h2>
            <p className="text-sm text-ink/80">{t('fees.insuranceDetails')}</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/booking"
            className="inline-flex rounded-full bg-sunlit hover:bg-sea-deep px-8 py-3 text-sm font-semibold text-sand shadow-[0_2px_10px_rgba(95,94,130,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(95,94,130,0.45)]"
          >
            {t('common.cta.bookFree')}
          </Link>
        </div>
      </div>
    </div>
  )
}
