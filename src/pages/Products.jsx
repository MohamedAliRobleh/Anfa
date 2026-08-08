import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { products, BRAND_ORDER } from '../content/products'
import { TagIcon, ExternalLinkIcon, SparkleIcon } from '../components/icons'

function slug(brand) {
  return brand.toLowerCase().replace(/\s+/g, '-')
}

export default function Products() {
  const { t } = useTranslation()
  const prefersReduced = useReducedMotion()

  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <SEO title="Products" description={t('products.intro')} path="/products" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-lavender-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-lavender-ink">
          <SparkleIcon className="h-3.5 w-3.5" />
          Opulence Global Partner
        </div>
        <h1 className="font-display text-4xl mb-2">{t('products.heading')}</h1>
        <p className="mb-4 max-w-2xl text-ink/60">{t('products.intro')}</p>
        <p className="mb-8 max-w-2xl rounded-2xl bg-lavender-wash px-4 py-3 text-sm text-lavender-ink">
          {t('products.disclaimer')}
        </p>

        <nav className="mb-12 flex flex-wrap gap-2">
          {BRAND_ORDER.map((brand) => (
            <a
              key={brand}
              href={`#${slug(brand)}`}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm transition-colors duration-300 hover:border-sea-deep/30 hover:bg-mist/60 hover:text-sea-deep"
            >
              {brand}
            </a>
          ))}
        </nav>

        {BRAND_ORDER.map((brand) => {
          const items = products.filter((p) => p.brand === brand)
          if (!items.length) return null
          return (
            <div key={brand} id={slug(brand)} className="mb-16 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="font-display text-2xl">{brand}</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-lavender/40 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <motion.div
                    key={p.url}
                    whileHover={prefersReduced ? {} : { y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[0_20px_40px_-20px_rgba(8,95,104,0.25)]"
                  >
                    <div className="flex h-44 items-center justify-center bg-sand/60 p-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink/35">{p.brand}</p>
                      <h3 className="font-display text-base mb-3 flex-1">{p.name}</h3>
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
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
