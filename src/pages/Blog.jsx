import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { Card } from '../components/Card'
import { blogPosts } from '../content/blogPosts'

export default function Blog() {
  const { t, lang } = useTranslation()
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SEO title="Blog" description={t('blog.intro')} path="/blog" />
      <h1 className="font-display text-4xl mb-8">{t('blog.heading')}</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        {blogPosts.map((p) => (
          <Card
            key={p.slug}
            title={p[lang].title}
            description={`${p.category} · ${p.readMinutes} min — ${p[lang].excerpt}`}
            ctaLabel={t('common.cta.readMore')}
            ctaTo={`/blog/${p.slug}`}
            image={p.coverImage}
          />
        ))}
      </div>
    </div>
  )
}
