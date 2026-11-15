import { supabase, isSupabaseConfigured } from './supabaseClient'
import { withTimeout } from './withTimeout'

// Text overrides are keyed exactly like the i18n dictionaries
// ("home.hero.title") or, for blog posts, "blog.<slug>.title" /
// "blog.<slug>.excerpt" / "blog.<slug>.body". Missing/blank fields mean
// "use the built-in default text" — the admin never has to fill in every
// field, only the ones they want to change.

// Returns { [key]: { fr, en } }. Never throws: on any failure (no .env set,
// network down, RLS misconfigured) it resolves to {} so the site always
// renders its built-in default text.
export async function fetchContentOverrides() {
  if (!isSupabaseConfigured) return {}
  try {
    const { data, error } = await withTimeout(
      supabase.from('content_overrides').select('key, value_fr, value_en')
    )
    if (error) throw error
    const map = {}
    for (const row of data ?? []) {
      map[row.key] = { fr: row.value_fr, en: row.value_en }
    }
    return map
  } catch (err) {
    console.warn('[content_overrides] falling back to default text:', err.message)
    return {}
  }
}

export async function saveContentOverride(key, { valueFr, valueEn }) {
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('content_overrides').upsert({
    key,
    value_fr: valueFr ?? null,
    value_en: valueEn ?? null,
    updated_at: new Date().toISOString(),
    updated_by: userData?.user?.id ?? null,
  })
  if (error) throw error
}

// Deleting the row reverts the field to its built-in default — this is the
// admin's "reset to default" action, with no separate undo history to manage.
export async function resetContentOverride(key) {
  const { error } = await supabase.from('content_overrides').delete().eq('key', key)
  if (error) throw error
}
