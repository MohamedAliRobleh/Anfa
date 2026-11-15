import { supabase, isSupabaseConfigured } from './supabaseClient'
import { withTimeout } from './withTimeout'

// Single row, id='default'. Never throws — on any failure it resolves to
// null so the site keeps the built-in default palette/fonts from
// src/index.css.
export async function fetchSiteTheme() {
  if (!isSupabaseConfigured) return null
  try {
    const { data, error } = await withTimeout(
      supabase.from('site_theme').select('colors, fonts').eq('id', 'default').maybeSingle()
    )
    if (error) throw error
    return data ?? null
  } catch (err) {
    console.warn('[site_theme] falling back to default theme:', err.message)
    return null
  }
}

export async function saveSiteTheme({ colors, fonts }) {
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('site_theme').upsert({
    id: 'default',
    colors: colors ?? null,
    fonts: fonts ?? null,
    updated_at: new Date().toISOString(),
    updated_by: userData?.user?.id ?? null,
  })
  if (error) throw error
}

// Reverts to the built-in default palette/fonts.
export async function resetSiteTheme() {
  const { error } = await supabase.from('site_theme').delete().eq('id', 'default')
  if (error) throw error
}
