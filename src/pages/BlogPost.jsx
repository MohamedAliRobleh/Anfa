import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { SEO } from '../components/SEO'
import { blogPosts } from '../content/blogPosts'

export default function BlogPost() {
  const { slug } = useParams()
  const { t, lang } = useTranslation()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p>{t('blog.notFound')}</p>
        <Link to="/blog" className="text-sea hover:underline">{t('common.cta.viewAll')}</Link>
      </div>
    )
  }

  const content = post[lang]
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <SEO title={content.title} description={content.excerpt} path={`/blog/${post.slug}`} />
      <img src={post.coverImage} alt="" className="rounded-2xl mb-6 w-full object-cover h-64" loading="lazy" />
      <p className="text-sm text-sea-deep uppercase tracking-widest mb-2">{post.category} · {post.readMinutes} min</p>
      <h1 className="font-display text-4xl mb-6">{content.title}</h1>
      {content.body.map((para, i) => (
        <p key={i} className="mb-4">{para}</p>
      ))}
    </article>
  )
}
