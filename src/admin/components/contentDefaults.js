import fr from '../../i18n/fr.json'
import en from '../../i18n/en.json'
import { blogPosts } from '../../content/blogPosts'

const DICTIONARIES = { fr, en }
const BLOG_FIELDS = ['title', 'excerpt', 'body']

// Resolves the site's built-in default text for a content_overrides key, by
// walking the dotted i18n key into fr.json/en.json, or — for blog post keys
// ("blog.<slug>.title|excerpt|body") — by looking up the matching post in
// blogPosts.js (joining its body paragraphs with a blank line, matching how
// src/content/blogContent.js splits a saved override back into paragraphs).
// Returns '' if the key can't be resolved, so the editor always has
// something safe to render.
export function getDefaultText(key, lang) {
  const parts = key.split('.')

  if (parts.length === 3 && parts[0] === 'blog' && BLOG_FIELDS.includes(parts[2])) {
    const [, slug, field] = parts
    const post = blogPosts.find((p) => p.slug === slug)
    if (post) {
      if (field === 'body') return post[lang].body.join('\n\n')
      return post[lang][field] ?? ''
    }
  }

  let node = DICTIONARIES[lang]
  for (const part of parts) {
    node = node?.[part]
    if (node === undefined || node === null) return ''
  }
  return typeof node === 'string' ? node : ''
}
