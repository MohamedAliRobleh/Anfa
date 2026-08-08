import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { blogPosts } from '../content/blogPosts'
import { ArrowLeftIcon } from '../components/icons'

export default function BlogPost() {
  const { slug } = useParams()
  const { t, lang } = useTranslation()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-4 text-ink/70">{t('blog.notFound')}</p>
          <Link to="/blog" className="font-semibold text-sea-deep hover:underline">{t('common.cta.viewAll')}</Link>
        </div>
      </div>
    )
  }

  const content = post[lang]
  return (
    <div className="bg-gradient-to-b from-mist/60 via-sand to-sand py-14 md:py-20">
      <article className="mx-auto max-w-3xl px-4">
        <SEO title={content.title} description={content.excerpt} path={`/blog/${post.slug}`} />
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 transition-colors duration-300 hover:text-sea-deep"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t('common.cta.viewAll')}
        </Link>
        <img
          src={post.coverImage}
          alt=""
          className="mb-6 h-64 w-full rounded-3xl object-cover shadow-[0_20px_45px_-15px_rgba(8,95,104,0.3)] ring-1 ring-ink/5 md:h-80"
          loading="lazy"
        />
        <p className="mb-2 inline-flex items-center rounded-full bg-lavender-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-lavender-ink">
          {post.category} · {post.readMinutes} min
        </p>
        <h1 className="font-display text-4xl mb-6 mt-2">{content.title}</h1>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-8">
          {content.body.map((para, i) => (
            <p key={i} className="mb-4 text-ink/80 last:mb-0">{para}</p>
          ))}
        </div>
      </article>
    </div>
  )
}
