import { supabase, isSupabaseConfigured } from './supabaseClient'
import { withTimeout } from './withTimeout'

const BUCKET = 'site-media'

// Media overrides are keyed by a named "slot" (e.g. "home.hero.slide1",
// "blog.managing-anxiety.coverImage") defined in src/content/mediaSlots.js.

// Returns { [slotKey]: { url, altFr, altEn } }. Never throws — on any
// failure it resolves to {} so every image falls back to its built-in default.
export async function fetchMediaOverrides() {
  if (!isSupabaseConfigured) return {}
  try {
    const { data, error } = await withTimeout(
      supabase.from('media_overrides').select('slot_key, url, alt_fr, alt_en')
    )
    if (error) throw error
    const map = {}
    for (const row of data ?? []) {
      map[row.slot_key] = { url: row.url, altFr: row.alt_fr, altEn: row.alt_en }
    }
    return map
  } catch (err) {
    console.warn('[media_overrides] falling back to default images:', err.message)
    return {}
  }
}

// Uploads a replacement image for a slot and returns its public URL. File
// type/size are also enforced server-side by the site-media bucket policy
// (see supabase/migrations/0002_admin_cms.sql) so this check is a fast,
// friendly first line of defense, not the real guard.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 5 * 1024 * 1024

export async function uploadMedia(slotKey, file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format d’image non supporté. Utilisez JPG, PNG, WEBP ou GIF.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image trop volumineuse (maximum 5 Mo).')
  }
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${slotKey.replace(/[^a-zA-Z0-9._-]/g, '_')}-${Date.now()}.${extension}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function saveMediaOverride(slotKey, { url, altFr, altEn }) {
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('media_overrides').upsert({
    slot_key: slotKey,
    url,
    alt_fr: altFr ?? null,
    alt_en: altEn ?? null,
    updated_at: new Date().toISOString(),
    updated_by: userData?.user?.id ?? null,
  })
  if (error) throw error
}

// Deleting the row reverts the slot to its built-in default image.
export async function resetMediaOverride(slotKey) {
  const { error } = await supabase.from('media_overrides').delete().eq('slot_key', slotKey)
  if (error) throw error
}
