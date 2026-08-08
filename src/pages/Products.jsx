import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { products, BRAND_ORDER } from '../content/products'
import { TagIcon, ExternalLinkIcon } from '../components/icons'

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

        {BRAND_ORDER.map((brand) => {
          const items = products.filter((p) => p.brand === brand)
          if (!items.length) return null
          return (
            <div key={brand} className="mb-12">
              <h2 className="font-display text-2xl mb-5">{brand}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <div
                    key={p.url}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5"
                  >
                    <img src={p.image} alt={p.name} loading="lazy" className="h-40 w-full object-cover" />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-base mb-2 flex-1">{p.name}</h3>
                      <div className="mb-4 flex items-center gap-1.5 font-display text-lg text-sea-deep">
                        <TagIcon className="h-4 w-4" />
                        {p.price}
                      </div>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-sunlit hover:bg-sea-deep px-5 py-2.5 text-center text-sm font-semibold text-sand transition-colors duration-300"
                      >
                        {t('common.cta.shopProduct')}
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
