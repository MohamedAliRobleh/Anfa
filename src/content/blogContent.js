import { blogPosts } from './blogPosts'

// Merges any admin-saved overrides onto a blog post's built-in defaults for
// the given language. `overrides` is the flat map from
// useContentOverrides() (content_overrides, keyed "blog.<slug>.<field>"),
// `mediaOverrides` is the flat map from useMediaOverridesContext()
// (media_overrides, keyed "blog.<slug>.coverImage"). Both default to {} so
// pages that render outside those providers (tests) just get the defaults.
function mergePost(post, lang, overrides, mediaOverrides) {
  const base = post[lang]
  const titleOverride = overrides[`blog.${post.slug}.title`]?.[lang]
  const excerptOverride = overrides[`blog.${post.slug}.excerpt`]?.[lang]
  const bodyOverride = overrides[`blog.${post.slug}.body`]?.[lang]
  const coverOverride = mediaOverrides[`blog.${post.slug}.coverImage`]?.url

  return {
    ...post,
    coverImage: coverOverride || post.coverImage,
    [lang]: {
      ...base,
      title: titleOverride?.trim() ? titleOverride : base.title,
      excerpt: excerptOverride?.trim() ? excerptOverride : base.excerpt,
      body: bodyOverride?.trim()
        ? bodyOverride.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
        : base.body,
    },
  }
}

export function getBlogPost(slug, lang, overrides = {}, mediaOverrides = {}) {
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return null
  return mergePost(post, lang, overrides, mediaOverrides)
}

export function getAllBlogPosts(lang, overrides = {}, mediaOverrides = {}) {
  return blogPosts.map((post) => mergePost(post, lang, overrides, mediaOverrides))
}
