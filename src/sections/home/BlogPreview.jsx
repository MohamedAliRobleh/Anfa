import { useTranslation } from '../../i18n/useTranslation'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { blogPosts } from '../../content/blogPosts'

export function BlogPreview() {
  const { t, lang } = useTranslation()
  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl text-sea-deep mb-10 text-center">{t('home.blogPreview.heading')}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {blogPosts.map((p) => (
            <Card key={p.slug} title={p[lang].title} description={p[lang].excerpt} ctaLabel={t('common.cta.readMore')} ctaTo={`/blog/${p.slug}`} image={p.coverImage} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 rounded-full border border-sea-deep/20 px-5 py-2.5 text-sm font-semibold text-sea-deep transition-colors duration-300 hover:border-sea-deep/40 hover:bg-white"
          >
            {t('common.cta.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}
