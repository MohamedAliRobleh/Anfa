import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { products } from '../content/products'
import { BookIcon, HeartIcon, LeafIcon, TagIcon } from '../components/icons'

const ICONS = {
  anxietyGuide: BookIcon,
  griefWorkshop: LeafIcon,
  couplesWorkbook: HeartIcon,
}

export default function Products() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Products" description={t('products.intro')} path="/products" />
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="font-display text-4xl mb-2">{t('products.heading')}</h1>
        <p className="mb-4 max-w-2xl text-ink/60">{t('products.intro')}</p>
        <p className="mb-10 max-w-2xl rounded-2xl bg-lavender-wash px-4 py-3 text-sm text-lavender-ink">
          {t('products.disclaimer')}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(({ key }) => {
            const Icon = ICONS[key]
            return (
              <div
                key={key}
                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-mist text-sea-deep">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
                  {t(`products.items.${key}.format`)}
                </p>
                <h3 className="font-display text-xl mb-2">{t(`products.items.${key}.title`)}</h3>
                <p className="mb-4 flex-1 text-sm text-ink/70">{t(`products.items.${key}.description`)}</p>
                <div className="mb-4 flex items-center gap-1.5 font-display text-lg text-sea-deep">
                  <TagIcon className="h-4 w-4" />
                  {t(`products.items.${key}.price`)}
                </div>
                <Link
                  to="/contact"
                  className="rounded-full bg-sunlit hover:bg-sea-deep px-5 py-2.5 text-center text-sm font-semibold text-sand transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t('common.cta.askAboutProduct')}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
