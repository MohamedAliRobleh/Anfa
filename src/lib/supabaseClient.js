import { createClient } from '@supabase/supabase-js'

// Fall back to placeholder values so a missing .env doesn't crash createClient()
// at import time (which would white-screen every page, since this module is
// imported transitively from App). Real inserts simply fail with a network
// error until VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are set for real.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// True once real credentials are set. The admin CMS (content/media/theme
// overrides) uses this to skip network calls entirely rather than wait on a
// request that can only ever fail — e.g. in local dev before .env is set.
export const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function insertBooking(payload) {
  const { error } = await supabase.from('bookings').insert([payload])
  if (error) throw error
}

export async function insertMessage(payload) {
  const { error } = await supabase.from('messages').insert([payload])
  if (error) throw error
}
