import { useTranslation } from '../../i18n/useTranslation'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { blogPosts } from '../../content/blogPosts'

export function BlogPreview() {
  const { t, lang } = useTranslation()
  return (
    <section className="bg-mist py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl mb-8 text-center">{t('home.blogPreview.heading')}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {blogPosts.map((p) => (
            <Card key={p.slug} title={p[lang].title} description={p[lang].excerpt} ctaLabel={t('common.cta.readMore')} ctaTo={`/blog/${p.slug}`} image={p.coverImage} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/blog" className="text-sea font-semibold hover:underline">{t('common.cta.viewAll')}</Link>
        </div>
      </div>
    </section>
  )
}
