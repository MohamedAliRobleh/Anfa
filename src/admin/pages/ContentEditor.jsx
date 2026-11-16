import { useEffect, useMemo, useState } from 'react'
import { getContentSchema } from '../../content/contentSchema'
import { fetchContentOverrides } from '../../lib/contentOverrides'
import { ContentField } from '../components/ContentField'

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// "Site text": lets the practice's assistant edit every translatable
// string on the site (235 fields, from src/content/contentSchema.js) without
// touching code. Fields are grouped by page in collapsible sections, with a
// search box that filters by label and auto-opens any group with a match.
// Each field manages its own save/reset — see ContentField.jsx.
export default function ContentEditor() {
  const [loading, setLoading] = useState(true)
  const [overrides, setOverrides] = useState({})
  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState({})

  useEffect(() => {
    let active = true
    fetchContentOverrides().then((map) => {
      if (active) {
        setOverrides(map)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const schema = useMemo(() => getContentSchema(), [])
  const normalizedSearch = useMemo(() => normalize(search.trim()), [search])

  const groups = useMemo(() => {
    return schema
      .map((group) => ({
        ...group,
        fields: normalizedSearch
          ? group.fields.filter((field) => normalize(field.label).includes(normalizedSearch))
          : group.fields,
      }))
      .filter((group) => group.fields.length > 0)
  }, [schema, normalizedSearch])

  function toggleGroup(page) {
    setOpenGroups((prev) => ({ ...prev, [page]: !prev[page] }))
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl text-sea-deep">Site text</h1>
        <p className="mt-4 text-ink/60">Loading text…</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-sea-deep">Site text</h1>
      <p className="mt-2 max-w-2xl text-ink/60">
        Edit the text shown on the site here, in French and English. As long as you don't touch a field, it
        keeps its original text — so you can explore without any risk.
      </p>

      <div className="mt-6">
        <label htmlFor="content-search" className="sr-only">
          Search for text
        </label>
        <input
          id="content-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search for text (e.g.: home, button, title…)"
          className="w-full rounded-full border border-ink/15 bg-white px-5 py-3 text-sm shadow-sm focus:border-sea focus:outline-none focus:ring-1 focus:ring-sea/30"
        />
      </div>

      <div className="mt-6 space-y-3">
        {groups.length === 0 && (
          <p className="rounded-2xl bg-white p-5 text-ink/60 shadow-sm ring-1 ring-ink/5">
            No text matches your search.
          </p>
        )}

        {groups.map((group) => {
          const isOpen = normalizedSearch ? true : Boolean(openGroups[group.page])
          return (
            <section key={group.page} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
              <button
                type="button"
                onClick={() => toggleGroup(group.page)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-display text-base text-ink">{group.pageLabel}</span>
                <span className="flex items-center gap-2 whitespace-nowrap text-sm text-ink/50">
                  {group.fields.length} field{group.fields.length > 1 ? 's' : ''}
                  <span aria-hidden="true" className="inline-block">
                    {isOpen ? '▾' : '▸'}
                  </span>
                </span>
              </button>
              {isOpen && (
                <div className="space-y-3 border-t border-ink/10 bg-lavender-wash/40 px-4 py-5 sm:px-5">
                  {group.fields.map((field) => (
                    <ContentField
                      key={field.key}
                      fieldKey={field.key}
                      label={field.label}
                      multiline={field.multiline}
                      initialOverride={overrides[field.key]}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
